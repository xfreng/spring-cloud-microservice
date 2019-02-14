package com.fui.cloud.core.ef.tag.taginfo;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * @Title 标签信息
 * @Author sf.xiong
 * @Date 2017-12-14
 */
@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
public @interface TagInfoAnnotation {
    String tagName() default "";

    String[] parentTag() default {};

    String[] childTag() default {};

    String group() default "";

    String desc() default "";

    String prior() default "";
}
