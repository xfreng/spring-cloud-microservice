package com.fui.cloud.core.ef.tag.taginfo;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * @Author sf.xiong
 * @Date 2017-12-14
 */
@Target({ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
public @interface TagAttrInfoAnnotation {
    String tagName() default "";

    String attrName() default "";

    String attrPrior() default "3";

    boolean attrRequired() default false;

    String attrDefault() default "";

    String[] attrValList() default {};

    String attrGroup() default "";

    String attrDesc() default "";

    String supportVersion() default "1.0";
}
