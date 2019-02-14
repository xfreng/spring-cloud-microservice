package com.fui.cloud.controller.login;

import com.fui.cloud.controller.AbstractSuperController;
import org.springframework.cloud.context.config.annotation.RefreshScope;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@RefreshScope
@Controller
@RequestMapping(value = {"/supervisor/login"})
public class LoginController extends AbstractSuperController {

    @RequestMapping("/default")
    public String defaults() {
        return "supervisor/default/index";
    }

    @RequestMapping("/pact")
    public String pact() {
        return "supervisor/pact/index";
    }

    @RequestMapping("/fuiAdmin")
    public String fuiAdmin() {
        return "supervisor/fuiAdmin/index";
    }

    @RequestMapping("/unAuthorized")
    public String unAuthorized() {
        return "supervisor/error/unAuthorized";
    }
}