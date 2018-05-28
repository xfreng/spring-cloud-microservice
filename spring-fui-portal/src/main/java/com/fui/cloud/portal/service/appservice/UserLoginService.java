package com.fui.cloud.portal.service.appservice;

import com.fui.cloud.portal.service.appservice.common.AbstractSuperService;
import com.fui.cloud.portal.service.appservice.common.ErrCodeAndMsg;
import com.fui.cloud.portal.service.appservice.message.APPMessage;
import org.springframework.stereotype.Service;

/**
 * @author sf.xiong on 2017/08/04.
 * @Title 登录接口服务类
 * @Description 处理登录请求
 */
@Service("userLoginService")
public class UserLoginService extends AbstractSuperService {

    /**
     * 处理APP登录请求
     *
     * @param requestMsg  请求消息对象
     * @param responseMsg 响应消息对象
     */
    @Override
    public void handleRequest(APPMessage requestMsg, APPMessage responseMsg) {
        logger.info("in...");

        responseMsg.addBodyParam("message","请求成功");

        responseMsg.setErrCodeAndMsg(ErrCodeAndMsg.SUCCESS);
    }
}
