package com.fui.cloud.dao.fui.style;

import com.fui.cloud.dao.BaseMapper;
import org.apache.ibatis.annotations.Mapper;

import java.util.Map;

@Mapper
public interface StyleMapper extends BaseMapper<Map<String, Object>, String> {

    boolean updateMenuTypeAndStyleByUserId(Map<String, Object> beanMap);
}
