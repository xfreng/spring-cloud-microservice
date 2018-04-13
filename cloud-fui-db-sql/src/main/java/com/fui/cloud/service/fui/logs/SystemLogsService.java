package com.fui.cloud.service.fui.logs;

import com.fui.cloud.dao.fui.logs.SystemLogsMapper;
import com.fui.cloud.model.fui.SystemLogs;
import com.fui.cloud.service.fui.AbstractSuperImplService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.PostConstruct;
import java.util.List;
import java.util.Map;

/**
 * @Title 日志业务类
 * @Author sf.xiong on 2018-04-11.
 */
@Service("systemLogsService")
@Transactional
public class SystemLogsService extends AbstractSuperImplService<SystemLogs, Long> {

    @Autowired
    private SystemLogsMapper systemLogsMapper;

    @PostConstruct
    public void initMapper() {
        this.baseMapper = systemLogsMapper;
    }

    /**
     * 分页查询系统日志信息
     *
     * @param params 查询条件
     * @return 系统日志列表
     */
    public List<SystemLogs> getSystemLogsList(Map<String, Object> params) {
        return systemLogsMapper.getSystemLogsList(params);
    }
}
