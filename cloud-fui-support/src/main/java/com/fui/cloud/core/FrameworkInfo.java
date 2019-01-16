package com.fui.cloud.core;

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

    public static String getLoginBackground() {
        return "background";
    }

    public static String getProjectEname() {
        return "fui";
    }

    public static String getProjectName() {
        return "jcoffee Demo";
    }

    public static String getLogo() {
        return "logo.png";
    }

    public static String getDev() {
        return "框架研发";
    }

    public static String getTempDir() {
        return "/usr/infogen";
    }
}