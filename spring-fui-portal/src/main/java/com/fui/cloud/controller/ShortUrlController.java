package com.fui.cloud.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * Created by sf.xiong on 2017-11-18.
 */
@Controller
public class ShortUrlController extends AbstractSuperController {

    @RequestMapping("/{shortUrl}")
    public String index(@PathVariable("shortUrl") String shortUrl) {
        logger.info("shortUrl = [" + shortUrl + "]");
        return "redirect:https://www.baidu.com";
    }
}
