package com.fui.cloud.portal.configuration;

import com.fui.cloud.portal.interceptors.APPServiceInterceptor;
import com.fui.cloud.portal.service.AppServiceProvider;
import com.fui.cloud.portal.service.appservice.FileUploadService;
import com.fui.cloud.portal.service.appservice.UserLoginService;
import com.fui.cloud.portal.service.appservice.UserRegisterService;
import com.fui.cloud.portal.service.appservice.common.AbstractSuperService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

import java.util.HashMap;
import java.util.Map;

/**
 * @Title APP接口配置类
 * @Author sf.xiong on 2018-05-23.
 */
@Configuration
public class AppConfiguration extends WebMvcConfigurerAdapter {

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new APPServiceInterceptor()).addPathPatterns("/service/appService");
    }

    @Bean(name = "serviceConfig")
    public AppServiceProvider serviceConfig() {
        AppServiceProvider appServiceProvider = new AppServiceProvider();
        Map<String, AbstractSuperService> serviceConfig = new HashMap<String, AbstractSuperService>();
        serviceConfig.put("1001", new UserLoginService());
        serviceConfig.put("1002", new UserRegisterService());
        serviceConfig.put("8083", new FileUploadService());
        appServiceProvider.setServiceConfig(serviceConfig);
        return appServiceProvider;
    }
}
