package com.fui.cloud.service.logs;

import com.alibaba.fastjson.JSONObject;
import com.fui.cloud.enums.AppId;
import com.fui.cloud.service.AbstractSuperService;
import org.springframework.stereotype.Service;

import java.util.Map;

/**
 * @Title 系统日志操作业务
 * @Author sf.xiong on 2018-04-11.
 */
@Service("systemLogsService")
public class SystemLogsService extends AbstractSuperService {

    /**
     * 分页查询系统日志信息
     *
     * @param params 查询条件
     * @return 系统日志列表
     */
    public JSONObject getSystemLogsList(Integer pageNum, Integer pageSize, String key, Map<String, Object> params) {
        return getResult(AppId.getName(1), "/logs/getSystemLogsList/{pageNum}/{pageSize}/{key}/{params}", JSONObject.class, pageNum, pageSize, key, JSONObject.toJSONString(params));
    }

    public int insert(JSONObject data) {
        return postResult(AppId.getName(1), "/logs/insert/{data}", Integer.class, data.toJSONString());
    }
}
