package com.fui.cloud.common;

import com.google.common.collect.EvictingQueue;

import java.util.Queue;

/**
 * @Title 访问频率控制器
 * @Author sf.xiong on 2017/08/04.
 */

public class RateLimiter {
    public Queue<Long> getEvictingQueue() {
        return evictingQueue;
    }

    public void setEvictingQueue(Queue<Long> evictingQueue) {
        this.evictingQueue = evictingQueue;
    }

    private Queue<Long> evictingQueue = null;
    private long timeSpan; //频率控制时段长度，以微妙计算
    private int maxRequests; //时段内最多请求次数

    public RateLimiter(long timeSpan, int maxRequests) {
        this.maxRequests = maxRequests;
        if (evictingQueue == null) {
            evictingQueue = EvictingQueue.create(maxRequests);
        }
        this.timeSpan = timeSpan;
    }

    public long getTimeSpan() {
        return timeSpan;
    }

    public void setTimeSpan(long timeSpan) {
        this.timeSpan = timeSpan;
    }

    public int getMaxRequests() {
        return maxRequests;
    }

    public void setMaxRequests(int maxRequests) {
        this.maxRequests = maxRequests;
    }
}
