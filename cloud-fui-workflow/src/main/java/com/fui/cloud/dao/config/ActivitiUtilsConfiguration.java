package com.fui.cloud.dao.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fui.cloud.common.CommonConstants;
import org.activiti.engine.impl.persistence.StrongUuidGenerator;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.MediaType;
import org.springframework.http.converter.StringHttpMessageConverter;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.web.multipart.commons.CommonsMultipartResolver;

import java.nio.charset.Charset;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;

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

    @Bean
    public StringHttpMessageConverter getStringHttpMessageConverter() {
        StringHttpMessageConverter stringHttpMessageConverter = new StringHttpMessageConverter(Charset.defaultCharset());
        stringHttpMessageConverter.setWriteAcceptCharset(false);
        //设置中文编码格式
        List<MediaType> list = new ArrayList<MediaType>();
        list.add(MediaType.APPLICATION_JSON_UTF8);
        list.add(MediaType.APPLICATION_FORM_URLENCODED);
        stringHttpMessageConverter.setSupportedMediaTypes(list);
        return stringHttpMessageConverter;
    }

    @Bean
    public MappingJackson2HttpMessageConverter getMappingJackson2HttpMessageConverter() {
        MappingJackson2HttpMessageConverter mappingJackson2HttpMessageConverter = new MappingJackson2HttpMessageConverter();
        //设置日期格式
        ObjectMapper objectMapper = objectMapper();
        SimpleDateFormat smt = new SimpleDateFormat(CommonConstants.PARTTERN_YYYY_MM_DD_HH_MM_SS);
        objectMapper.setDateFormat(smt);
        mappingJackson2HttpMessageConverter.setObjectMapper(objectMapper);
        //设置中文编码格式
        List<MediaType> list = new ArrayList<MediaType>();
        list.add(MediaType.APPLICATION_JSON_UTF8);
        list.add(MediaType.APPLICATION_FORM_URLENCODED);
        mappingJackson2HttpMessageConverter.setSupportedMediaTypes(list);
        return mappingJackson2HttpMessageConverter;
    }

    /**
     * 支持上传文件
     *
     * @return CommonsMultipartResolver
     */
    @Bean(name = "multipartResolver")
    public CommonsMultipartResolver commonsMultipartResolver() {
        CommonsMultipartResolver multipartResolver = new CommonsMultipartResolver();
        multipartResolver.setMaxUploadSize(5242880);
        return multipartResolver;
    }
}
