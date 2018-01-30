package com.fui.cloud.dao.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.activiti.engine.impl.persistence.StrongUuidGenerator;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ActivitiUtilsConfiguration {

    @Bean
    public ObjectMapper objectMapper() {
        return new ObjectMapper();
    }

    @Bean(name = "uuidGenerator")
    public StrongUuidGenerator strongUuidGenerator() {
        return new StrongUuidGenerator();
    }
}
