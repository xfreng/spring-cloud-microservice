package com.fui.cloud.aop.annotations;

import java.lang.annotation.*;

/**
 * @Title 系统日志注解
 * @Author sf.xiong on 2018-01-20.
 */
@Target({ElementType.PARAMETER, ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface SystemLog {
    String description() default "";
}
