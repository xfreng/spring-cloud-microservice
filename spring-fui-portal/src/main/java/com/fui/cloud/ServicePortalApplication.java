package com.fui.cloud;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.client.loadbalancer.LoadBalanced;
import org.springframework.context.annotation.Bean;
import org.springframework.web.client.RestTemplate;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

/**
 * @Title fui app接口服务
 * @Author sf.xiong
 * @Date 2018/05/23
 */
@SpringBootApplication
@EnableDiscoveryClient
@EnableSwagger2
public class ServicePortalApplication {

    public static void main(String[] args) {
        SpringApplication.run(ServicePortalApplication.class, args);
    }

    /**
     * Spring提供的用于访问Rest服务的客户端
     *
     * @return RestTemplate
     */
    @Bean
    @LoadBalanced
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}
