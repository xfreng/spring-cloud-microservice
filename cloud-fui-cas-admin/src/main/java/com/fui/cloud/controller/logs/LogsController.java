package com.fui.cloud.controller.logs;

import com.fui.cloud.common.CommonConstants;
import com.fui.cloud.controller.AbstractSuperController;
import com.fui.cloud.service.fui.logs.SystemLogsService;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.HashMap;
import java.util.Map;

/**
 * @Title 日志管理
 * @Author sf.xiong on 2018/1/29.
 */
@Controller
@RequestMapping(value = "/supervisor/logs")
public class LogsController extends AbstractSuperController {

    @Autowired
    private SystemLogsService systemLogsService;

    @RequestMapping(value = "/index")
    public String index() {
        return "/supervisor/logs/index";
    }

    @RequestMapping(value = "/list", produces = CommonConstants.MediaType_APPLICATION_JSON)
    @ResponseBody
    public String getUserList(@RequestParam(value = "pageIndex", defaultValue = "1") int pageNum,
                              @RequestParam(value = "pageSize", defaultValue = "10") int pageSize) {
        Map<String, Object> params = new HashMap<>();
        setParamsToQueryCondition(params);
        return systemLogsService.getSystemLogsList(pageNum, pageSize, params);
    }

    /**
     * 设置分页查询条件
     *
     * @param params 查询条件
     */
    private void setParamsToQueryCondition(Map<String, Object> params) {
        String name = request.getParameter("name");
        if (StringUtils.isNotBlank(name)) {// 操作人
            params.put("name", name);
        }
        String ip = request.getParameter("ip");
        if (StringUtils.isNotBlank(ip)) {// 操作ip
            params.put("ip", ip);
        }
        String startTime = request.getParameter("startTime");
        if (StringUtils.isNotBlank(startTime)) {// 操作开始时间
            params.put("startTime", startTime);
        }
        String endTime = request.getParameter("endTime");
        if (StringUtils.isNotBlank(endTime)) {// 操作结束时间
            params.put("endTime", endTime);
        }
    }

}
