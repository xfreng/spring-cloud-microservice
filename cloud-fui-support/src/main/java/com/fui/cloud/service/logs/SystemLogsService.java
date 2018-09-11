package com.fui.cloud.service.logs;

import com.alibaba.fastjson.JSONObject;
import com.fui.cloud.service.AbstractSuperService;
import com.fui.cloud.service.remote.logs.LogsRemote;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Map;

/**
 * @Title 系统日志操作业务
 * @Author sf.xiong on 2018-04-11.
 */
@Service("systemLogsService")
public class SystemLogsService extends AbstractSuperService {

    @Autowired
    private LogsRemote logsRemote;

    /**
     * 分页查询系统日志信息
     *
     * @param params 查询条件
     * @return 系统日志列表
     */
    public JSONObject getSystemLogsList(Integer pageNum, Integer pageSize, String key, Map<String, Object> params) {
        return logsRemote.getSystemLogsList(pageNum, pageSize, key, JSONObject.toJSONString(params));
    }

    public int insert(JSONObject data) {
        return logsRemote.insert(data.toJSONString());
    }
}
