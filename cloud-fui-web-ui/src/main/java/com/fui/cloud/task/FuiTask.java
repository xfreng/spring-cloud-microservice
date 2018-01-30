package com.fui.cloud.task;

import com.alibaba.fastjson.JSONObject;
import com.fui.cloud.common.MemCachedUtils;
import com.fui.cloud.service.project.ProjectService;
import org.quartz.Job;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.quartz.JobKey;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.Map;

/**
 * @Title 定时任务
 * @Author sf.xiong on 2017/4/13.
 */
public class FuiTask implements Job {
    private final Logger logger = LoggerFactory.getLogger(FuiTask.class);

    @Autowired
    private ProjectService projectService;

    /**
     * 启动时执行一次，之后每隔cronExpression执行一次(缓存项目配置信息)
     */
    public void runTask() {
        List<Map<String, Object>> projectMapList = projectService.selectAll();
        for (Map<String, Object> projectMap : projectMapList) {
            JSONObject project = new JSONObject(projectMap);
            MemCachedUtils.set(project.getString("name"), project.getString("nameDesc"));
        }
    }

    @Override
    public void execute(JobExecutionContext context) throws JobExecutionException {
        JobKey jobKey = context.getJobDetail().getKey();
        String key = jobKey.getName();
        String group = jobKey.getGroup();
        this.runTask();
        logger.info("运行缓存任务key：{},group：{}...", key, group);
    }
}
