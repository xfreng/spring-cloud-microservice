package com.fui.cloud.dao.fui.dict;

import com.fui.cloud.dao.BaseMapper;
import com.fui.cloud.model.fui.DictType;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

@Mapper
public interface DictTypeMapper extends BaseMapper<DictType, Long> {
    List<DictType> query(Map<String, Object> param);

    List<DictType> queryDictForTree(String dictCode);
}