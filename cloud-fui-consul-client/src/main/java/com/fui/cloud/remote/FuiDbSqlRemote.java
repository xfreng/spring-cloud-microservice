package com.fui.cloud.remote;

import org.springframework.cloud.netflix.feign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;
import java.util.Map;

/**
 * @Title 数据库持久操作服务类
 * @Author sf.xiong on 2018-06-11.
 */
@FeignClient(name = "fui-db-sql")
public interface FuiDbSqlRemote {

    /**
     * 查询所有日程信息
     *
     * @return 所有日程信息
     */
    @GetMapping(value = "/api/fui/calendar/query")
    List<Map<String, Object>> queryAllCalendar();
}
