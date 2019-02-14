package com.fui.cloud.service;

import com.fui.cloud.service.appservice.common.AbstractAppSuperService;

import java.util.Map;

/**
 * @Title  App服务提供商
 * @Author sf.xiong on 2017/08/04.
 */
public class AppServiceProvider {
    private Map<String, AbstractAppSuperService> serviceConfig;

    public AbstractAppSuperService getServiceConfigInstance(String transcode) {
        return serviceConfig.get(transcode);
    }

    public void setServiceConfig(Map<String, AbstractAppSuperService> serviceConfig) {
        this.serviceConfig = serviceConfig;
    }
}
