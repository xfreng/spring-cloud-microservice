package com.fui.cloud.controller;

import com.alibaba.fastjson.JSONObject;
import com.github.pagehelper.PageInfo;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Collection;
import java.util.List;

public class AbstractSuperController {
    protected static Logger logger = LoggerFactory.getLogger(AbstractSuperController.class);
    // 系统默认字符集
    protected static final String DEFAULT_CHARACTER = "UTF-8";

    // 前台分页总条数
    private static final String PAGE_TOTAL = "total";

    // 前台分页json名
    private static final String PAGE_KEY_NAME = "data";

    /**
     * 分页功能
     *
     * @param list 分页结果集
     * @return 分页结果
     */
    protected <T> PageInfo<T> createPagination(List<T> list) {
        PageInfo<T> pageInfo = new PageInfo<T>(list);
        logger.info("分页信息 {}", pageInfo);
        return pageInfo;
    }

    /**
     * json对象处理
     *
     * @param list 数据集
     * @param key  json对应的key
     * @return 数据集对象的json
     */
    protected String success(Collection list, String key) {
        return success(list, 0L, key);
    }

    /**
     * 分页处理
     *
     * @param list        分页查询结果
     * @param totalResult 总条数
     * @return 页面分页展示的json
     */
    protected String success(Collection list, Long totalResult) {
        return success(list, totalResult, PAGE_KEY_NAME);
    }

    /**
     * 分页处理
     *
     * @param list        分页查询结果
     * @param totalResult 总条数
     * @param key         json对应的key
     * @return 分页展示的json
     */
    protected String success(Collection list, Long totalResult, String key) {
        JSONObject target = new JSONObject();
        if (totalResult.intValue() != 0) {
            target.put(PAGE_TOTAL, totalResult);
        }
        if (StringUtils.isNotEmpty(key)) {
            target.put(key, list);
        }
        return target.toJSONString();
    }
}
