package com.fui.cloud.portal.service;

import com.fui.cloud.portal.service.appservice.common.AbstractSuperService;

import java.util.Map;

/**
 * @Title  App服务提供商
 * @Author sf.xiong on 2017/08/04.
 */
public class AppServiceProvider {
    private Map<String, AbstractSuperService> serviceConfig;

    public AbstractSuperService getServiceConfigInstance(String transcode) {
        return serviceConfig.get(transcode);
    }

    public void setServiceConfig(Map<String, AbstractSuperService> serviceConfig) {
        this.serviceConfig = serviceConfig;
    }
}
