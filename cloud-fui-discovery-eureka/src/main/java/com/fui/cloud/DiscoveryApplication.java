package com.fui.cloud;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.server.EnableEurekaServer;

/**
 * @Description : Eureka 服务发现server 启动类
 * @Author sf.xiong
 * @Date 2017/12/14
 */
@SpringBootApplication
@EnableEurekaServer
public class DiscoveryApplication {

    public static void main(String[] args) throws Exception {
        SpringApplication.run(DiscoveryApplication.class, args);
    }

}