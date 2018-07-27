package com.fui.cloud.interceptor;

import com.alibaba.fastjson.JSONObject;
import com.fui.cloud.common.RequestContext;
import com.fui.cloud.common.TokenUtils;
import com.fui.cloud.common.UserUtils;
import com.fui.cloud.model.ManageToken;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.xml.ws.Response;

public class LoginInterceptor extends HandlerInterceptorAdapter {
    private final Logger logger = LoggerFactory.getLogger(LoginInterceptor.class);

    private String[] allowUrls;
    @Autowired
    private TokenUtils tokenUtil;

    public void setAllowUrls(String[] allowUrls) {
        this.allowUrls = allowUrls;
    }

    /**
     * 在业务处理器处理请求之前被调用 如果返回false 从当前的拦截器往回执行所有拦截器的afterCompletion(),再退出拦截器链
     * <p>
     * 如果返回true 执行下一个拦截器,直到所有的拦截器都执行完毕 再执行被拦截的Controller 然后进入拦截器链,
     * 从最后一个拦截器往回执行所有的postHandle() 接着再从最后一个拦截器往回执行所有的afterCompletion()
     */
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
            throws Exception {
        logger.trace("==============执行顺序: 1、preHandle================");
        String requestUri = request.getRequestURI();

        logger.trace("requestUri:" + requestUri);

        String xRequestedWith = request.getHeader("x-requested-with");

        logger.trace("xRequestedWith:" + xRequestedWith);

        for (String url : allowUrls) {
            if (requestUri.endsWith(url)) {
                return true;
            }
        }

        ManageToken manageToken = UserUtils.getManageToken();
        if (manageToken != null) {  //session未超时且存在token
            JSONObject res = tokenUtil.checkManageToken(manageToken);
            if (res.getInteger("status").equals(1)) {  //token验证通过
                return true;
            }
        }
        logger.trace("Interceptor：跳转到login页面！");
        if (RequestContext.isAjaxRequest(request)) {
            response.getWriter().write("timeout");
        } else {
            response.sendRedirect(request.getContextPath() + "/index");
        }
        return false;
    }

    /**
     * 在业务处理器处理请求执行完成后,生成视图之前执行的动作 可在modelAndView中加入数据，比如当前时间
     */
    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler,
                           ModelAndView modelAndView) throws Exception {
        logger.trace("==============执行顺序: 2、postHandle================");
    }

    /**
     * 在DispatcherServlet完全处理完请求后被调用,可用于清理资源等
     * <p>
     * 当有拦截器抛出异常时,会从当前拦截器往回执行所有的拦截器的afterCompletion()
     */
    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex)
            throws Exception {
        logger.trace("==============执行顺序: 3、afterCompletion================");
    }
}
