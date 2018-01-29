package com.fui.cloud.controller.login;

import com.alibaba.fastjson.JSONObject;
import com.fui.cloud.common.UserUtils;
import com.fui.cloud.controller.AbstractSuperController;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.context.config.annotation.RefreshScope;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import javax.annotation.PostConstruct;
import java.net.URLEncoder;

@RefreshScope
@Controller
@RequestMapping(value = {"/supervisor/login"})
public class LoginController extends AbstractSuperController {
    @Value("${shiro.cas}")
    private String casServerUrlPrefix;
    @Value("${shiro.server}")
    private String shiroServerUrlPrefix;
    @Value("${pac4j.clientName}")
    private String clientName;
    private String loginUrl;

    @PostConstruct
    public void init() {
        loginUrl = shiroServerUrlPrefix + "/" + clientName;
    }

    @RequestMapping("/default")
    public String defaults() {
        return "supervisor/default/index";
    }

    @RequestMapping("/pact")
    public String pact() {
        return "supervisor/pact/index";
    }

    @RequestMapping("/timeout")
    public ModelAndView timeout() {
        ModelAndView mv = new ModelAndView("supervisor/error/timeout");
        mv.addObject("loginUrl", loginUrl);
        return mv;
    }

    @RequestMapping("/unAuthorized")
    public String unAuthorized() {
        return "supervisor/error/unAuthorized";
    }

    @RequestMapping("/logout")
    public ModelAndView logout() throws Exception {
        JSONObject user = UserUtils.getCurrent();
        if (user != null) {
            UserUtils.getSubject().logout();
        }
        // 设置注销页面
        String clientUrl = shiroServerUrlPrefix + "/" + clientName + "/callback?client_name=" + clientName;
        String loginUrl = casServerUrlPrefix + "/logout?service=" + URLEncoder.encode(clientUrl, "utf-8");
        return new ModelAndView("redirect:" + loginUrl);
    }
}