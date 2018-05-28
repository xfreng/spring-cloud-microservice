package com.fui.cloud.portal.service.appservice.common;

/**
 * @Title APP接口错误码及错误描述
 * @Author sf.xiong on 2017/08/04.
 */
public enum ErrCodeAndMsg {
    SUCCESS("0", null),
    FAIL("1", "系统错误"),

    //common错误
    MD5_ERROR("C0001", "MD5校验不通过"),
    TRANSCODE_REQUIRED("C0101", "transcode为空"),
    TRANSCODE_ERROR("C0102", "transcode错误"),
    DEVICE_REQUIRED("C0103", "device为空"),
    DEVICE_ERROR("C0104", "device错误"),
    APPKEY_REQUIRED("C0105", "appKey为空"),
    APPKEY_ERROR("C0106", "appKey错误"),
    MACHINECODE_REQUIRED("C0107", "machineCode为空"),
    TOKEN_REQUIRED("C0108", "token为空"),
    TOKEN_ERROR("C0109", "token错误"),
    UID_REQUIRED("C0110", "uid为空"),
    UID_ERROR("C0111", "uid错误"),
    DATA_NOT_EXIST("C0112", "数据不存在"),
    OPER_NOT_ALLOWED("C0113", "操作不允许"),
    RECORD_NOT_EXIST("C0114", "暂无记录"),
    OPER_RATE_LIMIT("C0115", "请勿频繁操作"),

    //短信验证码相关
    CODETYPE_REQUIRED("C0201", "codeType为空"),
    CODETYPE_ERROR("C0202", "codeType错误"),
    SMSVCODE_NOT_ALLOWED("C0203", "不允许在超时时间内重复获取短信验证码"),  //最终提示语将在代码中设置

    //用户资料相关（注册信息、身份证信息）
    PHONE_REQUIRED("U0001", "手机号码为空"),
    PHONE_NOT_EXIST("U0002", "手机号码不存在"),
    PWD_REQUIRED("U0003", "pwd为空"),
    IPADDRESS_REQUIRED("U0004", "ipAddress为空"),
    SMSCODE_REQUIRED("U0005", "code为空"),
    PHONE_ALREADY_EXIST("U0006", "phone已存在"),
    SMSCODE_TIMEOUT("U0007", "验证码已过期"),
    SMSCODE_ERROR("U0008", "验证码错误"),


    //资料上传相关
    FILE_UPLOAD_TRANSCODE_ERROR("F0001", "接口交易码错误!"),

    //APP相关接口
    SUGGESTIOIN_REQUIRED("A0001", "suggestion为空");


    private String errCode;  //错误码
    private String errMsg;   //错误描述

    ErrCodeAndMsg(String errCode, String errMsg) {
        this.errCode = errCode;
        this.errMsg = errMsg;
    }

    public String getErrCode() {
        return errCode;
    }

    public void setErrCode(String errCode) {
        this.errCode = errCode;
    }

    public String getErrMsg() {
        return errMsg;
    }

    public void setErrMsg(String errMsg) {
        this.errMsg = errMsg;
    }

}
