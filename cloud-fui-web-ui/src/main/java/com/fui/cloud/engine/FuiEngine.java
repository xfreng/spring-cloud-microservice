package com.fui.cloud.engine;

import com.fui.cloud.common.QuartzManager;
import com.fui.cloud.common.StringUtils;
import com.fui.cloud.model.ScheduleJob;
import com.fui.cloud.task.FuiTask;
import org.springframework.scheduling.quartz.SchedulerFactoryBean;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;

public class FuiEngine {

    private boolean quartzSwitch;
    private String cronExpression;
    private FuiTask fuiTask;
    private SchedulerFactoryBean schedulerFactoryBean;
    public static ThreadLocal<ScheduleJob> curScheduleJob = new ThreadLocal<ScheduleJob>();

    public FuiEngine(FuiTask fuiTask, SchedulerFactoryBean schedulerFactoryBean) {
        this.fuiTask = fuiTask;
        this.schedulerFactoryBean = schedulerFactoryBean;
    }

    @PostConstruct
    public void init() {
        if (quartzSwitch) {
            ScheduleJob scheduleJob = curScheduleJob.get();
            if (scheduleJob == null) {
                scheduleJob = new ScheduleJob();
                scheduleJob.setJobId(StringUtils.getUUID());
                scheduleJob.setJobName("memCached");
                scheduleJob.setJobGroup("cachedWork");
                scheduleJob.setJobStatus("1");
                scheduleJob.setCronExpression(cronExpression);
                scheduleJob.setDesc("缓存项目配置信息任务");
                curScheduleJob.set(scheduleJob);
            }
            QuartzManager.addJob(schedulerFactoryBean, scheduleJob, fuiTask.getClass());
        }
    }

    @PreDestroy
    public void destroy() {
        QuartzManager.removeJob(schedulerFactoryBean, curScheduleJob.get());
        curScheduleJob.remove();
    }

    public void setQuartzSwitch(boolean quartzSwitch) {
        this.quartzSwitch = quartzSwitch;
    }

    public void setCronExpression(String cronExpression) {
        this.cronExpression = cronExpression;
    }
}
