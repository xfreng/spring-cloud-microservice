package com.fui.cloud.controller.fui.style;

import com.fui.cloud.controller.AbstractSuperController;
import com.fui.cloud.service.fui.style.StyleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/api/fui/style")
public class StyleController extends AbstractSuperController {

    @Autowired
    private StyleService styleService;

    @GetMapping(value = "/updateMenuTypeAndStyle/{data}")
    public boolean updateMenuTypeAndStyle(@PathVariable String data) {
        return styleService.updateMenuTypeAndStyleByUserId(data);
    }
}
