package com.fui.cloud.filter;

import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FilterConfiguration {

    @Bean
    public FilterRegistrationBean jsonpCallbackFilter() {
        FilterRegistrationBean registration = new FilterRegistrationBean(new JsonpCallbackFilter());
        registration.setName("JSONPFilter");
        registration.addUrlPatterns("/*");
        return registration;
    }
}
