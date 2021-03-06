package com.fui.cloud.dao.fui;

import com.fui.cloud.dao.engine.DatabaseEngine;
import org.apache.ibatis.plugin.Interceptor;
import org.apache.ibatis.session.SqlSessionFactory;
import org.mybatis.spring.SqlSessionFactoryBean;
import org.mybatis.spring.SqlSessionTemplate;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;
import org.springframework.transaction.PlatformTransactionManager;

import javax.sql.DataSource;

@Configuration
@MapperScan(basePackages = "com.fui.cloud.dao.fui", sqlSessionFactoryRef = "fuiSqlSessionFactory")
public class MybatisFuiDataSourceConfiguration {

    @Autowired
    private DataSource fuiDataSource;
    @Autowired
    private DataSource fuiDdlDataSource;
    @Autowired
    private Interceptor mybatisPageInterceptor;

    @Bean(name = "fuiSqlSessionFactory")
    @Primary
    public SqlSessionFactory fuiSqlSessionFactory() throws Exception {
        SqlSessionFactoryBean factoryBean = new SqlSessionFactoryBean();
        factoryBean.setDataSource(fuiDataSource);
        factoryBean.setTypeAliasesPackage("com.fui.cloud.model.fui");
        factoryBean.setMapperLocations(new PathMatchingResourcePatternResolver().getResources("classpath:mapper/fui/*.xml"));
        factoryBean.setPlugins(new Interceptor[]{mybatisPageInterceptor});
        return factoryBean.getObject();

    }

    @Bean(name = "fuiTransactionManager")
    @Primary
    public PlatformTransactionManager fuiTransactionManager() {
        return new DataSourceTransactionManager(fuiDataSource);
    }

    @Bean(name = "fuiSqlSessionTemplate")
    @Primary
    public SqlSessionTemplate fuiSqlSessionTemplate() throws Exception {
        return new SqlSessionTemplate(fuiSqlSessionFactory());
    }


    @Bean
    @ConfigurationProperties(prefix = "mybatis")
    public DatabaseEngine fuiDatabaseEngine() {
        return new DatabaseEngine(fuiDdlDataSource);
    }
}
