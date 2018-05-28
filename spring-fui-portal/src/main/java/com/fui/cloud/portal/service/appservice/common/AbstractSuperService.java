package com.fui.cloud.portal.service.appservice.common;


import com.fui.cloud.portal.service.appservice.message.APPMessage;
import com.google.common.cache.CacheBuilder;
import com.google.common.cache.CacheLoader;
import com.google.common.cache.LoadingCache;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import javax.servlet.http.HttpServletRequest;
import java.util.concurrent.TimeUnit;

/**
 * @author sf.xiong on 2017/08/04.
 * @Title APP接口抽象服务类
 * @Description 所有APP接口服务类均需继承此类
 */
public abstract class AbstractSuperService {
    protected static final Logger logger = LoggerFactory.getLogger(AbstractSuperService.class);  //日志服务

    protected HttpServletRequest request;

    public void setRequest(HttpServletRequest request) {
        this.request = request;
    }

    /**
     * 处理APP请求
     * 所有需登录接口的服务类可调用此方法进行公共参数校验
     *
     * @param requestMsg  请求消息对象
     * @param responseMsg 响应消息对象
     */
    public void handleRequest(APPMessage requestMsg, APPMessage responseMsg) {
    }

    /**
     * 处理APP上传文件请求
     *
     * @param request     请求对象
     * @param responseMsg 响应消息对象
     */
    public void handleRequest(MultipartHttpServletRequest request, APPMessage responseMsg) {
    }

    /**
     * 非开发环境下；设置频繁操作限制 1分钟只能操作一次
     *
     * @param key
     * @param rateLimiterCache
     * @return boolean
     */
    public boolean exceedsRateLimit(String key, LoadingCache<String, RateLimiter> rateLimiterCache) {
        return exceedsRateLimit(key, rateLimiterCache, 60000, 1);
    }

    /**
     * 频度操作控制 基于本地缓存
     *
     * @param id                    key值
     * @param rateLimiterCache      缓存对象
     * @param timeSpanInmilicesonds 时间秒为单位
     * @param times                 次数
     * @return boolean
     */
    public boolean exceedsRateLimit(String id, LoadingCache<String, RateLimiter> rateLimiterCache, int timeSpanInmilicesonds, int times) {
        RateLimiter rl = null;
        try {
            rl = rateLimiterCache.get(id);
        } catch (Exception e) {
            logger.warn("根据 ID = {} 没有获取到访问频次信息；", id, e.getMessage());
        }
        if (rl == null) {
            rl = new RateLimiter(timeSpanInmilicesonds, times);//一分钟内最多访问10次
            rl.getEvictingQueue().add(System.currentTimeMillis());
            rateLimiterCache.put(id, rl);
            return false;
        }
        long oldestRequestTime = rl.getEvictingQueue().peek();
        long nowInMilisecs = System.currentTimeMillis();
        boolean exceeded = nowInMilisecs - oldestRequestTime < rl.getTimeSpan()
                && rl.getEvictingQueue().size() == rl.getMaxRequests();
        if (!exceeded) {
            rl.getEvictingQueue().add(System.currentTimeMillis());
            rateLimiterCache.put(id, rl);
        }
        return exceeded;
    }

    @Bean
    public LoadingCache<String, RateLimiter> timeLimiterCache() {
        LoadingCache<String, RateLimiter> timeLimiterCache =
                CacheBuilder.newBuilder()
                        .expireAfterAccess(30, TimeUnit.MINUTES) // cache will expire after 30 minutes of access
                        .build(new CacheLoader<String, RateLimiter>() { // build the cacheloader

                            @Override
                            public RateLimiter load(String empId) throws Exception {
                                //make the expensive call
                                return null;
                            }
                        });
        return timeLimiterCache;
    }
}
