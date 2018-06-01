package com.fui.cloud.service.appservice.common;


import com.fui.cloud.controller.AbstractSuperController;
import com.fui.cloud.service.appservice.message.APPMessage;
import org.springframework.web.multipart.MultipartHttpServletRequest;

/**
 * @author sf.xiong on 2017/08/04.
 * @Title APP接口抽象服务类
 * @Description 所有APP接口服务类均需继承此类
 */
public abstract class AbstractAppSuperService extends AbstractSuperController {

    /**
     * 处理APP请求
     * 所有需登录接口的服务类可调用此方法进行公共参数校验
     *
     * @param requestMsg  请求消息对象
     * @param responseMsg 响应消息对象
     */
    public void handleRequest(APPMessage requestMsg, APPMessage responseMsg) {
    }

    /**
     * 处理APP上传文件请求
     *
     * @param request     请求对象
     * @param responseMsg 响应消息对象
     */
    public void handleRequest(MultipartHttpServletRequest request, APPMessage responseMsg) {
    }
}
