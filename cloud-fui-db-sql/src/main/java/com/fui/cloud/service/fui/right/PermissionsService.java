package com.fui.cloud.service.fui.right;

import com.fui.cloud.dao.fui.shiro.PermissionsMapper;
import com.fui.cloud.model.fui.Permissions;
import com.fui.cloud.service.fui.AbstractSuperImplService;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.PostConstruct;
import java.util.List;
import java.util.Map;

/**
 * @Title 权限相关业务类
 * @Author sf.xiong
 * @Date 2017-12-23
 */
@Service("permissionsService")
@Transactional
public class PermissionsService extends AbstractSuperImplService<Permissions, Long> {

    @Autowired
    private PermissionsMapper permissionsMapper;

    @PostConstruct
    public void initMapper() {
        this.baseMapper = permissionsMapper;
    }

    public List<Permissions> selectAllRight() {
        return permissionsMapper.selectAllRight();
    }

    public Permissions selectByPrimaryKey(Long id) {
        return permissionsMapper.selectByPrimaryKey(id);
    }

    public String getRightsList(int page, int limit, Map<String, Object> params) {
        PageHelper.startPage(page, limit);
        List<Permissions> permissionsList = permissionsMapper.getRightsList(params);
        PageInfo<Permissions> pageInfo = createPagination(permissionsList);
        return success(permissionsList, pageInfo.getTotal(), "rightList");
    }
}
