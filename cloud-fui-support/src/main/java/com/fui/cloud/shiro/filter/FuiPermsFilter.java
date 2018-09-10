package com.fui.cloud.shiro.filter;

import com.alibaba.fastjson.JSONObject;
import com.fui.cloud.common.CommonConstants;
import com.fui.cloud.common.UserUtils;
import org.apache.shiro.web.filter.authz.PermissionsAuthorizationFilter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import java.io.IOException;

/**
 * @Title 自定义perms拦截器
 * @Description 用于实现url权限拦截
 * @Author sf.xiong on 2017/04/25.
 */
public class FuiPermsFilter extends PermissionsAuthorizationFilter {
    private static final Logger logger = LoggerFactory.getLogger(FuiPermsFilter.class);

    @Override
    public boolean isAccessAllowed(ServletRequest request, ServletResponse response, Object mappedValue) throws IOException {
        JSONObject user = UserUtils.getCurrent();
        if (user != null && CommonConstants.SUPER_USER_ID.equals(user.getString("ename"))) {  //超级管理员拥有所有权限
            return true;
        }
        String[] perms = (String[]) mappedValue;
        if (perms != null && perms.length > 0) {
            return super.isAccessAllowed(request, response, mappedValue);
        }
        if (UserUtils.hasPermission(this.getPathWithinApplication(request))) {
            return true;
        }
        if (user != null) {
            logger.error("agent:{} access url:{} not allowed", user.getString("cname"), this.getPathWithinApplication(request));
        }
        return false;
    }
}
