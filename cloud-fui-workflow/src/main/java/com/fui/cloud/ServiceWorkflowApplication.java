package com.fui.cloud;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.netflix.hystrix.EnableHystrix;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = {"com.fui.cloud", "org.activiti"})
@EnableDiscoveryClient
@EnableFeignClients
@EnableHystrix
public class ServiceWorkflowApplication extends SpringBootServletInitializer {

    /**
     * 用于部署到外部tomcat运行
     *
     * @param builder 资源加载
     * @return SpringApplicationBuilder
     */
    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder builder) {
        return builder.sources(ServiceWorkflowApplication.class);
    }

    public static void main(String[] args) {
        SpringApplication.run(ServiceWorkflowApplication.class, args);
    }

}
