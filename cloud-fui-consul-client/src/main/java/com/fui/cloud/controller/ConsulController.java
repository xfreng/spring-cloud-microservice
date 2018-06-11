package com.fui.cloud.controller;

import com.alibaba.fastjson.JSONObject;
import com.fui.cloud.remote.FuiDbSqlRemote;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping(value = "/calendar")
public class ConsulController {

    @Autowired
    private FuiDbSqlRemote fuiDbSqlRemote;

    /**
     * 测试
     *
     * @return Response
     * @throws ExecutionException
     */
    @GetMapping(path = "/all", produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    public String queryAll() throws ExecutionException {
        JSONObject json = new JSONObject();
        List<Map<String, Object>> allCalendar = fuiDbSqlRemote.queryAllCalendar();
        json.put("data", allCalendar);
        return json.toJSONString();
    }
}
