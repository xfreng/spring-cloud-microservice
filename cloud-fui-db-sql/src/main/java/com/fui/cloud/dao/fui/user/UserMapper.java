package com.fui.cloud.dao.fui.user;

import com.fui.cloud.dao.BaseMapper;
import com.fui.cloud.model.fui.User;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

@Mapper
public interface UserMapper extends BaseMapper<User, Long> {
    /**
     * 根据工号查询用户信息
     *
     * @param userCode
     * @return 用户信息
     */
    User findUserByCode(@Param("userCode") String userCode);

    /**
     * 分页查询用户信息
     *
     * @param params
     * @return 用户列表
     */
    List<User> getUserList(Map<String, Object> params);
}