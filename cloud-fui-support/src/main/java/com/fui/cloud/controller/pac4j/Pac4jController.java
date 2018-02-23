package com.fui.cloud.controller.pac4j;

import com.alibaba.fastjson.JSONObject;
import com.fui.cloud.common.UserUtils;
import com.fui.cloud.controller.AbstractSuperController;
import org.springframework.cloud.context.config.annotation.RefreshScope;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@RefreshScope
@Controller
public class Pac4jController extends AbstractSuperController {

    @RequestMapping(value = {"/index"})
    public String index() {
        String menuType = "pact";
        JSONObject user = UserUtils.getCurrent();
        if (user != null) {
            menuType = user.getString("menuType");
        }
        return "supervisor/" + menuType + "/index";
    }
}