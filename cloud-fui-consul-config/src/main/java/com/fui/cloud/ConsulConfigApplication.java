package com.fui.cloud;

import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
@EnableConfigurationProperties
public class ConsulConfigApplication {

    public static void main(String[] args) {
        new SpringApplicationBuilder(ConsulConfigApplication.class).run(args);
    }
}