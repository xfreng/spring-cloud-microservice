package com.fui.cloud.spring;

import com.fui.cloud.engine.FuiEngine;
import com.fui.cloud.task.FuiTask;
import com.fui.cloud.task.JobFactory;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.quartz.SchedulerFactoryBean;

@Configuration
@EnableScheduling
public class FuiConfiguration {

    @Bean
    public JobFactory jobFactory() {
        return new JobFactory();
    }

    @Bean(name = "scheduler")
    public SchedulerFactoryBean schedulerFactory() {
        SchedulerFactoryBean schedulerFactoryBean = new SchedulerFactoryBean();
        schedulerFactoryBean.setOverwriteExistingJobs(true);
        schedulerFactoryBean.setStartupDelay(1);
        schedulerFactoryBean.setJobFactory(jobFactory());
        return schedulerFactoryBean;
    }

    @Bean
    public FuiTask fuiTask() {
        return new FuiTask();
    }

    @Bean
    @ConfigurationProperties(prefix = "fui.quartz")
    public FuiEngine fuiEngine() {
        return new FuiEngine(fuiTask(), schedulerFactory());
    }
}
