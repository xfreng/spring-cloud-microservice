package com.fui.cloud;

import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableDiscoveryClient
@EnableFeignClients
public class ConsulClientApplication extends SpringBootServletInitializer {
    public static void main(String[] args) {
        new SpringApplicationBuilder(ConsulClientApplication.class).web(true).run(args);
    }
}
