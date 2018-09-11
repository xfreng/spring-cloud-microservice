package com.fui.cloud.service.remote.project;

import com.alibaba.fastjson.JSONObject;
import org.springframework.cloud.netflix.feign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@FeignClient(value = "fui-db-sql")
@RequestMapping("/api/fui/project")
public interface ProjectRemote {

    @GetMapping(value = "/selectAll")
    List<JSONObject> selectAll();
}
