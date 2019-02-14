package com.fui.cloud.dao.fui.shiro;

import com.fui.cloud.dao.BaseMapper;
import com.fui.cloud.model.fui.RolePermissions;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface RolePermissionsMapper extends BaseMapper<RolePermissions, Long> {

    List<Long> selectPermissionsByRoleId(Long roleId);
}