package com.fui.cloud.service.appservice.common;

/**
 * @Title 前段常量
 * @Author sf.xiong on 2017/10/24.
 */
public interface PortalConstants {

    //APP请求传输是否加密
    boolean IS_ENCRYPTION = true;//"1".equals(CommonConfiguration.getValue("fui.encryption"));

    //APP请求传输是否解密
    boolean IS_DECRYPTION = true;//"1".equals(CommonConfiguration.getValue("fui.decryption"));

    //文件上传目录
    String FILE_UPLOAD_DIR = "";//CommonConfiguration.getValue("file.upload.dir");
    String FILE_UPLOAD_CONTEXT_PATH = "";//CommonConfiguration.getValue("file.upload.context.path");
    String SERVER_HOST = "";//CommonConfiguration.getValue("server.host");
}