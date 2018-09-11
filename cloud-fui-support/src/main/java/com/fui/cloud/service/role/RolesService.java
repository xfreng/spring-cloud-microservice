package com.fui.cloud.service.role;

import com.alibaba.fastjson.JSONObject;
import com.fui.cloud.common.UserUtils;
import com.fui.cloud.service.AbstractSuperService;
import com.fui.cloud.service.remote.user.UserRemote;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

/**
 * @Title 角色相关业务类
 * @Author sf.xiong
 * @Date 2017-12-23
 */
@Service("rolesService")
public class RolesService extends AbstractSuperService {

    @Autowired
    private UserRemote userRemote;

    public JSONObject selectByPrimaryKey(Long id) {
        return userRemote.selectRoleByPrimaryKey(id);
    }

    public List<String> getUserRights() {
        return userRemote.getUserRights(UserUtils.getCurrent().getLong("id"));
    }

    public List<JSONObject> getRolesList(Map<String, Object> params) {
        return userRemote.getRolesList(params);
    }
}
