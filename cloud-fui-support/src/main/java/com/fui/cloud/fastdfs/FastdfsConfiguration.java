package com.fui.cloud.fastdfs;

import com.fui.cloud.fastdfs.pools.FastDfsConnectionPool;
import com.fui.cloud.fastdfs.pools.HeartBeat;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.context.config.annotation.RefreshScope;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@RefreshScope
@Configuration
public class FastdfsConfiguration {

    @Value("${fastdfs.enable:false}")
    private boolean enable;

    @Value("${fastdfs.clientConf:conf/fastdfs_client.conf}")
    private String clientConf;
    /**
     * 连接池默认最小连接数
     */
    @Value("${fastdfs.minPoolSize:10}")
    private long minPoolSize;
    /**
     * 连接池默认最大连接数
     */
    @Value("${fastdfs.maxPoolSize:30}")
    private long maxPoolSize;
    /**
     * 默认等待时间（单位：秒）
     */
    @Value("${fastdfs.waitTime:200}")
    private long waitTime;

    @Value("${fastdfs.uploadFileHost}")
    private String uploadFileHost;
    /**
     * 小时毫秒数
     */
    @Value("${fastdfs.heartbeatTime:3600000}")
    private int heartbeatTime;
    /**
     * 等待时间
     */
    @Value("${fastdfs.heartbeatWaitTime:200}")
    private int heartbeatWaitTime;

    @Bean
    public HeartBeat heartBeat() {
        HeartBeat beat = new HeartBeat(connectionPool());
        beat.setAhour(heartbeatTime);
        beat.setWaitTime(heartbeatWaitTime);
        if (enable) {
            beat.beat();
        }
        return beat;
    }

    @Bean
    public FastDfsConnectionPool connectionPool() {
        FastDfsConnectionPool connectionPool = new FastDfsConnectionPool();
        connectionPool.setClientConf(clientConf);
        connectionPool.setMaxPoolSize(maxPoolSize);
        connectionPool.setMinPoolSize(minPoolSize);
        connectionPool.setWaitTimes(waitTime);
        return connectionPool;
    }

    @Bean
    public FastDfsUtils fastDfsUtils() {
        FastDfsUtils fastDfsUtils = new FastDfsUtils();
        fastDfsUtils.setUploadFileHost(uploadFileHost);
        fastDfsUtils.setEnable(enable);
        fastDfsUtils.setConnectionPool(connectionPool());
        return fastDfsUtils;
    }
}
