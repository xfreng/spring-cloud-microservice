package com.fui.cloud.service.fui;

import com.fui.cloud.dao.BaseMapper;
import com.fui.cloud.service.AbstractSuperService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

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
}
