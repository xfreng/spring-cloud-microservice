package com.fui.cloud;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

/**
 * @Title fui数据持久层服务
 * @Author sf.xiong
 * @Date 2017/12/19
 */
@SpringBootApplication(exclude = {DataSourceAutoConfiguration.class})
@EnableDiscoveryClient
public class ServiceDatabaseApplication {

    public static void main(String[] args) {
        SpringApplication.run(ServiceDatabaseApplication.class, args);
    }
}
