package com.fui.cloud.dao.config;

import org.activiti.engine.*;
import org.activiti.engine.impl.cfg.ProcessEngineConfigurationImpl;
import org.activiti.engine.impl.persistence.StrongUuidGenerator;
import org.activiti.rest.common.application.ContentTypeResolver;
import org.activiti.rest.common.application.DefaultContentTypeResolver;
import org.activiti.rest.service.api.RestResponseFactory;
import org.activiti.spring.ProcessEngineFactoryBean;
import org.activiti.spring.SpringProcessEngineConfiguration;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.PlatformTransactionManager;

import javax.sql.DataSource;

@Configuration
public class ActivitiInitConfiguration {

    @Value("${activiti.databaseType}")
    private String databaseType;
    @Value("${activiti.tablePrefixIsSchema}")
    private boolean tablePrefixIsSchema;
    @Value("${activiti.databaseSchemaUpdate}")
    private String databaseSchemaUpdate;
    @Value("${activiti.activityFontName}")
    private String activityFontName;
    @Value("${activiti.labelFontName}")
    private String labelFontName;

    @Bean
    public ProcessEngineConfiguration processEngineConfiguration(@Qualifier("dataSource") DataSource activitiDataSource,
                                                                 @Qualifier("activitiTransactionManager") PlatformTransactionManager activitiTransactionManager,
                                                                 @Qualifier("uuidGenerator") StrongUuidGenerator uuidGenerator) {
        SpringProcessEngineConfiguration processEngineConfiguration = new SpringProcessEngineConfiguration();
        processEngineConfiguration.setDataSource(activitiDataSource);
        processEngineConfiguration.setTransactionManager(activitiTransactionManager);
        processEngineConfiguration.setDatabaseType(databaseType);
        processEngineConfiguration.setTablePrefixIsSchema(tablePrefixIsSchema);
        processEngineConfiguration.setDatabaseSchemaUpdate(databaseSchemaUpdate);
        processEngineConfiguration.setIdGenerator(uuidGenerator);
        processEngineConfiguration.setActivityFontName(activityFontName);
        processEngineConfiguration.setLabelFontName(labelFontName);
        return processEngineConfiguration;
    }

    @Bean
    public ProcessEngineFactoryBean processEngine(ProcessEngineConfiguration processEngineConfiguration) {
        ProcessEngineFactoryBean processEngineFactoryBean = new ProcessEngineFactoryBean();
        processEngineFactoryBean.setProcessEngineConfiguration((ProcessEngineConfigurationImpl) processEngineConfiguration);
        return processEngineFactoryBean;
    }

    @Bean
    public RepositoryService repositoryService(ProcessEngine processEngine) {
        return processEngine.getRepositoryService();
    }

    @Bean
    public RuntimeService runtimeService(ProcessEngine processEngine) {
        return processEngine.getRuntimeService();
    }

    @Bean
    public TaskService taskService(ProcessEngine processEngine) {
        return processEngine.getTaskService();
    }

    @Bean
    public HistoryService historyService(ProcessEngine processEngine) {
        return processEngine.getHistoryService();
    }

    @Bean
    public FormService formService(ProcessEngine processEngine) {
        return processEngine.getFormService();
    }

    @Bean
    public IdentityService identityService(ProcessEngine processEngine) {
        return processEngine.getIdentityService();
    }

    @Bean
    public ManagementService managementService(ProcessEngine processEngine) {
        return processEngine.getManagementService();
    }

    @Bean
    public DynamicBpmnService dynamicBpmnService(ProcessEngine processEngine) {
        return processEngine.getDynamicBpmnService();
    }

    @Bean
    public RestResponseFactory restResponseFactory() {
        return new RestResponseFactory();
    }

    @Bean
    public ContentTypeResolver contentTypeResolver() {
        return new DefaultContentTypeResolver();
    }
}
