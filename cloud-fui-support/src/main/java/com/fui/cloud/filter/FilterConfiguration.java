package com.fui.cloud.filter;

import com.fui.cloud.common.CommonConstants;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.filter.CharacterEncodingFilter;

/**
 * @Title Filter 配置
 * @Author sf.xiong on 2017/12/25.
 */
@Configuration
public class FilterConfiguration {
    private static final Logger logger = LoggerFactory.getLogger(FilterConfiguration.class);

    @Bean
    public FilterRegistrationBean loginFilterRegistration() {
        FilterRegistrationBean registration = new FilterRegistrationBean();
        String initParameterValue = "/supervisor/login/unAuthorized,/supervisor/login/timeout";
        registration.setFilter(new LoginFilter());
        registration.addUrlPatterns("/supervisor/*");
        registration.addInitParameter("excludedPages", initParameterValue);
        registration.setName("loginFilter");
        registration.setOrder(1);
        logger.info("登录filter配置完毕...");
        return registration;
    }

    @Bean
    public FilterRegistrationBean encodingFilterRegistration() {
        FilterRegistrationBean registration = new FilterRegistrationBean();
        registration.setFilter(new CharacterEncodingFilter());
        registration.addUrlPatterns("/*");
        registration.addInitParameter("encoding", CommonConstants.DEFAULT_CHARACTER);
        registration.addInitParameter("forceEncoding", "true");
        registration.setName("encodingFilter");
        registration.setOrder(2);
        logger.info("编码filter配置完毕...");
        return registration;
    }
}
