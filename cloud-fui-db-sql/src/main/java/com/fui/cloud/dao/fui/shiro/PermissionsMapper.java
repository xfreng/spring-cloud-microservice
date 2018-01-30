package com.fui.cloud.dao.fui.shiro;

import com.fui.cloud.dao.BaseMapper;
import com.fui.cloud.model.fui.Permissions;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

@Mapper
public interface PermissionsMapper extends BaseMapper<Permissions, Long> {
    /**
     * 查询所有权限，用于给角色配置权限
     *
     * @return 所有权限信息
     */
    List<Permissions> selectAllRight();

    /**
     * 查询指定id对应的权限
     *
     * @param id 主键
     * @return 相匹配的权限信息
     */
    List<Permissions> selectByKey(Long id);

    /**
     * 查询根目录权限
     *
     * @return 所有根目录权限信息
     */
    List<Permissions> selectRootRight();

    /**
     * 根据权限编码查询权限信息
     *
     * @param rightCode
     * @return 角色信息
     */
    Permissions findRightsByCode(@Param("rightCode") String rightCode);

    /**
     * 分页查询权限信息
     *
     * @param params
     * @return 权限列表
     */
    List<Permissions> getRightsList(Map<String, Object> params);
}