package com.fui.cloud.controller.fui.user;

import com.alibaba.fastjson.JSONObject;
import com.fui.cloud.controller.AbstractSuperController;
import com.fui.cloud.model.fui.UserRoles;
import com.fui.cloud.service.fui.user.UserRolesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(value = {"/api/fui/user/role"})
public class UserRolesController extends AbstractSuperController {
    @Autowired
    private UserRolesService userRolesService;

    @GetMapping(value = {"/selectRolesByUserId/{userId}"})
    public List<Long> selectRolesByUserId(@PathVariable Long userId) {
        return userRolesService.selectRolesByUserId(userId);
    }

    @PostMapping(value = {"/insert/{data}"})
    public int insert(@PathVariable String data) {
        return userRolesService.insert(JSONObject.parseObject(data, UserRoles.class));
    }

    @DeleteMapping(value = {"/deleteByUserId/{userId}"})
    public int deleteByUserId(@PathVariable Long userId) {
        return userRolesService.deleteByUserId(userId);
    }
}