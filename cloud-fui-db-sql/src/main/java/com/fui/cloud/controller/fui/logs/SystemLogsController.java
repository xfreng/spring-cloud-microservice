package com.fui.cloud.controller.fui.logs;

import com.alibaba.fastjson.JSONObject;
import com.fui.cloud.controller.AbstractSuperController;
import com.fui.cloud.model.fui.SystemLogs;
import com.fui.cloud.service.fui.logs.SystemLogsService;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * @Title 系统日志api
 * @Author sf.xiong on 2018-04-11.
 */
@RestController
@RequestMapping(value = "/api/fui/logs")
public class SystemLogsController extends AbstractSuperController {

    @Autowired
    private SystemLogsService systemLogsService;

    @PostMapping(value = {"/insert/{data}"})
    public int insert(@PathVariable String data) {
        SystemLogs record = JSONObject.parseObject(data, SystemLogs.class);
        return systemLogsService.insert(record);
    }

    @GetMapping(value = {"/getSystemLogsList/{pageNum}/{pageSize}/{key}/{params}"})
    public JSONObject getSystemLogsList(@PathVariable Integer pageNum, @PathVariable Integer pageSize, @PathVariable String key, @PathVariable String params) {
        //分页查询
        PageHelper.startPage(pageNum, pageSize);
        List<SystemLogs> list = systemLogsService.getSystemLogsList(JSONObject.parseObject(params));
        PageInfo<SystemLogs> pageInfo = createPagination(list);
        String json = success(list, pageInfo.getTotal(), key);
        return JSONObject.parseObject(json);
    }
}
