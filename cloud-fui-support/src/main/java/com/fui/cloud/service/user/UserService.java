package com.fui.cloud.service.user;

import com.alibaba.fastjson.JSONObject;
import com.fui.cloud.common.*;
import com.fui.cloud.enums.AppId;
import com.fui.cloud.model.ManageToken;
import com.fui.cloud.service.AbstractSuperService;
import com.fui.cloud.service.remote.user.UserRemote;
import com.fui.cloud.service.role.RolesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

/**
 * @Title 用户相关业务类
 * @Author sf.xiong
 * @Date 2017-12-19
 */
@Service("userService")
public class UserService extends AbstractSuperService {
    @Autowired
    private TokenUtils tokenUtils;
    @Autowired
    private RolesService rolesService;
    @Autowired
    private UserRolesService userRolesService;
    @Autowired
    private UserRemote userRemote;

    public void login(Long userId) {
        //设置token
        try {
            ManageToken manageToken = setToken(userId);
            UserUtils.getCurrentRequest().getSession().setAttribute(CommonConstants.USER_SESSION_ID, manageToken);
        } catch (IOException e) {
            logger.info("设置token出错 {}", e);
        }
    }

    private ManageToken setToken(Long userId) throws IOException {
        //更新最后登录时间及登录次数
        JSONObject user = new JSONObject();
        user.put("id", userId);
        user.put("lastLoginTime", new Date(System.currentTimeMillis()));
        Long loginCount = user.getLong("loginCount");
        user.put("loginCount", loginCount == null ? 1L : loginCount + 1);
        updateByPrimaryKeySelective(user);
        //生成并返回登录token
        return tokenUtils.toManageToken(user);
    }

    /**
     * 分页查询用户信息
     *
     * @param params 查询条件
     * @return 用户信息列表
     */
    public JSONObject getUserList(Integer pageNum, Integer pageSize, String key, Map<String, Object> params) {
        return userRemote.getUserList(pageNum, pageSize, key, JSONObject.toJSONString(params));
    }

    private void updateByPrimaryKeySelective(JSONObject user) {
        userRemote.updateUserByPrimaryKeySelective(user.toJSONString());
    }

    private int insert(JSONObject user) {
        return userRemote.insertUser(user.toJSONString());
    }

    /**
     * 根据用户名查询用户信息
     *
     * @param userCode
     * @return User
     */
    public JSONObject findUserByCode(String userCode) {
        return userRemote.findUserByCode(userCode);
    }

    /**
     * 新增用户
     *
     * @param user
     * @return 操作信息
     */
    public JSONObject addUser(JSONObject user, String roles) {
        JSONObject json = new JSONObject();
        JSONObject oldUser = findUserByCode(user.getString("ename"));
        if (oldUser != null) {
            json.put("result", "0");
            json.put("message", "用户名已经存在");
            return json;
        }
        user.put("password", MD5Utils.generatePassword(CommonConstants.DEFAULT_USER_PWD));
        user.put("erased", false);
        user.put("style", CommonConstants.DEFAULT_STYLE);
        user.put("menuType", CommonConstants.DEFAULT_STYLE);
        user.put("loginCount", 0L);
        int i = insert(user);
        List<String> userRoleList = StringUtils.asList(roles, ",");
        JSONObject userRoles = new JSONObject();
        userRoles.put("userId", user.getLong("id"));
        for (String roleId : userRoleList) {
            userRoles.put("roleId", Long.valueOf(roleId));
            userRolesService.insert(userRoles);
        }
        json.put("message", i > 0 ? "用户添加成功" : "用户添加失败");
        return json;
    }

    /**
     * 修改用户
     *
     * @param user
     * @return 操作信息
     */
    public JSONObject updateUser(JSONObject user, String roles) {
        JSONObject json = new JSONObject();
        updateByPrimaryKeySelective(user);
        userRolesService.deleteByUserId(user.getLong("id"));// 更新之前，清除用户角色关联信息
        List<String> userRoleList = StringUtils.asList(roles, ",");
        JSONObject userRoles = new JSONObject();
        userRoles.put("userId", user.getLong("id"));
        int i = 0;
        for (String roleId : userRoleList) {
            userRoles.put("roleId", Long.valueOf(roleId));
            i = userRolesService.insert(userRoles);
        }
        json.put("message", i > 0 ? "用户修改成功" : "用户修改失败");
        return json;
    }

    /**
     * 获取用户拥有的角色
     *
     * @param userId
     * @return 角色列表
     */
    public List<JSONObject> getUserRoles(Long userId) {
        List<JSONObject> userRoles = new ArrayList<JSONObject>();
        List<Long> roleIdList = userRolesService.selectRolesByUserId(userId);
        for (Long roleId : roleIdList) {
            JSONObject roles = rolesService.selectByPrimaryKey(roleId);
            userRoles.add(roles);
        }
        return userRoles;
    }

    /**
     * 重置用户密码
     *
     * @param user 用户对象
     * @return 重置密码结果
     */
    public JSONObject resetPwd(JSONObject user) {
        JSONObject json = new JSONObject();
        if (CommonConstants.SUPER_USER_ID.equals(user.getString("ename"))) {
            json.put("message", "超级管理员密码不允许操作");
        } else {
            int result = 0;
            try {
                user.put("password", MD5Utils.generatePassword(CommonConstants.DEFAULT_USER_PWD));
                updateByPrimaryKeySelective(user);
                result = 1;
            } catch (Exception e) {
                logger.error("重置用户密码异常：{}", e);
            }
            if (result == 1) {
                json.put("message", "成功");
            } else {
                json.put("message", "失败");
            }
        }
        return json;
    }

    /**
     * 启用/禁用用户
     *
     * @param user 用户对象
     * @return 更新结果
     */
    public JSONObject status(JSONObject user) {
        JSONObject json = new JSONObject();
        if (CommonConstants.SUPER_USER_ID.equals(user.getString("ename"))) {
            json.put("result", "0");
            json.put("message", "超级管理员状态不允许操作");
        } else {
            int result = 0;
            user.put("erased", !user.getBoolean("erased"));
            try {
                updateByPrimaryKeySelective(user);
                result = 1;
            } catch (Exception e) {
                logger.error("更新出错：{}", e);
            }
            if (result == 1) {
                json.put("result", "1");
                json.put("message", "成功");
            } else {
                json.put("result", "0");
                json.put("message", "失败");
            }
        }
        return json;
    }

    /**
     * 更新用户密码
     *
     * @param oldPassword 旧密码
     * @param newPassword 新密码
     * @return 更新结果
     */
    public JSONObject updatePwd(String oldPassword, String newPassword) {
        JSONObject user = UserUtils.getCurrent();
        JSONObject json = new JSONObject();
        int result = 0;
        try {
            oldPassword = MD5Utils.encodeByMD5(oldPassword);
            if (!oldPassword.equals(user.getString("password"))) {
                json.put("result", "0");
                json.put("message", "原始密码错误！");
                return json;
            }

            newPassword = MD5Utils.encodeByMD5(newPassword);
            JSONObject newUser = new JSONObject();
            newUser.put("id", user.getLong("id"));
            newUser.put("password", newPassword);
            updateByPrimaryKeySelective(newUser);
            result = 1;
        } catch (Exception e) {
            logger.error("修改密码失败：{}", e);
            json.put("result", "0");
            json.put("message", "密码修改失败！");
        }
        if (result == 1) {
            json.put("result", "1");
            json.put("message", "密码修改成功，请重新登录！");
        }
        return json;
    }
}
