package com.fui.cloud.dao.fui.menu;

import com.fui.cloud.dao.BaseMapper;
import com.fui.cloud.model.fui.Menu;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

@Mapper
public interface MenuMapper extends BaseMapper<Menu, Long> {
    List<Map<String, Object>> query(@Param("userId") Long userId, @Param("node") String node);

    List<Menu> queryMenuNodeBySelective(Map<String, Object> param);

    int insertMenuNode(Menu menuTree);

    int deleteMenuNodeById(Menu menuTree);

    int updateMenuNodeById(Menu menuTree);
}
