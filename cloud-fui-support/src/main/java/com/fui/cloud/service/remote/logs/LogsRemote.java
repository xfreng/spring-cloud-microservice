package com.fui.cloud.service.remote.logs;

import com.alibaba.fastjson.JSONObject;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@FeignClient(value = "fui-db-sql")
@RequestMapping("/api/fui/logs")
public interface LogsRemote {

    @GetMapping(value = "/getSystemLogsList/{pageNum}/{pageSize}/{key}/{params}")
    JSONObject getSystemLogsList(@PathVariable("pageNum") Integer pageNum, @PathVariable("pageSize") Integer pageSize, @PathVariable("key") String key, @PathVariable("params") String params);

    @PostMapping(value = "/insert/{data}")
    int insert(@PathVariable("data") String data);
}
