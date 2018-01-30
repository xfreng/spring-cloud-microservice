package com.fui.cloud.dao.fui.dict;

import com.fui.cloud.dao.BaseMapper;
import com.fui.cloud.model.fui.DictEntry;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

@Mapper
public interface DictEntryMapper extends BaseMapper<DictEntry, Long> {
    List<DictEntry> query(Map<String, Object> param);
}