package com.fui.cloud.filter;

import com.alibaba.fastjson.JSONObject;
import com.fui.cloud.common.TokenUtils;
import com.fui.cloud.common.UserUtils;
import com.fui.cloud.model.ManageToken;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * @Title 登录检测过滤器
 * @Description 用于检测及处理会话超时及非法登录
 * @Author sf.xiong on 2017/05/04.
 */
public class LoginFilter implements Filter {
    private static final Logger logger = LoggerFactory.getLogger(LoginFilter.class);

    //需要排除的页面
    private String[] excludedPageArray;

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        String excludedPages = filterConfig.getInitParameter("excludedPages");
        if (StringUtils.isNotEmpty(excludedPages)) {
            excludedPageArray = excludedPages.split(",");
        }
    }

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse
            , FilterChain filterChain) throws IOException, ServletException {
        HttpServletRequest request = (HttpServletRequest) servletRequest;
        if (isSkip(request)) {  //判断是否跳过
            filterChain.doFilter(servletRequest, servletResponse);
            return;
        }
        ManageToken manageToken = UserUtils.getManageToken();
        if (manageToken != null) {  //session未超时且存在token
            TokenUtils tokenUtil = new TokenUtils();
            JSONObject res = tokenUtil.checkManageToken(manageToken);
            if (res.getInteger("status").equals(1)) {  //token验证通过
                filterChain.doFilter(servletRequest, servletResponse);
                return;
            }
        }

        if (logger.isDebugEnabled()) {
            logger.debug("请求 url = {} 超时。", request.getRequestURL().toString());
        }

        //登录超时或session失效跳转到登录页面
        HttpServletResponse response = (HttpServletResponse) servletResponse;
        response.sendRedirect(request.getContextPath() + "/index");
    }

    @Override
    public void destroy() {
    }

    /**
     * 是否跳过
     *
     * @param request 请求
     * @return true/false
     */
    private boolean isSkip(HttpServletRequest request) {
        String url = request.getRequestURI();
        if (url.matches(".*(css|jpg|png|gif|js|ico|json)")) {
            return true;
        }
        String pagePrefix;
        for (String page : excludedPageArray) {//判断是否在所配置的需要排除的页面之中
            page = request.getContextPath() + page;
            if (page.endsWith("*")) {  //若以*结尾，表示做前缀匹配
                pagePrefix = page.substring(0, page.length() - 1);
                if (url.startsWith(pagePrefix)) {
                    return true;
                }
            } else {
                if (url.equals(page)) {
                    return true;
                }
            }
        }
        return false;
    }
}
