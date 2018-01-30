package com.fui.cloud.controller.fui.user;

import com.alibaba.fastjson.JSONObject;
import com.fui.cloud.controller.AbstractSuperController;
import com.fui.cloud.model.fui.User;
import com.fui.cloud.service.fui.user.UserService;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;

@RestController
@RequestMapping(value = {"/api/fui/user"})
public class UserController extends AbstractSuperController {
    @Autowired
    private UserService userService;

    @GetMapping(value = {"/findUserByCode/{userCode}"})
    public User findUserByCode(@PathVariable String userCode) {
        return userService.findUserByCode(userCode);
    }

    @GetMapping(value = {"/getUserList/{pageNum}/{pageSize}/{key}/{params}"})
    public JSONObject getUserList(@PathVariable Integer pageNum, @PathVariable Integer pageSize, @PathVariable String key, @PathVariable String params) {
        //分页查询
        PageHelper.startPage(pageNum, pageSize);
        List<User> list = userService.getUserList(JSONObject.parseObject(params));
        PageInfo<User> pageInfo = createPagination(list);
        String json = success(list, pageInfo.getTotal(), key);
        return JSONObject.parseObject(json);
    }

    @PostMapping(value = {"/insert/{data}"})
    public int insert(@PathVariable String data) {
        User record = JSONObject.parseObject(data, User.class);
        record.setCreateTime(new Date(System.currentTimeMillis()));
        return userService.insert(record);
    }

    @PutMapping(value = {"/updateByPrimaryKeySelective/{data}"})
    public int updateByPrimaryKeySelective(@PathVariable String data) {
        return userService.updateByPrimaryKeySelective(JSONObject.parseObject(data, User.class));
    }
}