package com.fui.cloud.service.fui.user;

import com.fui.cloud.common.*;
import com.fui.cloud.dao.fui.user.UsersMapper;
import com.fui.cloud.model.ManageToken;
import com.fui.cloud.model.fui.Roles;
import com.fui.cloud.model.fui.UserRoles;
import com.fui.cloud.model.fui.Users;
import com.fui.cloud.service.fui.AbstractSuperImplService;
import com.fui.cloud.service.fui.role.RolesService;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.PostConstruct;
import java.io.IOException;
import java.util.*;

@Service("userService")
@Transactional
public class UsersService extends AbstractSuperImplService<Users, Long> {

    @Autowired
    private UsersMapper usersMapper;

    @Autowired
    private RolesService rolesService;

    @Autowired
    private UserRolesService userRolesService;

    @Autowired
    private TokenUtils tokenUtils;

    @PostConstruct
    public void initMapper() {
        this.baseMapper = usersMapper;
    }

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
        Users user = new Users();
        user.setId(userId);
        user.setLastLoginTime(new Date(System.currentTimeMillis()));
        Long loginCount = user.getLoginCount();
        user.setLoginCount(loginCount == null ? 1L : loginCount + 1);
        updateByPrimaryKeySelective(user);
        //生成并返回登录token
        return tokenUtils.toManageToken(user);
    }

    /**
     * 分页查询用户信息
     *
     * @param page   当前页数
     * @param limit  每页显示条数
     * @param params 查询条件
     * @return 用户信息列表
     */
    public String getUserList(int page, int limit, Map<String, Object> params) {
        PageHelper.startPage(page, limit);
        List<Users> usersList = usersMapper.getUserList(params);
        PageInfo<Users> pageInfo = createPagination(usersList);
        return success(usersList, pageInfo.getTotal(), "userList");
    }

    /**
     * 根据用户名查询用户信息
     *
     * @param userCode
     * @return Users
     */
    public Users findUserByCode(String userCode) {
        return usersMapper.findUserByCode(userCode);
    }

    /**
     * 新增用户
     *
     * @param roles 用户角色
     * @param user  用户信息
     * @return 操作信息
     */
    public String addUser(String roles, Users user) {
        Response response = new Response();
        Users oldUser = findUserByCode(user.getEname());
        if (oldUser != null) {
            response.setCodeMsg(CommonConstants.FAILURE_STATUS, "用户名已经存在");
            return success(response);
        }
        user.setPassword(MD5Utils.generatePassword(CommonConstants.DEFAULT_USER_PWD));
        user.setErased(false);
        user.setStyle(CommonConstants.DEFAULT_STYLE);
        user.setMenuType(CommonConstants.DEFAULT_STYLE);
        user.setLoginCount(0L);
        int i = insert(user);
        List<String> userRoleList = StringUtils.asList(roles, ",");
        UserRoles userRoles = new UserRoles();
        userRoles.setUserId(user.getId());
        for (String roleId : userRoleList) {
            userRoles.setRoleId(Long.valueOf(roleId));
            userRolesService.insert(userRoles);
        }
        if (i > 0) {
            response.setCodeMsg(CommonConstants.SUCCESS_STATUS, "用户添加成功");
        } else {
            response.setCodeMsg(CommonConstants.FAILURE_STATUS, "用户添加失败");
        }
        return success(response);
    }

    /**
     * 修改用户
     *
     * @param roles 用户角色
     * @param user  用户信息
     * @return 操作信息
     */
    public String updateUser(String roles, Users user) {
        Response response = new Response();
        updateByPrimaryKeySelective(user);
        userRolesService.deleteByUserId(user.getId());// 更新之前，清除用户角色关联信息
        List<String> userRoleList = StringUtils.asList(roles, ",");
        UserRoles userRoles = new UserRoles();
        userRoles.setUserId(user.getId());
        int i = 0;
        for (String roleId : userRoleList) {
            userRoles.setRoleId(Long.valueOf(roleId));
            i = userRolesService.insert(userRoles);
        }
        if (i > 0) {
            response.setCodeMsg(CommonConstants.SUCCESS_STATUS, "用户修改成功");
        } else {
            response.setCodeMsg(CommonConstants.FAILURE_STATUS, "用户修改失败");
        }
        return success(response);
    }

    /**
     * 获取用户拥有的角色
     *
     * @param userId 用户id
     * @return 角色列表
     */
    public String getUserRoles(Long userId) {
        List<Roles> rolesList = new ArrayList<>();
        List<Long> roleIdList = userRolesService.selectRolesByUserId(userId);
        for (Long roleId : roleIdList) {
            Roles roles = rolesService.selectByPrimaryKey(roleId);
            rolesList.add(roles);
        }
        Map<String, Object> params = new HashMap<>();
        params.put("userId", userId);
        List<Roles> roleList = rolesService.getRolesList(params);
        if (userId != 0) {
            roleList = rolesList;
        }
        return success(roleList);
    }

    /**
     * 重置用户密码
     *
     * @param user 用户对象
     * @return 重置密码结果
     */
    public String resetPwd(Users user) {
        Response response = new Response();
        if (CommonConstants.SUPER_USER_ID.equals(user.getEname())) {
            response.setCodeMsg(CommonConstants.FAILURE_STATUS, "超级管理员密码不允许操作");
        } else {
            int result = 0;
            try {
                user.setPassword(MD5Utils.generatePassword(CommonConstants.DEFAULT_USER_PWD));
                updateByPrimaryKeySelective(user);
                result = 1;
            } catch (Exception e) {
                logger.error("重置用户密码异常：{}", e);
            }
            if (result == 1) {
                response.setCodeMsg(CommonConstants.SUCCESS_STATUS, "成功");
            } else {
                response.setCodeMsg(CommonConstants.FAILURE_STATUS, "失败");
            }
        }
        return success(response);
    }

    /**
     * 启用/禁用用户
     *
     * @param user 用户对象
     * @return 更新结果
     */
    public String status(Users user) {
        Response response = new Response();
        if (CommonConstants.SUPER_USER_ID.equals(user.getEname())) {
            response.setCodeMsg(CommonConstants.FAILURE_STATUS, "超级管理员状态不允许操作");
        } else {
            int result = 0;
            user.setErased(!user.getErased());
            try {
                updateByPrimaryKeySelective(user);
                result = 1;
            } catch (Exception e) {
                logger.error("更新出错：{}", e);
            }
            if (result == 1) {
                response.setCodeMsg(CommonConstants.SUCCESS_STATUS, "成功");
            } else {
                response.setCodeMsg(CommonConstants.FAILURE_STATUS, "失败");
            }
        }
        return success(response);
    }

    /**
     * 修改用户密码
     *
     * @param oldPassword 旧密码
     * @param newPassword 新密码
     * @return 更新结果
     */
    public String updatePwd(String oldPassword, String newPassword) {
        Users user = UserUtils.getCurrent();
        Response response = new Response();
        int result = 0;
        try {
            oldPassword = MD5Utils.encodeByMD5(oldPassword);
            if (!oldPassword.equals(user.getPassword())) {
                response.setCodeMsg(CommonConstants.FAILURE_STATUS, "原始密码错误");
                return success(response);
            }
            newPassword = MD5Utils.encodeByMD5(newPassword);
            Users newUser = new Users();
            newUser.setId(user.getId());
            newUser.setPassword(newPassword);
            updateByPrimaryKeySelective(newUser);
            result = 1;
        } catch (Exception e) {
            logger.error("修改密码失败：{}", e);
            response.setCodeMsg(CommonConstants.FAILURE_STATUS, "密码修改失败");
        }
        if (result == 1) {
            response.setCodeMsg(CommonConstants.SUCCESS_STATUS, "密码修改成功，请重新登录");
        }
        return success(response);
    }
}
