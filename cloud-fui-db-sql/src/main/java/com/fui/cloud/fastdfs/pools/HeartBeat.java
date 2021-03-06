package com.fui.cloud.fastdfs.pools;

import org.csource.fastdfs.TrackerServer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Timer;
import java.util.TimerTask;
import java.util.UUID;
import java.util.concurrent.LinkedBlockingQueue;
import java.util.concurrent.TimeUnit;

/**
 * @Title FastDFS 连接池定时器设置
 */
public class HeartBeat {
    private static final Logger logger = LoggerFactory.getLogger(HeartBeat.class);
    /**
     * fastdfs连接池
     */
    private FastDfsConnectionPool pool = null;
    /**
     * 小时毫秒数
     */
    private int ahour;
    /**
     * 等待时间
     */
    private int waitTime;

    public HeartBeat(FastDfsConnectionPool pool) {
        this.pool = pool;
    }

    /**
     * 定时执行任务，检测当前的空闲连接是否可用，如果不可用将从连接池中移除
     */
    public void beat() {
        logger.info("[心跳任务方法（beat）]");
        TimerTask task = new TimerTask() {
            @Override
            public void run() {
                String logId = UUID.randomUUID().toString();
                logger.info("[心跳任务方法（beat） logId = {} Description:对idleConnectionPool中的TrackerServer进行监测"
                        , logId);
                LinkedBlockingQueue<TrackerServer> idleConnectionPool = pool.getIdleConnectionPool();
                TrackerServer ts = null;
                for (int i = 0; i < idleConnectionPool.size(); i++) {
                    try {
                        ts = idleConnectionPool.poll(waitTime, TimeUnit.SECONDS);
                        if (ts != null) {
                            org.csource.fastdfs.ProtoCommon.activeTest(ts.getSocket());
                            idleConnectionPool.add(ts);
                        } else {
                            /** 代表已经没有空闲长连接 */
                            break;
                        }
                    } catch (Exception e) {
                        /** 发生异常,要删除，进行重建 */
                        logger.error("[心跳任务方法（beat）][logId = {}][异常：当前连接已不可用将进行重新获取连接]", logId);
                        pool.drop(ts, logId);
                    }
                }
            }
        };
        Timer timer = new Timer(true); //后台线程
        timer.schedule(task, ahour, ahour);
    }

    public int getAhour() {
        return ahour;
    }

    public void setAhour(int ahour) {
        this.ahour = ahour;
    }

    public int getWaitTime() {
        return waitTime;
    }

    public void setWaitTime(int waitTime) {
        this.waitTime = waitTime;
    }
}
