package com.fui.cloud.service.appservice;

import com.fui.cloud.service.appservice.common.AbstractAppSuperService;
import com.fui.cloud.service.appservice.common.ErrCodeAndMsg;
import com.fui.cloud.service.appservice.message.APPMessage;
import org.springframework.stereotype.Service;

/**
 * @author sf.xiong on 2017/08/04.
 * @Title 登录接口服务类
 * @Description 处理登录请求
 */
@Service("appUserLoginService")
public class AppUserLoginService extends AbstractAppSuperService {

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
