package com.fui.cloud.service.right;

import com.alibaba.fastjson.JSONObject;
import com.fui.cloud.enums.AppId;
import com.fui.cloud.service.AbstractSuperService;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * @Title 权限相关业务类
 * @Author sf.xiong
 * @Date 2017-12-23
 */
@Service("permissionsService")
public class PermissionsService extends AbstractSuperService {

    public List selectAllRight() {
        return getResult(AppId.getName(1), "/right/selectAllRight", List.class);
    }

    public JSONObject selectByPrimaryKey(Long id) {
        return getResult(AppId.getName(1), "/right/selectByPrimaryKey/{id}", JSONObject.class, id);
    }
}
