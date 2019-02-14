package com.fui.cloud.dao.fui.user;

import com.fui.cloud.dao.BaseMapper;
import com.fui.cloud.model.fui.Users;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

@Mapper
public interface UsersMapper extends BaseMapper<Users, Long> {
    /**
     * 根据工号查询用户信息
     *
     * @param userCode
     * @return 用户信息
     */
    Users findUserByCode(@Param("userCode") String userCode);

    /**
     * 分页查询用户信息
     *
     * @param params
     * @return 用户列表
     */
    List<Users> getUserList(Map<String, Object> params);
}