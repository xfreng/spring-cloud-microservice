package com.fui.cloud.controller.demo;

import com.fui.cloud.controller.AbstractSuperController;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping(value = "/supervisor/demo")
public class DemoController extends AbstractSuperController {

    @RequestMapping("/webuploader")
    public String webuploader() {
        return "supervisor/demo/webuploader/index";
    }
}
