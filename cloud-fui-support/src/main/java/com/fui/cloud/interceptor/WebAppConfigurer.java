package com.fui.cloud.interceptor;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

@Configuration
public class WebAppConfigurer extends WebMvcConfigurerAdapter {

    @Bean
    public HandlerInterceptor loginInterceptor() {
        LoginInterceptor loginInterceptor = new LoginInterceptor();
        String[] allowUrls = new String[]{"/supervisor/login/unAuthorized", "/supervisor/login/timeout"};
        loginInterceptor.setAllowUrls(allowUrls);
        return loginInterceptor;
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(loginInterceptor()).addPathPatterns("/supervisor/**");
    }
}
