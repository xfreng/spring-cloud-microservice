package com.fui.cloud.service.fui;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.fui.cloud.common.CommonConstants;
import com.fui.cloud.dao.BaseMapper;
import com.fui.cloud.service.AbstractSuperService;
import com.github.pagehelper.PageInfo;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Collection;
import java.util.List;

public abstract class AbstractSuperImplService<T, P> implements AbstractSuperService<T, P> {
    protected Logger logger = LoggerFactory.getLogger(getClass());

    protected BaseMapper<T, P> baseMapper;

    public AbstractSuperImplService() {
    }

    public abstract void initMapper();

    public int deleteByPrimaryKey(P id) {
        return baseMapper.deleteByPrimaryKey(id);
    }

    public int insert(T record) {
        return baseMapper.insert(record);
    }

    public int insertSelective(T record) {
        return baseMapper.insertSelective(record);
    }

    public T selectByPrimaryKey(P id) {
        return baseMapper.selectByPrimaryKey(id);
    }

    public int updateByPrimaryKeySelective(T record) {
        return baseMapper.updateByPrimaryKeySelective(record);
    }

    public int updateByPrimaryKey(T record) {
        return baseMapper.updateByPrimaryKey(record);
    }

    /**
     * 分页功能
     *
     * @param list 分页结果集
     * @return 分页结果
     */
    protected <T> PageInfo<T> createPagination(List<T> list) {
        PageInfo<T> pageInfo = new PageInfo<>(list);
        logger.info("分页信息 {}", pageInfo);
        return pageInfo;
    }

    /**
     * json对象处理
     *
     * @param target 数据对象
     * @return 数据集对象的json
     */
    protected String success(Object target) {
        return target instanceof List ? JSONArray.toJSONString(target) : JSONObject.toJSONString(target);
    }

    /**
     * json对象处理
     *
     * @param list 数据集
     * @param key  json对应的key
     * @return 数据集对象的json
     */
    protected String success(Collection<T> list, String key) {
        return success(list, 0L, key);
    }

    /**
     * 分页处理
     *
     * @param list        分页查询结果
     * @param totalResult 总条数
     * @return 页面分页展示的json
     */
    protected String success(Collection<T> list, Long totalResult) {
        return success(list, totalResult, CommonConstants.PAGE_KEY_NAME);
    }

    /**
     * 分页处理
     *
     * @param list        分页查询结果
     * @param totalResult 总条数
     * @param key         json对应的key
     * @return 分页展示的json
     */
    protected String success(Collection<T> list, Long totalResult, String key) {
        JSONObject target = new JSONObject();
        if (totalResult != 0) {
            target.put(CommonConstants.PAGE_TOTAL, totalResult);
        }
        if (StringUtils.isNotEmpty(key)) {
            target.put(key, list);
        }
        return target.toJSONString();
    }
}
