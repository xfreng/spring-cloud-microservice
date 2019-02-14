package com.fui.cloud.controller.user;

import com.fui.cloud.common.CommonConstants;
import com.fui.cloud.controller.AbstractSuperController;
import com.fui.cloud.model.fui.Users;
import com.fui.cloud.service.fui.user.UsersService;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import java.util.HashMap;
import java.util.Map;

/**
 * @Title 用户管理
 * @Author sf.xiong on 2017/5/5.
 */
@Controller
@RequestMapping(value = "/supervisor/user")
public class UsersController extends AbstractSuperController {

    @Autowired
    private UsersService usersService;

    @GetMapping("/index")
    public ModelAndView index() {
        ModelAndView mv = new ModelAndView("supervisor/user/list");
        return init(mv);
    }

    @RequestMapping("/state")
    public ModelAndView state() {
        return new ModelAndView("supervisor/user/state");
    }

    @RequestMapping(value = "/list", produces = CommonConstants.MediaType_APPLICATION_JSON)
    @ResponseBody
    public String getUserList(@RequestParam(value = "pageIndex", defaultValue = "1") int pageNum,
                              @RequestParam(value = "pageSize", defaultValue = "10") int pageSize) {
        Map<String, Object> params = new HashMap<>();
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
        return usersService.getUserList(pageNum, pageSize, params);
    }

    @RequestMapping(value = "/add", produces = CommonConstants.MediaType_APPLICATION_JSON)
    @ResponseBody
    public String addUser(Users user) {
        String roles = request.getParameter("roles");
        return usersService.addUser(roles, user);
    }

    @RequestMapping(value = "/update", produces = CommonConstants.MediaType_APPLICATION_JSON)
    @ResponseBody
    public String updateUser(Users user) {
        String roles = request.getParameter("roles");
        return usersService.updateUser(roles, user);
    }

    @RequestMapping(value = "/roleList", produces = CommonConstants.MediaType_APPLICATION_JSON)
    @ResponseBody
    public String getRoles(Long userId) {
        return usersService.getUserRoles(userId);
    }

    /**
     * 重新用户密码
     *
     * @param user 用户对象
     * @return 重置密码结果
     */
    @RequestMapping(value = "/resetPwd", produces = CommonConstants.MediaType_APPLICATION_JSON)
    @ResponseBody
    public String resetPwd(Users user) {
        return usersService.resetPwd(user);
    }

    /**
     * 启用/禁用用户
     *
     * @param user 用户对象
     * @return 操作结果
     */
    @RequestMapping(value = "/status", produces = CommonConstants.MediaType_APPLICATION_JSON)
    @ResponseBody
    public String status(Users user) {
        return usersService.status(user);
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
        return usersService.updatePwd(oldPassword, newPassword1);
    }
}
