package com.fui.cloud.service.user;

import com.alibaba.fastjson.JSONObject;
import com.fui.cloud.service.AbstractSuperService;
import com.fui.cloud.service.remote.user.UserRemote;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * @Title 用户角色相关业务类
 * @Author sf.xiong
 * @Date 2017-12-23
 */
@Service("userRolesService")
public class UserRolesService extends AbstractSuperService {

    @Autowired
    private UserRemote userRemote;

    public List<Long> selectRolesByUserId(Long userId) {
        return userRemote.selectRolesByUserId(userId);
    }

    public int insert(JSONObject data) {
        return userRemote.insertRole(data.toJSONString());
    }

    void deleteByUserId(Long userId) {
        userRemote.deleteByUserId(userId);
    }
}
