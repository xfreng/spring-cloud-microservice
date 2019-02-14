package com.fui.cloud.dao.fui.menu;

import com.fui.cloud.dao.BaseMapper;
import com.fui.cloud.model.fui.Menus;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

@Mapper
public interface MenusMapper extends BaseMapper<Menus, Long> {
    List<Map<String, Object>> query(@Param("userId") Long userId, @Param("node") String node);

    List<Menus> queryMenuNodeBySelective(Map<String, Object> param);

    int insertMenuNode(Menus menusTree);

    int deleteMenuNodeById(Menus menusTree);

    int updateMenuNodeById(Menus menusTree);
}
