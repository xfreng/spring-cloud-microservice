package com.fui.cloud.controller.pac4j;

import com.fui.cloud.common.UserUtils;
import com.fui.cloud.controller.AbstractSuperController;
import com.fui.cloud.model.fui.Users;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class Pac4jController extends AbstractSuperController {

    @RequestMapping(value = {"/index"})
    public String index() {
        String menuType = "pact";
        Users user = UserUtils.getCurrent();
        if (user != null) {
            menuType = user.getMenuType();
            String style = user.getStyle();
            if ("fuiAdmin".equals(style)) {
                menuType = style;
            }
        }
        return "supervisor/" + menuType + "/index";
    }
}