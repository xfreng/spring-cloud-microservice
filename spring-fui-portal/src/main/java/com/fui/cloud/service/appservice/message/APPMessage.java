package com.fui.cloud.service.appservice.message;

import com.fui.cloud.common.CommonConstants;
import com.fui.cloud.service.appservice.common.DES3EncryptAndEdcrypt;
import com.fui.cloud.service.appservice.common.DigestUtils;
import com.fui.cloud.service.appservice.common.ErrCodeAndMsg;
import com.fui.cloud.service.appservice.common.GsonUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.builder.ReflectionToStringBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.Map;

/**
 * @Title APP接口消息体
 * @Author sf.xiong on 2017/08/04.
 */
public class APPMessage {
    private static final Logger log = LoggerFactory.getLogger(APPMessage.class);    //日志服务
    private MessageHeader header = new MessageHeader();                  //消息header
    private Map<String, Object> body = new HashMap<String, Object>();                 //消息body
    private String key = null;                                           //消息key

    public APPMessage() {
    }

    public APPMessage(String transcode) {
        this.header.setTranscode(transcode);
    }

    public String getTranscode() {
        return this.header.getTranscode();
    }

    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }

    public void setErrCodeAndMsg(ErrCodeAndMsg errCodeAndMsg) {
        this.header.setErrCode(errCodeAndMsg.getErrCode());
        this.header.setErrMsg(errCodeAndMsg.getErrMsg());
    }

    public void setErrMsg(String errMsg) {
        if (StringUtils.isNotBlank(errMsg)) {
            this.header.setErrMsg(errMsg);
        }
    }

    public Object getBodyParam(String key) {
        return this.body.get(key);
    }

    public void addBodyParam(String key, Object value) {
        this.body.put(key, value);
    }

    //转换成json(加密及签名)
    public String toJsonEncrypt() {
        Map<String, Object> map = new HashMap<String, Object>();
        Map<String, Object> dataMap = new HashMap<String, Object>();
        if (this.header != null) {
            dataMap.put("header", this.header);
        }
        if (this.body != null && !this.body.isEmpty()) {
            dataMap.put("body", this.body);
        }
        String dataJson = GsonUtils.toJson(dataMap, CommonConstants.PARTTERN_YYYY_MM_DD_HH_MM_SS);
        try {
            dataJson = DES3EncryptAndEdcrypt.DES3EncryptMode(dataJson);
        } catch (Exception e) {
            log.error("加密错误：" + e);
        }
        if (this.key == null) {
            this.key = generateKey(dataJson);
        }
        map.put("data", this.key + dataJson);
        //map.put("key", this.key);
        return GsonUtils.toJson(map, CommonConstants.PARTTERN_YYYY_MM_DD_HH_MM_SS);
    }

    //转换成json(原文+签名)
    public String toJson() {
        Map<String, Object> map = new HashMap<String, Object>();
        Map<String, Object> dataMap = new HashMap<String, Object>();
        if (this.header != null) {
            dataMap.put("header", this.header);
        }
        if (this.body != null && !this.body.isEmpty()) {
            dataMap.put("body", this.body);
        }
        String dataJson = GsonUtils.toJson(dataMap, CommonConstants.PARTTERN_YYYY_MM_DD_HH_MM_SS);
        if (this.key == null) {
            this.key = generateKey(dataJson);
        }
        map.put("data", dataMap);
        map.put("key", this.key);
        return GsonUtils.toJson(map, CommonConstants.PARTTERN_YYYY_MM_DD_HH_MM_SS);
    }

    //进行MD5计算并写入key
    private String generateKey(String dataJson) {
        //MD5计算(data的值+transcode的值)
        try {
            return DigestUtils.md5(dataJson + this.header.getTranscode()).toUpperCase();
        } catch (Exception e) {
            log.error("MD5错误：" + e);
        }
        return null;
    }

    @Override
    public String toString() {
        return ReflectionToStringBuilder.toString(this);
    }
}

/**
 * @Title APP接口返回结果（header部分）
 * @Author : xiaogang on 2016/12/5.
 */
class MessageHeader {
    private String transcode;   //接口代码
    private String errCode;     //错误码
    private String errMsg;      //错误描述

    public String getTranscode() {
        return transcode;
    }

    public void setTranscode(String transcode) {
        this.transcode = transcode;
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

    @Override
    public String toString() {
        return ReflectionToStringBuilder.toString(this);
    }
}
