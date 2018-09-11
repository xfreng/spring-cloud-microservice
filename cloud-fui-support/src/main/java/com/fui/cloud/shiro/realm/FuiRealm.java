package com.fui.cloud.shiro.realm;

import com.alibaba.fastjson.JSONObject;
import com.fui.cloud.common.CommonConstants;
import com.fui.cloud.service.right.PermissionsService;
import com.fui.cloud.service.role.RolesService;
import com.fui.cloud.service.user.UserRolesService;
import com.fui.cloud.service.user.UserService;
import com.fui.cloud.shiro.perms.FuiPermission;
import io.buji.pac4j.realm.Pac4jRealm;
import io.buji.pac4j.subject.Pac4jPrincipal;
import io.buji.pac4j.token.Pac4jToken;
import org.apache.commons.lang.StringUtils;
import org.apache.shiro.authc.AuthenticationException;
import org.apache.shiro.authc.AuthenticationInfo;
import org.apache.shiro.authc.AuthenticationToken;
import org.apache.shiro.authc.SimpleAuthenticationInfo;
import org.apache.shiro.authz.AuthorizationInfo;
import org.apache.shiro.authz.Permission;
import org.apache.shiro.authz.SimpleAuthorizationInfo;
import org.apache.shiro.subject.PrincipalCollection;
import org.apache.shiro.subject.SimplePrincipalCollection;
import org.pac4j.core.profile.CommonProfile;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * @Title 自定义realms
 * @Description 用于实现基于Shiro的认证及授权
 * @Author sf.xiong on 2017/04/25.
 */
public class FuiRealm extends Pac4jRealm {
    private static final Logger logger = LoggerFactory.getLogger(FuiRealm.class);

    @Autowired
    private UserService userService;
    @Autowired
    private UserRolesService userRolesService;
    @Autowired
    private RolesService rolesService;
    @Autowired
    private PermissionsService permissionsService;

    //实现用户的认证
    @Override
    protected AuthenticationInfo doGetAuthenticationInfo(AuthenticationToken authenticationToken) throws AuthenticationException {
        logger.info("doGetAuthenticationInfo: {}", authenticationToken.toString());
        final Pac4jToken token = (Pac4jToken) authenticationToken;
        final List<CommonProfile> profiles = token.getProfiles();
        final Pac4jPrincipal principal = new Pac4jPrincipal(profiles, this.getPrincipalNameAttribute());
        //从cas获取当前用户的认证信息
        Map<String, Object> attributes = principal.getProfile().getAttributes();
        if (attributes != null) {
            JSONObject user = JSONObject.parseObject(JSONObject.toJSONString(attributes));
            String username = user.getString("ename");
            try {
                logger.info("对用户 {} 进行登录验证...验证开始", username);
                if (user.getBoolean("erased")) {
                    logger.info("用户 {} 登录认证通过", username);
                    userService.login(user.getLong("id"));
                    PrincipalCollection principalCollection = new SimplePrincipalCollection(principal, this.getName());
                    return new SimpleAuthenticationInfo(principalCollection, profiles.hashCode());
                }
            } catch (Exception e) {
                logger.error("login Exception: {}", e);
            }
        }
        return null;
    }

    //实现用户的授权
    @Override
    protected AuthorizationInfo doGetAuthorizationInfo(PrincipalCollection principals) {
        final Pac4jPrincipal principal = ((Pac4jPrincipal) principals.getPrimaryPrincipal());
        JSONObject user = JSONObject.parseObject(JSONObject.toJSONString(principal.getProfile().getAttributes()));
        List<JSONObject> permissionsList;
        //从DB获取当前用户的权限信息
        if (CommonConstants.SUPER_USER_ID.equals(user.getString("ename"))) {  //超级管理员拥有所有权限
            permissionsList = permissionsService.selectAllRight();
        } else {  //其他用户根据角色获取权限
            permissionsList = new ArrayList<JSONObject>();
            List<Long> roleIdList = userRolesService.selectRolesByUserId(user.getLong("id"));
            String[] rolePermissions;
            List<String> permissionIdList = new ArrayList<String>();
            JSONObject permission;
            for (Long roleId : roleIdList) {
                rolePermissions = rolesService.selectByPrimaryKey(roleId).getString("permissions").split(",");
                for (String rolePermission : rolePermissions) {
                    if (!permissionIdList.contains(rolePermission)) {
                        permissionIdList.add(rolePermission);
                        permission = permissionsService.selectByPrimaryKey(Long.valueOf(rolePermission));
                        if (permission != null) {
                            permissionsList.add(permission);
                        }
                    }
                }
            }
        }

        //转换为自定义shiro权限
        List<Permission> fuiPermissionList = new ArrayList<Permission>();
        for (Object perObject : permissionsList) {
            JSONObject permitInfo = JSONObject.parseObject(JSONObject.toJSONString(perObject));
            String url = permitInfo.getString("url");
            if (StringUtils.isNotBlank(url) && url.contains(",")) {
                //一个权限可能涉及多个URL
                String[] permits = url.split(",");
                for (String permit : permits) {
                    fuiPermissionList.add(new FuiPermission(permitInfo.getString("code"), permit));
                }
            } else {
                fuiPermissionList.add(new FuiPermission(permitInfo.getString("code"), permitInfo.getString("url")));
            }
        }

        //为当前用户设置权限
        SimpleAuthorizationInfo simpleAuthorInfo = new SimpleAuthorizationInfo();
        simpleAuthorInfo.addObjectPermissions(fuiPermissionList);
        logger.info("SimpleAuthorizationInfo: permissions={}", fuiPermissionList.toString());
        return simpleAuthorInfo;
    }

}
