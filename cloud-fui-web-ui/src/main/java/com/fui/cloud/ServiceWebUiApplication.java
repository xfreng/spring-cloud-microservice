package com.fui.cloud;

import com.fui.cloud.task.StartupRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.support.SpringBootServletInitializer;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.netflix.feign.EnableFeignClients;
import org.springframework.cloud.netflix.hystrix.EnableHystrix;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
@EnableDiscoveryClient
@EnableFeignClients
@EnableHystrix
public class ServiceWebUiApplication extends SpringBootServletInitializer {

    /**
     * 用于部署到外部tomcat运行
     *
     * @param builder 资源加载
     * @return SpringApplicationBuilder
     */
    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder builder) {
        return builder.sources(ServiceWebUiApplication.class);
    }

    public static void main(String[] args) {
        SpringApplication.run(ServiceWebUiApplication.class, args);
    }

    /**
     * 项目启动后执行一次
     *
     * @return StartupRunner
     */
    @Bean
    public StartupRunner startupRunner() {
        return new StartupRunner();
    }
}
