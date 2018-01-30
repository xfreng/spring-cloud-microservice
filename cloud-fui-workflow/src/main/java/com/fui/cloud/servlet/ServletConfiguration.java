package com.fui.cloud.servlet;

import org.springframework.boot.web.servlet.ServletRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.context.support.AnnotationConfigWebApplicationContext;
import org.springframework.web.servlet.DispatcherServlet;

@Configuration
public class ServletConfiguration {

    @Bean
    public ServletRegistrationBean modelRestServlet() {
        AnnotationConfigWebApplicationContext applicationContext = new AnnotationConfigWebApplicationContext();
        applicationContext.scan("org.activiti.rest.editor", "org.activiti.rest.diagram");
        DispatcherServlet modelRestServlet = new DispatcherServlet(applicationContext);
        ServletRegistrationBean registrationBean = new ServletRegistrationBean(modelRestServlet);
        registrationBean.setLoadOnStartup(1);
        registrationBean.addUrlMappings("/service/*");
        registrationBean.setName("ModelRestServlet");
        return registrationBean;
    }

    @Bean
    public ServletRegistrationBean restServlet() {
        AnnotationConfigWebApplicationContext applicationContext = new AnnotationConfigWebApplicationContext();
        applicationContext.scan("org.activiti.rest");
        DispatcherServlet restServlet = new DispatcherServlet(applicationContext);
        ServletRegistrationBean registrationBean = new ServletRegistrationBean(restServlet);
        registrationBean.setLoadOnStartup(2);
        registrationBean.addUrlMappings("/rest/*");
        registrationBean.setName("RestServlet");
        return registrationBean;
    }
}
