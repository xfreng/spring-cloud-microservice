package com.fui.cloud.service.right;

import com.alibaba.fastjson.JSONObject;
import com.fui.cloud.service.AbstractSuperService;
import com.fui.cloud.service.remote.user.UserRemote;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * @Title 权限相关业务类
 * @Author sf.xiong
 * @Date 2017-12-23
 */
@Service("permissionsService")
public class PermissionsService extends AbstractSuperService {

    @Autowired
    private UserRemote userRemote;

    public List<JSONObject> selectAllRight() {
        return userRemote.selectAllRight();
    }

    public JSONObject selectByPrimaryKey(Long id) {
        return userRemote.selectRightByPrimaryKey(id);
    }
}
