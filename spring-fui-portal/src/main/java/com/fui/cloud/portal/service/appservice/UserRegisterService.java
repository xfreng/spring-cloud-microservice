package com.fui.cloud.portal.service.appservice;


import com.fui.cloud.portal.service.appservice.common.AbstractSuperService;
import com.fui.cloud.portal.service.appservice.message.APPMessage;
import org.springframework.stereotype.Service;

/**
 * @author sf.xiong on 2017/08/07.
 * @Title 注册接口服务类
 * @Description 处理注册请求
 */
@Service("userRegisterService")
public class UserRegisterService extends AbstractSuperService {


    /**
     * 处理APP注册请求
     *
     * @param requestMsg  请求消息对象
     * @param responseMsg 响应消息对象
     */
    @Override
    public void handleRequest(APPMessage requestMsg, APPMessage responseMsg) {


    }

}
