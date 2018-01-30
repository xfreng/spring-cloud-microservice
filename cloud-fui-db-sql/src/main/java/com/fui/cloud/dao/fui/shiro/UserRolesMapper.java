package com.fui.cloud.dao.fui.shiro;

import com.fui.cloud.dao.BaseMapper;
import com.fui.cloud.model.fui.UserRoles;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface UserRolesMapper extends BaseMapper<UserRoles, Long> {
    /**
     * 根据用户id查询对应角色
     *
     * @param userId 用户id
     * @return 角色列表
     */
    List<Long> selectRolesByUserId(Long userId);

    /**
     * 根据用户id删除对应的角色关联信息
     *
     * @param userId 用户id
     * @return 删除结果
     */
    int deleteByUserId(Long userId);
}