package com.fui.cloud.service.user;

import com.alibaba.fastjson.JSONObject;
import com.fui.cloud.enums.AppId;
import com.fui.cloud.service.AbstractSuperService;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * @Title 用户角色相关业务类
 * @Author sf.xiong
 * @Date 2017-12-23
 */
@Service("userRolesService")
public class UserRolesService extends AbstractSuperService {

    public List selectRolesByUserId(Long userId) {
        return getResult(AppId.getName(1), "/user/role/selectRolesByUserId/{userId}", List.class, userId);
    }

    public int insert(JSONObject data) {
        return postResult(AppId.getName(1), "/user/role/insert/{data}", Integer.class, data.toJSONString());
    }

    public void deleteByUserId(Long userId) {
        deleteResult(AppId.getName(1), "/user/role/deleteByUserId/{userId}", userId);
    }
}
