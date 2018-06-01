/**
 * ClassName: GloableFilter
 * CopyRight: cricket
 * Date: 2015/1/30
 * Version: 1.0
 */
package com.fui.cloud.filter;

import com.fui.cloud.common.CommonConstants;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Arrays;
import java.util.Map;

/**
 * @author : sf.xiong
 */
public class GloableFilter implements Filter {
    private static final Logger log = LoggerFactory.getLogger(GloableFilter.class);

    public void init(FilterConfig filterConfig) throws ServletException {
    }

    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse
            , FilterChain filterChain) throws IOException, ServletException {
        HttpServletRequest request = (HttpServletRequest) servletRequest;
        HttpServletResponse response = (HttpServletResponse) servletResponse;
        if (!isSkip(request.getRequestURL().toString())) {//non static URI
            String method = request.getMethod();
            if ("post".equalsIgnoreCase(method)) {
                request.setCharacterEncoding(CommonConstants.DEFAULT_CHARACTER);
            } else if ("get".equalsIgnoreCase(method)) {
                request = new GetRequestDecorator(request);
            }

            if (log.isInfoEnabled()) {
                log.info("请求 => {}", parseRequest(request));
            }
        }
        //设置jQuery ajax跨域请求 added by sf.xiong
        response.addHeader("content-type", "application:json;charset=utf8");
        response.addHeader("Access-Control-Allow-Origin", "*");
        response.addHeader("Access-Control-Allow-Methods", "POST");
        response.addHeader("Access-Control-Allow-Headers", "x-requested-with,content-type");
        filterChain.doFilter(request, servletResponse);
    }

    public void destroy() {
    }

    /**
     * 输出所有请求和请求的参数
     *
     * @param request 请求
     * @return 请求输出
     */
    private static String parseRequest(HttpServletRequest request) {
        Map map = request.getParameterMap();
        String result = request.getRequestURL().toString();
        StringBuilder params = new StringBuilder();
        params.append(result);
        params.append(" \t params:{");
        int index = 0;
        for (Object name : map.keySet()) {
            if (index > 0) {
                params.append(",");
            }
            index++;
            params.append(name);
            params.append("=");
            params.append(Arrays.toString((String[]) map.get(name)));

        }
        params.append("}");
        return params.toString();
    }

    /**
     * 是否静态资源
     *
     * @param url url地址
     * @return true/false
     */
    private boolean isSkip(String url) {
        return url.matches(".*(css|jpg|png|gif|js|ico)");
    }
}