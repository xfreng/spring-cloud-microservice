package com.fui.cloud.fastdfs.pools;

import org.csource.fastdfs.ClientGlobal;
import org.csource.fastdfs.TrackerClient;
import org.csource.fastdfs.TrackerServer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.util.ClassUtils;

import java.io.IOException;
import java.util.concurrent.LinkedBlockingQueue;
import java.util.concurrent.TimeUnit;

/**
 * @Title fastdfs连接池
 */
public class FastDfsConnectionPool {
    /**
     * 空闲的连接池
     */
    private LinkedBlockingQueue<TrackerServer> idleConnectionPool = null;
    /**
     * 连接池默认最小连接数
     */
    private long minPoolSize;
    /**
     * 连接池默认最大连接数
     */
    private long maxPoolSize;
    /**
     * 当前创建的连接数
     */
    private volatile long nowPoolSize = 0;
    /**
     * 默认等待时间（单位：秒）
     */
    private long waitTimes;
    /**
     * fastdfs客户端创建连接默认1次
     */
    private static final int COUNT = 1;

    private String clientConf;

    private static final Logger logger = LoggerFactory.getLogger(FastDfsConnectionPool.class);

    /**
     * 连接池初始化 (在加载当前FastDfsConnectionPool时执行)
     * 1).加载配置文件
     * 2).空闲连接池初始化；
     * 3).创建最小连接数的连接，并放入到空闲连接池；
     */
    public void poolInit(String logId) {
        try {
            /** 加载配置文件 */
            initClientGlobal();
            /** 初始化空闲连接池 */
            idleConnectionPool = new LinkedBlockingQueue<TrackerServer>();
            /** 往连接池中添加默认大小的连接 */
            for (int i = 0; i < minPoolSize; i++) {
                createTrackerServer(logId, COUNT);
            }
        } catch (Exception e) {
            logger.error("[FASTDFS初始化(init)--异常][logId={} ][异常：{}]", logId, e);
        }
    }

    /**
     * 创建TrackerServer,并放入空闲连接池
     */
    public void createTrackerServer(String logId, int flag) {
        logger.info("[创建TrackerServer(createTrackerServer)][" + logId + "]");
        TrackerServer trackerServer = null;
        try {
            TrackerClient trackerClient = new TrackerClient();
            trackerServer = trackerClient.getConnection();
            while (trackerServer == null && flag < 5) {
                logger.info("[创建TrackerServer(createTrackerServer)][ logId = {}][第 flag = {} 次重建]", logId, flag);
                flag++;
                initClientGlobal();
                trackerServer = trackerClient.getConnection();
            }
            org.csource.fastdfs.ProtoCommon.activeTest(trackerServer.getSocket());
            idleConnectionPool.add(trackerServer);
            /** 同一时间只允许一个线程对nowPoolSize操作 **/
            synchronized (this) {
                nowPoolSize++;
            }
        } catch (Exception e) {
            logger.error("[创建TrackerServer(createTrackerServer)][logId = {}][异常：{}]", logId, e);
        } finally {
            if (trackerServer != null) {
                try {
                    trackerServer.close();
                } catch (Exception e) {
                    logger.error("[创建TrackerServer(createTrackerServer)--关闭trackerServer异常][logId = {}][异常：{}]"
                            , logId, e);
                }
            }
        }
    }

    /**
     * @throws AppException
     * @Description: 获取空闲连接 1).在空闲池（idleConnectionPool)中弹出一个连接；
     * 2).把该连接放入忙碌池（busyConnectionPool）中; 3).返回 connection
     * 4).如果没有idle connection, 等待 wait_time秒, and check again
     */
    public TrackerServer checkout(String logId) throws AppException {
        logger.info("[获取空闲连接(checkout)][ logId = {}]", logId);
        TrackerServer trackerServer = idleConnectionPool.poll();
        if (trackerServer == null) {
            if (nowPoolSize < maxPoolSize) {
                createTrackerServer(logId, COUNT);
                try {
                    trackerServer = idleConnectionPool.poll(waitTimes, TimeUnit.SECONDS);
                } catch (Exception e) {
                    logger.error("[获取空闲连接(checkout)-error][logId={}][error:获取连接超时:{}]", logId, e);
                    throw ERRORS.WAIT_IDLECONNECTION_TIMEOUT.ERROR();
                }
            }
            if (trackerServer == null) {
                logger.error("[获取空闲连接(checkout)-error][logId = {} ][error:获取连接超时 waitTimes={} s）]", logId);
                throw ERRORS.WAIT_IDLECONNECTION_TIMEOUT.ERROR();
            }
        }
        logger.info("[获取空闲连接(checkout)][logId = {}][获取空闲连接成功]", logId);
        return trackerServer;
    }

