package com.fui.cloud.dao.spring;

import com.github.pagehelper.PageInterceptor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.jdbc.DataSourceBuilder;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import javax.sql.DataSource;
import java.util.Properties;

@Configuration
@EnableTransactionManagement
public class DataSourceConfiguration {
    @Value("${spring.datasource.type}")
    private Class<? extends DataSource> type;

    @Value("${pagehelper.helperDialect}")
    private String mybatisDialect;

    @Bean(name = "mybatisPageInterceptor")
    public PageInterceptor pageInterceptor() {
        PageInterceptor pageInterceptor = new PageInterceptor();
        Properties properties = new Properties();
        properties.put("helperDialect", mybatisDialect);
        pageInterceptor.setProperties(properties);
        return pageInterceptor;
    }

    @Bean(name = "fuiDataSource")
    @ConfigurationProperties(prefix = "spring.datasource.fui")
    public DataSource fuiDataSource() {
        return DataSourceBuilder.create().type(type).build();
    }

    @Bean(name = "fuiDdlDataSource")
    @ConfigurationProperties(prefix = "mybatis.datasource")
    public DataSource fuiDdlDataSource() {
        return DataSourceBuilder.create().build();
    }
}
