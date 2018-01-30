package com.fui.cloud.service.workflow;

import com.alibaba.fastjson.JSONObject;
import com.fui.cloud.common.UserSession;
import org.activiti.engine.ActivitiException;
import org.activiti.engine.IdentityService;
import org.activiti.engine.RuntimeService;
import org.activiti.engine.runtime.ProcessInstance;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Map;

/**
 * @Title 流程相关业务
 * @Author sf.xoing on 2017/6/7.
 */
@Service
public class WorkflowService {
    protected Logger logger = LoggerFactory.getLogger(WorkflowService.class);

    @Autowired
    private IdentityService identityService;

    @Autowired
    private RuntimeService runtimeService;

    /**
     * 启动流程
     *
     * @param key
     * @param variables
     * @return 流程实例
     */
    public JSONObject startWorkflowByKey(String key, Map<String, Object> variables) {
        logger.debug("variables: {}", variables);
        JSONObject json = new JSONObject();
        try {
            identityService.setAuthenticatedUserId(UserSession.getLoginName());

            ProcessInstance processInstance = runtimeService.startProcessInstanceByKey(key, variables);
            String processInstanceId = processInstance.getId();
            logger.debug("start process of {key={}, pid={}, variables={}}", key, processInstanceId, variables);
            json.put("message", "流程已启动，流程ID：" + processInstanceId);
        } catch (ActivitiException e) {
            if (e.getMessage().contains("no processes deployed with key")) {
                logger.warn("没有部署流程！", e);
                json.put("message", "没有部署流程，请重新部署流程！");
            } else {
                logger.error("启动请假流程失败：", e);
                json.put("message", "系统内部错误！");
            }
        } catch (Exception e) {
            logger.error("启动请假流程失败：", e);
            json.put("message", "系统内部错误！");
        } finally {
            identityService.setAuthenticatedUserId(null);
        }
        return json;
    }
}
