package com.fui.cloud.service;

import com.fui.cloud.common.CommonConstants;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

public abstract class AbstractSuperService {
    protected Logger logger = LoggerFactory.getLogger(getClass());
    private static final String DB_SERVICE_NAME$PREFIX_MAPPING = CommonConstants.DB_SERVICE_NAME + CommonConstants.DB_SERVICE_PREFIX_MAPPING;

    @Autowired
    protected RestTemplate restTemplate;

    /**
     * 查询
     */
    protected <T> T getResult(String appId, String url, Class<T> responseType, Object... uriVariables) {
        return restTemplate.getForObject(generateUrl(appId, url), responseType, uriVariables);
    }

    protected <T> T getResult(String appId, String url, Class<T> responseType, Map<String, Object> uriVariables) {
        return restTemplate.getForObject(generateUrl(appId, url), responseType, uriVariables);
    }

    /**
     * 新增
     */
    protected <T> T postResult(String appId, String url, Class<T> responseType, Object... uriVariables) {
        return restTemplate.postForObject(generateUrl(appId, url), null, responseType, uriVariables);
    }

    protected <T> T postResult(String appId, String url, Class<T> responseType, Map<String, Object> uriVariables) {
        return restTemplate.postForObject(generateUrl(appId, url), null, responseType, uriVariables);
    }

    /**
     * 删除
     */
    protected void deleteResult(String appId, String url, Object... uriVariables) {
        restTemplate.delete(generateUrl(appId, url), uriVariables);
    }

    protected void deleteResult(String appId, String url, Map<String, Object> uriVariables) {
        restTemplate.delete(generateUrl(appId, url), uriVariables);
    }

    /**
     * 修改
     */
    protected void putResult(String appId, String url, Object... uriVariables) {
        restTemplate.put(generateUrl(appId, url), null, uriVariables);
    }

    protected void putResult(String appId, String url, Map<String, Object> uriVariables) {
        restTemplate.put(generateUrl(appId, url), null, uriVariables);
    }

    private String generateUrl(String appId, String url) {
        String requestUrl = CommonConstants.HTTP_PREFIX;
        requestUrl += DB_SERVICE_NAME$PREFIX_MAPPING;
        requestUrl += appId;
        requestUrl += url;
        return requestUrl;
    }
}
