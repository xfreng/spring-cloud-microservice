package com.fui.cloud.dao.fui.shiro;

import com.fui.cloud.dao.BaseMapper;
import com.fui.cloud.model.fui.Roles;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

@Mapper
public interface RolesMapper extends BaseMapper<Roles, Long> {
    /**
     * 根据角色编码查询角色信息
     *
     * @param roleCode
     * @return 角色信息
     */
    Roles findRolesByCode(@Param("roleCode") String roleCode);

    /**
     * 分页查询角色信息
     *
     * @param params
     * @return 角色列表
     */
    List<Roles> getRolesList(Map<String, Object> params);

    /**
     * 获取用户权限
     *
     * @param userId
     * @return 用户权限
     */
    List<String> getUserRights(Long userId);

    /**
     * 获取用户所有角色
     *
     * @param userId
     * @return 角色列表
     */
    List<String> getRolesByUserId(Long userId);
}