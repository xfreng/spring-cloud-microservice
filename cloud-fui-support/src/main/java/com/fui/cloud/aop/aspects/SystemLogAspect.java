package com.fui.cloud.aop.aspects;

import com.alibaba.fastjson.JSONObject;
import com.fui.cloud.aop.annotations.SystemLog;
import com.fui.cloud.common.UserUtils;
import com.fui.cloud.service.logs.SystemLogsService;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.After;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;
import java.lang.reflect.Method;
import java.util.Date;

/**
 * @Title 系统日志切入点
 * @Author 熊世凤 on 2018-01-20.
 * @Copyright © 蜂投网 2015 ~ 2018
 */
@Aspect
@Component
public class SystemLogAspect {
    private static final Logger logger = LoggerFactory.getLogger(SystemLogAspect.class);

    @Autowired
    private HttpServletRequest request;

    @Autowired
    private SystemLogsService systemLogsService;

    //切入注解的路径
    @Pointcut("@annotation(com.fui.cloud.aop.annotations.SystemLog)")
    public void logAspect() {
    }

    /**
     * 后置通知 用于拦截Controller层记录用户的操作
     *
     * @param joinPoint 切点
     */
    @After("logAspect()")
    public void doBefore(JoinPoint joinPoint) {
        //请求的IP
        String ip = request.getRemoteAddr();
        JSONObject json = new JSONObject();
        try {
            json = getOperatorMethodDescription(joinPoint);
        } catch (Exception e) {
            logger.error("日志注解解析出错 {}", e);
        }
        JSONObject data = new JSONObject();
        data.put("logDate", new Date(System.currentTimeMillis()));
        data.put("description", json.getString("description"));
        data.put("ip", ip);
        JSONObject sessionJson = UserUtils.getCurrent();
        if (sessionJson != null) {
            data.put("name", sessionJson.getString("ename"));
        }
        systemLogsService.insert(data);
        logger.info(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>sysLogs:{}", data.toJSONString());
    }

    private JSONObject getOperatorMethodDescription(JoinPoint joinPoint) throws Exception {
        JSONObject json = new JSONObject();
        String targetName = joinPoint.getTarget().getClass().getName();
        String methodName = joinPoint.getSignature().getName();
        Object[] arguments = joinPoint.getArgs();
        Class targetClass = Class.forName(targetName);
        Method[] methods = targetClass.getMethods();
        for (Method method : methods) {
            if (method.getName().equals(methodName)) {
                Class[] clazz = method.getParameterTypes();
                if (clazz.length == arguments.length) {
                    SystemLog systemLog = method.getAnnotation(SystemLog.class);
                    String description = systemLog.description();
                    json.put("description", description);
                    break;
                }
            }
        }
        return json;
    }
}
