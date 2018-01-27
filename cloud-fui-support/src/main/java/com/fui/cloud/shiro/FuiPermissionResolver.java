package com.fui.cloud.shiro;

import org.apache.shiro.authz.Permission;
import org.apache.shiro.authz.permission.PermissionResolver;

/**
 * @Title 自定义PermissionResolver
 * @Description 用于告诉 Shiro 根据字符串的表现形式，采用什么样的 Permission 进行匹配
 * @Author sf.xiong on 2017/04/25.
 */
public class FuiPermissionResolver implements PermissionResolver {
    @Override
    public Permission resolvePermission(String s) {
        return new FuiPermission(s);
    }
}
