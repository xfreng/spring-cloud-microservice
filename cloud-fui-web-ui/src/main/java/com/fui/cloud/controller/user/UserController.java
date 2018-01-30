package com.fui.cloud.controller.user;

import com.alibaba.fastjson.JSONObject;
import com.fui.cloud.common.CommonConstants;
import com.fui.cloud.controller.AbstractSuperController;
import com.fui.cloud.service.role.RolesService;
import com.fui.cloud.service.user.UserService;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @Title 用户管理
 * @Author sf.xiong on 2017/5/5.
 */
@Controller
@RequestMapping(value = "/supervisor/user")
public class UserController extends AbstractSuperController {

    @Autowired
    private UserService userService;
    @Autowired
    private RolesService roleService;

    @GetMapping("/index")
    public ModelAndView index() throws Exception {
        ModelAndView mv = new ModelAndView("supervisor/user/list");
        return init(mv);
    }

    @RequestMapping("/state")
    public ModelAndView state() {
        ModelAndView mv = new ModelAndView("supervisor/user/state");
        return mv;
    }

    @RequestMapping(value = "/list", produces = CommonConstants.MediaType_APPLICATION_JSON)
    @ResponseBody
    public String getUserList(@RequestParam(value = "pageIndex", defaultValue = "1") int pageNum,
                              @RequestParam(value = "pageSize", defaultValue = "10") int pageSize) {
        Map<String, Object> params = new HashMap<String, Object>();
        String orgId = request.getParameter("orgId");
        if (StringUtils.isNotEmpty(orgId)) {
            params.put("orgId", orgId);
        }
        String userCode = request.getParameter("userCode");
        if (StringUtils.isNotEmpty(userCode)) {
            params.put("userCode", userCode);
        }
        String userName = request.getParameter("userName");
        if (StringUtils.isNotEmpty(userName)) {
            params.put("userName", userName);
        }
        JSONObject json = userService.getUserList(pageNum, pageSize, "userList", params);
        return json.toJSONString();
    }

    @RequestMapping(value = "/add", produces = CommonConstants.MediaType_APPLICATION_JSON)
    @ResponseBody
    public String addUser(@RequestParam Map<String, Object> user) {
        String roles = request.getParameter("roles");
        return success(userService.addUser(new JSONObject(user), roles));
    }

    @RequestMapping(value = "/update", produces = CommonConstants.MediaType_APPLICATION_JSON)
    @ResponseBody
    public String updateUser(@RequestParam Map<String, Object> user) {
        String roles = request.getParameter("roles");
        return success(userService.updateUser(new JSONObject(user), roles));
    }

    @RequestMapping(value = "/roleList", produces = CommonConstants.MediaType_APPLICATION_JSON)
    @ResponseBody
    public String getRoles() {
        String userId = request.getParameter("userId");
        Map<String, Object> params = new HashMap<String, Object>();
        params.put("userId", userId);
        List<JSONObject> roleList = roleService.getRolesList(params);
        if (StringUtils.isNotEmpty(userId)) {
            roleList = userService.getUserRoles(Long.valueOf(userId));
        }
        return success(roleList);
    }

    /**
     * 重新用户密码
     *
     * @param user 用户对象
     * @return 重置密码结果
     */
    @RequestMapping(value = "/resetPwd", produces = CommonConstants.MediaType_APPLICATION_JSON)
    @ResponseBody
    public String resetPwd(@RequestParam Map<String, Object> user) {
        return success(userService.resetPwd(new JSONObject(user)));
    }

    /**
     * 启用/禁用用户
     *
     * @param user 用户对象
     * @return 操作结果
     */
    @RequestMapping(value = "/status", produces = CommonConstants.MediaType_APPLICATION_JSON)
    @ResponseBody
    public String status(@RequestParam Map<String, Object> user) {
        return success(userService.status(new JSONObject(user)));
    }

    /**
     * 修改密码
     *
     * @param oldPassword  旧密码
     * @param newPassword1 新密码
     * @return 修改结果
     */
    @RequestMapping(value = "/updatePwd", produces = CommonConstants.MediaType_APPLICATION_JSON)
    @ResponseBody
    public String updatePwd(String oldPassword, String newPassword1) {
        return success(userService.updatePwd(oldPassword, newPassword1));
    }
}
