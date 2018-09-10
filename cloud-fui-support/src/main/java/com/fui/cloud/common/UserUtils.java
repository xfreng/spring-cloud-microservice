package com.fui.cloud.common;

import com.alibaba.fastjson.JSONObject;
import com.fui.cloud.model.ManageToken;
import io.buji.pac4j.subject.Pac4jPrincipal;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.subject.Subject;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

public class UserUtils {

    /**
     * 获取当前请求对象
     *
     * @return HttpServletRequest
     */
    public static HttpServletRequest getCurrentRequest() {
        return ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes())
                .getRequest();
    }

    public static Subject getSubject() {
        return SecurityUtils.getSubject();
    }

    /**
     * 更换主题后刷新当前用户信息
     *
     * @param style    样式
     * @param menuType 类型
     */
    public static void updateCurrent(String style, String menuType) {
        JSONObject user = getCurrent();
        user.put("style", style);
        user.put("menuType", menuType);
    }

    /**
     * 获取当前用户信息
     *
     * @return 当前用户信息
     */
    public static JSONObject getCurrent() {
        JSONObject user = new JSONObject();
        Subject subject = getSubject();
        if (subject != null) {
            Pac4jPrincipal principal = (Pac4jPrincipal) subject.getPrincipal();
            if (principal != null) {
                user = JSONObject.parseObject(JSONObject.toJSONString(principal.getProfile().getAttributes()));
            }
        } else {
            String menuType = "pact";
            String menuStyle = "black";
            user.put("menuType", menuType);
            user.put("menuStyle", menuStyle);
        }
        return user;
    }

    /**
     * 是否拥有某个权限
     *
     * @param perm 权限id
     * @return 是true 否false
     */
    public static boolean hasPermission(String perm) {
        return getSubject().isPermitted(perm);
    }

    /**
     * 获取session中的token
     *
     * @return ManageToken
     */
    public static ManageToken getManageToken() {
        HttpSession session = getCurrentRequest().getSession(false);
        return session != null ? (ManageToken) session.getAttribute(CommonConstants.USER_SESSION_ID) : null;
    }
}
