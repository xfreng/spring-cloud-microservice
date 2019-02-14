package com.fui.cloud.common;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.http.HttpServletRequest;

/**
 * @Title 请求工具类
 */
public class RequestContext {
    private static final Logger logger = LoggerFactory.getLogger(RequestContext.class);

    public static boolean isAjaxRequest(HttpServletRequest request) {
        String requested_with = request.getHeader("x-requested-with");
        if ("XMLHttpRequest".equalsIgnoreCase(requested_with)) {
            return true;
        }
        return false;
    }

    /**
     * 获取请求头 referer
     *
     * @param request
     * @return
     */
    public static String getReferer(HttpServletRequest request) {
        String referer = request.getHeader("referer");
        if (logger.isDebugEnabled()) {
            logger.debug("请求referer ：{}", referer);
        }
        return referer;
    }

    /**
     * 判断服务器是否是本地（即开发环境）
     *
     * @return 如果服务器是本地，则返回 true
     */
    public static boolean isLocalhost(HttpServletRequest request) {
        return request.getRequestURL().toString().contains("localhost")
                || request.getRequestURL().toString().contains("127.0.0.1");
    }

    /**
     * 取网站根路径
     *
     * @return 根路径
     */
    public static String getBasePath(HttpServletRequest request) {
        if (isLocalhost(request)) {
            return request.getScheme() + "://" + request.getServerName() + ":"
                    + request.getServerPort() + request.getContextPath();
        }
        return request.getScheme() + "://" + request.getServerName() + request.getContextPath();
    }
}