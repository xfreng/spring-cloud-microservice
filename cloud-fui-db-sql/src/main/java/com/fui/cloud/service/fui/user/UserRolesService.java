package com.fui.cloud.service.fui.user;

import com.fui.cloud.dao.fui.shiro.UserRolesMapper;
import com.fui.cloud.model.fui.UserRoles;
import com.fui.cloud.service.fui.AbstractSuperImplService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.PostConstruct;
import java.util.List;

/**
 * @Title 用户角色相关业务类
 * @Author sf.xiong
 * @Date 2017-12-23
 */
@Service("userRolesService")
@Transactional
public class UserRolesService extends AbstractSuperImplService<UserRoles, Long> {

    @Autowired
    private UserRolesMapper userRolesMapper;

    @PostConstruct
    public void initMapper() {
        this.baseMapper = userRolesMapper;
    }

    public List<Long> selectRolesByUserId(Long userId) {
        return userRolesMapper.selectRolesByUserId(userId);
    }

    public int deleteByUserId(Long userId) {
        return userRolesMapper.deleteByUserId(userId);
    }
}
