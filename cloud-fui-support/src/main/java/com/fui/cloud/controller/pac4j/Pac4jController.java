package com.fui.cloud.controller.pac4j;

import com.alibaba.fastjson.JSONObject;
import com.fui.cloud.common.UserUtils;
import com.fui.cloud.controller.AbstractSuperController;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.context.config.annotation.RefreshScope;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

@RefreshScope
@Controller
@RequestMapping(value = "/{clientName}")
public class Pac4jController extends AbstractSuperController {

    @Value("${shiro.server}")
    private String shiroServerUrlPrefix;

    @RequestMapping(value = {"/index"})
    public String index(@PathVariable String clientName) {
        JSONObject user = UserUtils.getCurrent();
        if (user != null) {
            return "supervisor/" + user.getString("menuType") + "/index";
        } else {
            return shiroServerUrlPrefix + "/" + clientName;
        }
    }
}