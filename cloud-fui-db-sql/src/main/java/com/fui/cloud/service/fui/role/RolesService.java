package com.fui.cloud.service.fui.role;

import com.fui.cloud.dao.fui.shiro.RolesMapper;
import com.fui.cloud.model.fui.Roles;
import com.fui.cloud.service.fui.AbstractSuperImplService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.PostConstruct;
import java.util.List;
import java.util.Map;

/**
 * @Title 角色相关业务类
 * @Author sf.xiong
 * @Date 2017-12-23
 */
@Service("rolesService")
@Transactional
public class RolesService extends AbstractSuperImplService<Roles, Long> {
    @Autowired
    private RolesMapper rolesMapper;

    @PostConstruct
    public void initMapper() {
        this.baseMapper = rolesMapper;
    }

    public Roles selectByPrimaryKey(Long id) {
        return rolesMapper.selectByPrimaryKey(id);
    }

    /**
     * 获取用户权限
     *
     * @param userId
     * @return 用户权限
     */
    public List<String> getUserRights(Long userId) {
        return rolesMapper.getUserRights(userId);
    }

    /**
     * 获取用户角色
     *
     * @param params
     * @return 用户角色
     */
    public List<Roles> getRolesList(Map<String, Object> params) {
        return rolesMapper.getRolesList(params);
    }
}
