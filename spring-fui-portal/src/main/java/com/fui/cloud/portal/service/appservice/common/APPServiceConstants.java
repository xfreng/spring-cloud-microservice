package com.fui.cloud.portal.service.appservice.common;

/**
 * @Title APP接口服务常量类
 * @Author sf.xiong on 2017/08/04.
 */
public class APPServiceConstants {
    //响应JSON格式
    public static final String MEDIATYPE_APPLICATION_JSON = "application/json;charset=utf-8";

    //图形验证码 存储在session中的key值L
    public static final String IMAGE_VALIDATE_CODE = "IMAGE_VALIDATE_CODE";

    //device设备类别
    public static final String DEVICE_IOS = "ios";          //ios
    public static final String DEVICE_ANDROID = "android";  //android

    //codeType短信验证码用途
    public static final int CODETYPE_REGISTER = 0;  //注册
    public static final int CODETYPE_MODPWD = 1;    //修改密码
    public static final int CODETYPE_FINDPWD = 2;   //找回密码
}
