package com.fui.cloud.service.fui.user;

import com.fui.cloud.dao.fui.user.UserMapper;
import com.fui.cloud.model.fui.User;
import com.fui.cloud.service.fui.AbstractSuperImplService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.PostConstruct;
import java.util.List;
import java.util.Map;

@Service("userService")
@Transactional
public class UserService extends AbstractSuperImplService<User, Long> {
    @Autowired
    private UserMapper userMapper;

    @PostConstruct
    public void initMapper() {
        this.baseMapper = userMapper;
    }

    /**
     * 分页查询用户信息
     *
     * @param params 查询条件
     * @return 用户信息列表
     */
    public List<User> getUserList(Map<String, Object> params) {
        return userMapper.getUserList(params);
    }

    /**
     * 根据用户名查询用户信息
     *
     * @param userCode
     * @return User
     */
    public User findUserByCode(String userCode) {
        return userMapper.findUserByCode(userCode);
    }
}
