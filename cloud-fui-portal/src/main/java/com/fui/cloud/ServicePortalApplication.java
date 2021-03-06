package com.fui.cloud;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

/**
 * @Title fui app接口服务
 * @Author sf.xiong
 * @Date 2018/05/23
 */
@SpringBootApplication
@EnableDiscoveryClient
@EnableFeignClients
@EnableSwagger2
public class ServicePortalApplication extends SpringBootServletInitializer {

    /**
     * 用于部署到外部tomcat运行
     *
     * @param builder 资源加载
     * @return SpringApplicationBuilder
     */
    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder builder) {
        return builder.sources(ServicePortalApplication.class);
    }

    public static void main(String[] args) {
        SpringApplication.run(ServicePortalApplication.class, args);
    }

}
