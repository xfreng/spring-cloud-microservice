package com.fui.cloud.dao.fui.log;

import com.fui.cloud.dao.BaseMapper;
import com.fui.cloud.model.fui.SystemLogs;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

@Mapper
public interface SystemLogsMapper extends BaseMapper<SystemLogs, Long> {

    /**
     * 分页查询系统日志信息
     *
     * @param params 查询条件
     * @return 系统日志列表
     */
    List<SystemLogs> getSystemLogsList(Map<String, Object> params);
}