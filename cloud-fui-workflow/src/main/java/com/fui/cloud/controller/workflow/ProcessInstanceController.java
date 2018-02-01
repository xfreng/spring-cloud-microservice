package com.fui.cloud.controller.workflow;

import com.alibaba.fastjson.JSONObject;
import com.fui.cloud.common.CommonConstants;
import com.fui.cloud.common.ProcessDefinitionCache;
import com.fui.cloud.controller.AbstractSuperController;
import com.fui.cloud.model.ProcessInstanceModel;
import org.activiti.engine.RepositoryService;
import org.activiti.engine.RuntimeService;
import org.activiti.engine.runtime.ProcessInstance;
import org.activiti.engine.runtime.ProcessInstanceQuery;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping(value = "/supervisor/workflow/processinstance")
public class ProcessInstanceController extends AbstractSuperController {

    @Autowired
    private RepositoryService repositoryService;

    @Autowired
    private RuntimeService runtimeService;

    @RequestMapping(value = "/index")
    public ModelAndView index() throws Exception {
        ModelAndView mv = new ModelAndView("supervisor/workflow/running-manage");
        return init(mv);
    }

    /**
     * 运行中的流程列表
     *
     * @return
     */
    @RequestMapping(value = "/list", produces = CommonConstants.MediaType_APPLICATION_JSON)
    @ResponseBody
    public String running(@RequestParam(value = "pageIndex", defaultValue = "1") int currPage,
                          @RequestParam(value = "pageSize", defaultValue = "10") int pageSize) throws Exception {
        String flowName = request.getParameter("flowName");
        String flowKey = request.getParameter("flowKey");
        String flowCategory = request.getParameter("flowCategory");

        ProcessInstanceQuery processInstanceQuery = runtimeService.createProcessInstanceQuery().active();
        if (StringUtils.isNotBlank(flowKey)) {
            processInstanceQuery = processInstanceQuery.processDefinitionKey(flowKey);
        }
        if (StringUtils.isNotBlank(flowName)) {
            processInstanceQuery = processInstanceQuery.processDefinitionName(flowName);
        }
        if (StringUtils.isNotBlank(flowCategory)) {
            processInstanceQuery = processInstanceQuery.processDefinitionCategory(flowCategory);
        }
        List<ProcessInstance> runningList = processInstanceQuery.listPage(currPage, pageSize);
        ProcessDefinitionCache.setRepositoryService(repositoryService);
        List<ProcessInstanceModel> processInstanceEntityList = new ArrayList<ProcessInstanceModel>();
        for (ProcessInstance processInstance : runningList) {
            ProcessInstanceModel processInstanceModel = new ProcessInstanceModel();
            BeanUtils.copyProperties(processInstance, processInstanceModel);
            String did = ProcessDefinitionCache.getActivityName(processInstance.getProcessDefinitionId(), processInstance.getActivityId());
            processInstanceModel.setDid(did);
            processInstanceEntityList.add(processInstanceModel);
        }
        JSONObject json = new JSONObject();
        json.put("runningList", processInstanceEntityList);
        json.put("total", processInstanceQuery.count());
        return success(json);
    }

    /**
     * 挂起、激活流程实例
     */
    @RequestMapping(value = "/update/{state}/{processInstanceId}", produces = CommonConstants.MediaType_APPLICATION_JSON)
    @ResponseBody
    public String updateState(@PathVariable("state") String state,
                              @PathVariable("processInstanceId") String processInstanceId) {
        Map<String, Object> data = new HashMap<String, Object>();
        if (state.equals("active")) {
            data.put("message", "已激活ID为[" + processInstanceId + "]的流程实例。");
            runtimeService.activateProcessInstanceById(processInstanceId);
        } else if (state.equals("suspend")) {
            runtimeService.suspendProcessInstanceById(processInstanceId);
            data.put("message", "已挂起ID为[" + processInstanceId + "]的流程实例。");
        }
        return success(data);
    }
}