    /**
     * 释放繁忙连接 1.如果空闲池的连接小于最小连接值，就把当前连接放入idleConnectionPool；
     * 2.如果空闲池的连接等于或大于最小连接值，就把当前释放连接丢弃；
     *
     * @param trackerServer 需释放的连接对象
     */
    public void checkin(TrackerServer trackerServer, String logId) {
        logger.info("[释放当前连接(checkin)][logId = {}][prams: trackerServer = {}", logId);
        if (trackerServer != null) {
            if (idleConnectionPool.size() < minPoolSize) {
                idleConnectionPool.add(trackerServer);
            } else {
                synchronized (this) {
                    if (nowPoolSize != 0) {
                        nowPoolSize--;
                    }
                }
            }
        }
    }

    /**
     * 删除不可用的连接，并把当前连接数减一（调用过程中trackerServer报异常，调用一般在finally中）
     *
     * @param trackerServer
     */
    public void drop(TrackerServer trackerServer, String logId) {
        logger.info("[删除不可用连接方法(drop)][logId = {}][parms:trackerServer = {} ", logId);
        if (trackerServer != null) {
            try {
                synchronized (this) {
                    if (nowPoolSize != 0) {
                        nowPoolSize--;
                    }
                }
                trackerServer.close();
            } catch (IOException e) {
                logger.info("[删除不可用连接方法(drop)--关闭trackerServer异常][logId = {}][异常：{}]", logId, e);
            }
        }
    }


    /**
     * 加载客户端连接配置信息
     *
     * @throws Exception
     */
    private void initClientGlobal() throws Exception {
        /** 客户端连接配置文件 */
        ClassLoader classLoader = ClassUtils.getDefaultClassLoader();
        String path = classLoader.getResource(clientConf).getPath();
        logger.info("加载FastDFS Path = {}", path);
        ClientGlobal.init(path);
    }


    public LinkedBlockingQueue<TrackerServer> getIdleConnectionPool() {
        return idleConnectionPool;
    }

    /**
     * 连接池销毁
     */
    public void destroyPool() {
        for (int i = 0; i < idleConnectionPool.size(); i++) {
            TrackerServer trackerServer = idleConnectionPool.poll();
            if (trackerServer != null) {
                try {
                    trackerServer.close();
                } catch (IOException e) {
                    logger.info("[删除不可用连接方法(drop)--关闭trackerServer异常][异常：{}]", e);
                }
            }
        }
        synchronized (this) {
            nowPoolSize = 0;
            idleConnectionPool.clear();
        }
    }

    public long getMinPoolSize() {
        return minPoolSize;
    }

    public void setMinPoolSize(long minPoolSize) {
        this.minPoolSize = minPoolSize;
    }

    public long getMaxPoolSize() {
        return maxPoolSize;
    }

    public void setMaxPoolSize(long maxPoolSize) {
        this.maxPoolSize = maxPoolSize;
    }

    public long getNowPoolSize() {
        return nowPoolSize;
    }

    public void setNowPoolSize(long nowPoolSize) {
        this.nowPoolSize = nowPoolSize;
    }

    public long getWaitTimes() {
        return waitTimes;
    }

    public void setWaitTimes(long waitTimes) {
        this.waitTimes = waitTimes;
    }

    public String getClientConf() {
        return clientConf;
    }

    public void setClientConf(String clientConf) {
        this.clientConf = clientConf;
    }
}
