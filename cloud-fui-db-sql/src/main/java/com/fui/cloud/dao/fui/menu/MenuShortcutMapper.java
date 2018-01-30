package com.fui.cloud.dao.fui.menu;

import com.alibaba.fastjson.JSONObject;
import com.fui.cloud.dao.BaseMapper;
import com.fui.cloud.model.fui.MenuShortcut;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

@Mapper
public interface MenuShortcutMapper extends BaseMapper<MenuShortcut, Long> {
    List<JSONObject> queryShortcutBySelective(Map<String, Object> param);
}