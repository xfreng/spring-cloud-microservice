package com.fui.cloud.service.role;

import com.alibaba.fastjson.JSONObject;
import com.fui.cloud.common.UserUtils;
import com.fui.cloud.enums.AppId;
import com.fui.cloud.service.AbstractSuperService;
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

    public JSONObject selectByPrimaryKey(Long id) {
        return getResult(AppId.getName(1), "/role/selectByPrimaryKey/{id}", JSONObject.class, id);
    }

    public List getUserRights() {
        return getResult(AppId.getName(1), "/role/getUserRights/{userId}", List.class, UserUtils.getCurrent().getLong("id"));
    }

    public List getRolesList(Map<String, Object> params) {
        return getResult(AppId.getName(1), "/role/getRolesList", List.class, params);
    }
}
