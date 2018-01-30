package com.fui.cloud.dao;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import javax.sql.DataSource;

@Configuration
@EnableTransactionManagement
public class MybatisActivitiDataSourceConfiguration {

    @Bean(name = "activitiTransactionManager")
    public PlatformTransactionManager activitiTransactionManager(@Qualifier("dataSource") DataSource activitiDataSource) {
        return new DataSourceTransactionManager(activitiDataSource);
    }

}
