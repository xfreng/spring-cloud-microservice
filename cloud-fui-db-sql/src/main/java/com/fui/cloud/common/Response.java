package com.fui.cloud.common;

import lombok.Getter;
import lombok.Setter;
import org.apache.commons.lang3.StringUtils;

/**
 * 响应工具类。
 *
 * @author sf.xiong
 */
@Setter
@Getter
public class Response {
    /**
     * 状态码:0 成功 -1 失败
     */
    private Integer code = CommonConstants.SUCCESS_STATUS;
    /**
     * 响应信息
     */
    private String msg = CommonConstants.SUCCESS_STR;
    /**
     * 响应的单个对象
     */
    private Object data;

    public void setData(Object data) {
        this.data = data;
    }

    public void setCodeMsg(Integer code, String msg) {
        if (code != null && code != -1) {
            this.code = code;
        } else {
            this.code = CommonConstants.FAILURE_STATUS;
        }
        if (StringUtils.isNotBlank(msg)) {
            this.msg = msg;
        } else {
            this.msg = CommonConstants.FAILURE_STR;
        }
    }
}