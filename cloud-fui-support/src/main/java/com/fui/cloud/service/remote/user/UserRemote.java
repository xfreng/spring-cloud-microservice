package com.fui.cloud.service.remote.user;

import com.alibaba.fastjson.JSONObject;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@FeignClient(value = "fui-db-sql")
@RequestMapping("/api/fui")
public interface UserRemote {

    @GetMapping(value = "/user/getUserList/{pageNum}/{pageSize}/{key}/{params}")
    JSONObject getUserList(@PathVariable("pageNum") Integer pageNum, @PathVariable("pageSize") Integer pageSize, @PathVariable("key") String key, @PathVariable("params") String params);

    @PutMapping(value = "/user/updateByPrimaryKeySelective/{data}")
    void updateUserByPrimaryKeySelective(@PathVariable("data") String data);

    @PostMapping(value = "/user/insert/{data}")
    int insertUser(@PathVariable("data") String data);

    @GetMapping(value = "/user/findUserByCode/{userCode}")
    JSONObject findUserByCode(@PathVariable("userCode") String userCode);

    @GetMapping(value = "/user/role/selectRolesByUserId/{userId}")
    List<Long> selectRolesByUserId(@PathVariable("userId") Long userId);

    @PostMapping(value = "/user/role/insert/{data}")
    int insertRole(@PathVariable("data") String data);

    @DeleteMapping(value = "/user/role/deleteByUserId/{userId}")
    void deleteByUserId(@PathVariable("userId") Long userId);

    @GetMapping(value = "/role/selectByPrimaryKey/{id}")
    JSONObject selectRoleByPrimaryKey(@PathVariable("id") Long id);

    @GetMapping(value = "/role/getUserRights/{userId}")
    List<String> getUserRights(@PathVariable("userId") Long userId);

    @GetMapping(value = "/role/getRolesList")
    List<JSONObject> getRolesList(@RequestParam Map<String, Object> params);

    @GetMapping(value = "/right/selectAllRight")
    List<JSONObject> selectAllRight();

    @GetMapping(value = "/right/selectByPrimaryKey/{id}")
    JSONObject selectRightByPrimaryKey(@PathVariable("id") Long id);
}
