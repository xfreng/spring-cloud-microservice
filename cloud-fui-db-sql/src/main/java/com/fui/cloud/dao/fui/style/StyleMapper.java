package com.fui.cloud.dao.fui.style;

import org.apache.ibatis.annotations.Mapper;

import java.util.Map;

@Mapper
public interface StyleMapper {
    boolean updateMenuTypeAndStyleByUserId(Map<String, Object> beanMap);
}
