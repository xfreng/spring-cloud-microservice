package com.fui.cloud.core;

import com.fui.cloud.common.MemCachedUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * @Author sf.xiong on 2017/6/29.
 */
public class FrameworkInfo {
    private static final Logger logger = LoggerFactory.getLogger(FrameworkInfo.class);

    private FrameworkInfo() {
        logger.info("********框架配置类********");
    }

    public static String getProjectEname() {
        return "fui";
    }

    public static String getLoginBackground() {
        return MemCachedUtils.getText("login.background", "background");
    }

    public static String getProjectName() {
        return MemCachedUtils.getText("project.name", "jcoffee Demo");
    }

    public static String getLogo() {
        return MemCachedUtils.getText("logo", "logo.png");
    }

    public static String getDev() {
        return MemCachedUtils.getText("dev", "框架研发");
    }
}