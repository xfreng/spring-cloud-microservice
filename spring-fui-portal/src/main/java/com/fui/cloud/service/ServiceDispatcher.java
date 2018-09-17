package com.fui.cloud.service;

import com.fui.cloud.service.appservice.common.*;
import com.fui.cloud.service.appservice.message.APPMessage;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import javax.servlet.http.HttpServletRequest;

/**
 * @author sf.xiong on 2017/08/04.
 * @Title 对外接口服务入口
 * @Description 统一接收来自外部的服务请求，进行相关预处理，再分发给相应的接口服务类进行处理
 */
@Controller
@RequestMapping(value = "/interface/app")
public class ServiceDispatcher {
    private static final Logger logger = LoggerFactory.getLogger(ServiceDispatcher.class);  //日志服务

    @Autowired
    private AppServiceProvider serviceConfig;

    /**
     * APP接口服务处理
     *
     * @return 响应消息（JSON）
     */
    @RequestMapping(value = "/service", produces = APPServiceConstants.MEDIATYPE_APPLICATION_JSON)
    @ResponseBody
    public String appServiceHandle(HttpServletRequest request) {
        //获取拦截器预处理后的请求消息对象
        APPMessage requestMsg = (APPMessage) request.getAttribute("requestMsg");
        if (requestMsg == null) {
            logger.error("request中获取的请求消息对象(来自拦截器)为空");
            APPMessage responseMsg = new APPMessage();
            responseMsg.setErrCodeAndMsg(ErrCodeAndMsg.FAIL);
            return responseMsg.toJsonEncrypt();
        }

        //初始化响应消息对象
        String transCode = requestMsg.getTranscode();
        APPMessage responseMsg = new APPMessage(transCode);
        responseMsg.setErrCodeAndMsg(ErrCodeAndMsg.FAIL);

        //请求消息公共参数校验
        String device = (String) requestMsg.getBodyParam("device");
        if (device == null) {
            logger.error("device is required");
            responseMsg.setErrCodeAndMsg(ErrCodeAndMsg.DEVICE_REQUIRED);
            return responseMsg.toJsonEncrypt();
        }
        if (!(APPServiceConstants.DEVICE_IOS.equals(device) || APPServiceConstants.DEVICE_ANDROID.equals(device))) {
            logger.error("device error: " + device);
            responseMsg.setErrCodeAndMsg(ErrCodeAndMsg.DEVICE_ERROR);
            return responseMsg.toJsonEncrypt();
        }
        String machineCode = (String) requestMsg.getBodyParam("machineCode");
        if (StringUtils.isBlank(machineCode)) { //machineCode为空
            logger.error("machineCode is required");
            responseMsg.setErrCodeAndMsg(ErrCodeAndMsg.MACHINECODE_REQUIRED);
            return responseMsg.toJsonEncrypt();
        }

        /**
         * 根据接口交易码 去服务提供商中获取对应实例
         *              具体请参考 applicationContext-bean.xml 文件中   --   App接口服务注册
         *
         */
        AbstractAppSuperService appService =
                serviceConfig.getServiceConfigInstance(transCode);
        if (appService == null) {
            logger.error("transCode error: " + transCode);
            responseMsg.setErrCodeAndMsg(ErrCodeAndMsg.TRANSCODE_ERROR);
            return responseMsg.toJsonEncrypt();
        }

        //获取客户端ip地址
        try {
            String ipAddress = NetworkUtils.getIpAddress(request);
            logger.info("ipAddress from request: {}", ipAddress);
            requestMsg.addBodyParam("ipAddress", ipAddress);
        } catch (Exception e) {
            logger.error("NetworkUtil.getIpAddress() Exception: {}", e);
        }

        //调用相应的接口处理请求
        try {
            appService.handleRequest(requestMsg, responseMsg);
        } catch (Exception e) {
            logger.error("Exception: " + e);
            responseMsg = new APPMessage(requestMsg.getTranscode());
            responseMsg.setErrCodeAndMsg(ErrCodeAndMsg.FAIL);
        }
        if (PortalConstants.IS_ENCRYPTION) {//需要加密
            logger.info("response(加密): " + responseMsg.toJsonEncrypt());
            return responseMsg.toJsonEncrypt();
        } else {
            logger.info("response: " + responseMsg.toJson());
            return responseMsg.toJson();
        }
    }

    /**
     * APP上传接口服务处理
     *
     * @return 响应消息（JSON）
     */
    @RequestMapping(value = "/upload", produces = MediaType.MULTIPART_FORM_DATA_VALUE)
    @ResponseBody
    public String appUploadServiceHandle(MultipartHttpServletRequest request) {
        String transCode = request.getParameter("transcode"); //接口交易码
        APPMessage responseMsg = new APPMessage(transCode);
        AbstractAppSuperService appService =
                serviceConfig.getServiceConfigInstance(transCode);
        if (appService == null) {
            logger.error("transCode error: " + transCode);
            responseMsg.setErrCodeAndMsg(ErrCodeAndMsg.TRANSCODE_ERROR);
            if (PortalConstants.IS_ENCRYPTION) {//需要加密
                logger.info("response(加密): " + responseMsg.toJsonEncrypt());
                return responseMsg.toJsonEncrypt();
            } else {
                return responseMsg.toJson();
            }
        }
        try {
            appService.handleRequest(request, responseMsg);
        } catch (Exception e) {
            logger.error("Exception: " + e);
            responseMsg.setErrCodeAndMsg(ErrCodeAndMsg.FAIL);
        }
        logger.info("response: " + responseMsg.toJson());
        if (PortalConstants.IS_ENCRYPTION) {//需要加密
            logger.info("response(加密): " + responseMsg.toJsonEncrypt());
            return responseMsg.toJsonEncrypt();
        } else {
            return responseMsg.toJson();
        }
    }
}
