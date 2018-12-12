package com.fui.cloud.controller;

import com.alibaba.fastjson.JSONObject;
import com.fui.cloud.config.DemoConsulPropertiesConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "consul/config")
public class DemoConsulConfigController {

    @Value("${jdbc.username}")
    private String username;

    @Autowired
    private DemoConsulPropertiesConfig demoConsulPropertiesConfig;

    /**
     * 测试
     *
     * @return Response
     */
    @GetMapping(path = "/demo", produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    public String demo() {
        JSONObject json = new JSONObject();
        json.put("username", username);
        json.put("password", demoConsulPropertiesConfig.getPassword());
        return json.toJSONString();
    }
}
