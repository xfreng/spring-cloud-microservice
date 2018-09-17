package com.fui.cloud.configuration;

import com.fui.cloud.interceptors.APPServiceInterceptor;
import com.fui.cloud.service.AppServiceProvider;
import com.fui.cloud.service.appservice.AppFileUploadService;
import com.fui.cloud.service.appservice.AppUserLoginService;
import com.fui.cloud.service.appservice.AppUserRegisterService;
import com.fui.cloud.service.appservice.common.AbstractAppSuperService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurationSupport;

import java.util.HashMap;
import java.util.Map;

/**
 * @Title APP接口配置类
 * @Author sf.xiong on 2018-05-23.
 */
@Configuration
public class AppServiceConfiguration extends WebMvcConfigurationSupport {

    @Autowired
    private AppUserLoginService appUserLoginService;
    @Autowired
    private AppUserRegisterService appUserRegisterService;
    @Autowired
    private AppFileUploadService appFileUploadService;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new APPServiceInterceptor()).addPathPatterns("/interface/app/service");
        super.addInterceptors(registry);
    }

    @Bean(name = "serviceConfig")
    public AppServiceProvider serviceConfig() {
        AppServiceProvider appServiceProvider = new AppServiceProvider();
        Map<String, AbstractAppSuperService> serviceConfig = new HashMap<String, AbstractAppSuperService>();
        serviceConfig.put("1001", appUserLoginService);
        serviceConfig.put("1002", appUserRegisterService);
        serviceConfig.put("8083", appFileUploadService);
        appServiceProvider.setServiceConfig(serviceConfig);
        return appServiceProvider;
    }
}
