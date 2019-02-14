package com.fui.cloud.service.fui.role;

import com.fui.cloud.dao.fui.shiro.RolePermissionsMapper;
import com.fui.cloud.model.fui.RolePermissions;
import com.fui.cloud.service.fui.AbstractSuperImplService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.PostConstruct;
import java.util.List;

/**
 * @Title 角色相关业务类
 * @Author sf.xiong
 * @Date 2019-01-31
 */
@Service("rolePermissionsService")
@Transactional
public class RolePermissionsService extends AbstractSuperImplService<RolePermissions, Long> {

    @Autowired
    private RolePermissionsMapper rolePermissionsMapper;

    @PostConstruct
    public void initMapper() {
        this.baseMapper = rolePermissionsMapper;
    }

    public List<Long> selectPermissionsByRoleId(Long roleId) {
        return rolePermissionsMapper.selectPermissionsByRoleId(roleId);
    }
}
