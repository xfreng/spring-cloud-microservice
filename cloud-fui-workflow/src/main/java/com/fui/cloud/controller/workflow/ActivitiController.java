package com.fui.cloud.controller.workflow;

import com.alibaba.fastjson.JSONObject;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.fui.cloud.cmd.JumpActivityCmd;
import com.fui.cloud.common.CommonConstants;
import com.fui.cloud.common.WorkflowUtils;
import com.fui.cloud.controller.AbstractSuperController;
import com.fui.cloud.core.FrameworkInfo;
import com.fui.cloud.model.ProcessDefinitionModel;
import com.fui.cloud.service.workflow.WorkflowProcessDefinitionService;
import com.fui.cloud.service.workflow.WorkflowService;
import com.fui.cloud.service.workflow.WorkflowTraceService;
import org.activiti.bpmn.converter.BpmnXMLConverter;
import org.activiti.bpmn.model.BpmnModel;
import org.activiti.editor.constants.ModelDataJsonConstants;
import org.activiti.editor.language.json.converter.BpmnJsonConverter;
import org.activiti.engine.*;
import org.activiti.engine.impl.cfg.ProcessEngineConfigurationImpl;
import org.activiti.engine.impl.context.Context;
import org.activiti.engine.impl.interceptor.Command;
import org.activiti.engine.repository.*;
import org.activiti.engine.runtime.ProcessInstance;
import org.activiti.image.impl.DefaultProcessDiagramGenerator;
import org.activiti.spring.ProcessEngineFactoryBean;
import org.apache.commons.io.FilenameUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletResponse;
import javax.xml.stream.XMLInputFactory;
import javax.xml.stream.XMLStreamReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.zip.ZipInputStream;

/**
 * 流程管理控制器
 *
 * @author sf.xiong
 */
@Controller
@RequestMapping(value = "/supervisor/workflow/process")
public class ActivitiController extends AbstractSuperController {

    private WorkflowProcessDefinitionService workflowProcessDefinitionService;

    protected RepositoryService repositoryService;

    private RuntimeService runtimeService;

    private TaskService taskService;

    private WorkflowTraceService traceService;

    @Autowired
    ManagementService managementService;

    @Autowired
    ProcessEngineFactoryBean processEngine;

    @Autowired
    ProcessEngineConfiguration processEngineConfiguration;

    @Autowired
    WorkflowService workflowService;

    /* 导出目录 */
    private String exportDir = FrameworkInfo.getTempDir() + File.separator + "workflow";


    @RequestMapping(value = "/index")
    public ModelAndView index() throws Exception {
        ModelAndView mv = new ModelAndView("supervisor/workflow/process-list");
        return init(mv);
    }

    /**
     * 流程定义列表
     *
     * @return
     */
    @RequestMapping(value = "/list", produces = CommonConstants.MediaType_APPLICATION_JSON)
    @ResponseBody
    public String processList(@RequestParam(value = "pageIndex", defaultValue = "1") int currPage,
                              @RequestParam(value = "pageSize", defaultValue = "10") int pageSize) throws Exception {
        String flowName = request.getParameter("flowName");
        String flowKey = request.getParameter("flowKey");
        String flowCategory = request.getParameter("flowCategory");

        ProcessDefinitionQuery processDefinitionQuery = repositoryService.createProcessDefinitionQuery();
        if (StringUtils.isNotBlank(flowKey)) {
            processDefinitionQuery = processDefinitionQuery.processDefinitionKeyLike("%" + flowKey + "%");
        }
        if (StringUtils.isNotBlank(flowName)) {
            processDefinitionQuery = processDefinitionQuery.processDefinitionNameLike("%" + flowName + "%");
        }
        if (StringUtils.isNotBlank(flowCategory)) {
            processDefinitionQuery = processDefinitionQuery.processDefinitionCategory(flowCategory);
        }
        List<ProcessDefinition> processDefinitionList = processDefinitionQuery
                .processDefinitionCategoryNotEquals(CommonConstants.CATEGORY_NOT_EQUALS).orderByDeploymentId().desc()
                .listPage(currPage, pageSize);
        List<ProcessDefinitionModel> processDefinitionEntityList = new ArrayList<>();
        for (ProcessDefinition processDefinition : processDefinitionList) {
            String deploymentId = processDefinition.getDeploymentId();
            Deployment deployment = repositoryService.createDeploymentQuery().deploymentId(deploymentId).singleResult();
            ProcessDefinitionModel processDefinitionModel = new ProcessDefinitionModel();
            BeanUtils.copyProperties(processDefinition, processDefinitionModel);
            processDefinitionModel.setDeploymentTime(deployment.getDeploymentTime());
            processDefinitionEntityList.add(processDefinitionModel);
        }
        JSONObject json = new JSONObject();
        json.put("processList", processDefinitionEntityList);
        json.put("total", processDefinitionQuery.count());
        return success(json);
    }

    /**
     * 读取资源，通过部署ID
     *
     * @param processDefinitionId 流程定义
     * @param resourceType        资源类型(xml|image)
     * @throws IOException
     */
    @RequestMapping(value = "/resource/read")
    public void loadByDeployment(@RequestParam("processDefinitionId") String processDefinitionId,
                                 @RequestParam("resourceType") String resourceType, HttpServletResponse response) throws IOException {
        ProcessDefinition processDefinition = repositoryService.createProcessDefinitionQuery()
                .processDefinitionId(processDefinitionId).singleResult();
        outResource(resourceType, processDefinition, response);
    }

    private void outResource(String resourceType, ProcessDefinition processDefinition, HttpServletResponse response) throws IOException {
        String resourceName = "";
        if (resourceType.equals("image")) {
            resourceName = processDefinition.getDiagramResourceName();
        } else if (resourceType.equals("xml")) {
            resourceName = processDefinition.getResourceName();
        }
        InputStream resourceAsStream = repositoryService.getResourceAsStream(processDefinition.getDeploymentId(),
                resourceName);
        outResourceAsStream(resourceAsStream, response);
    }

    private void outResourceAsStream(InputStream in, HttpServletResponse response) throws IOException {
        byte[] b = new byte[1024];
        int len;
        while ((len = in.read(b, 0, 1024)) != -1) {
            response.getOutputStream().write(b, 0, len);
        }
    }

    /**
     * 读取资源，通过流程ID
     *
     * @param resourceType      资源类型(xml|image)
     * @param processInstanceId 流程实例ID
     * @param response
     * @throws IOException
     */
    @RequestMapping(value = "/resource/process-instance")
    public void loadByProcessInstance(@RequestParam("type") String resourceType,
                                      @RequestParam("pid") String processInstanceId, HttpServletResponse response) throws IOException {
        ProcessInstance processInstance = runtimeService.createProcessInstanceQuery()
                .processInstanceId(processInstanceId).singleResult();
        ProcessDefinition processDefinition = repositoryService.createProcessDefinitionQuery()
                .processDefinitionId(processInstance.getProcessDefinitionId()).singleResult();

        outResource(resourceType, processDefinition, response);
    }

    /**
     * 删除部署的流程，级联删除流程实例
     *
     * @param deploymentId 流程部署ID
     */
    @RequestMapping(value = "/delete", produces = CommonConstants.MediaType_APPLICATION_JSON)
    @ResponseBody
    public String delete(@RequestParam("deploymentId") String deploymentId) {
        Map<String, Object> data = new HashMap<>();
        try {
            repositoryService.deleteDeployment(deploymentId, true);
            data.put("message", "删除成功，流程部署ID=" + deploymentId);
        } catch (Exception e) {
            data.put("message", "删除失败，流程部署ID=" + deploymentId);
        }
        return success(data);
    }

    /**
     * 输出跟踪流程信息
     *
     * @param processInstanceId
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/trace")
    @ResponseBody
    public List<Map<String, Object>> traceProcess(@RequestParam("pid") String processInstanceId) throws Exception {
        return traceService.traceProcess(processInstanceId);
    }

    /**
     * 读取带跟踪的图片
     */
    @RequestMapping(value = "/trace/auto/{executionId}")
    public void readResource(@PathVariable("executionId") String executionId, HttpServletResponse response)
            throws Exception {
        ProcessInstance processInstance = runtimeService.createProcessInstanceQuery().processInstanceId(executionId)
                .singleResult();
        BpmnModel bpmnModel = repositoryService.getBpmnModel(processInstance.getProcessDefinitionId());
        List<String> activeActivityIds = runtimeService.getActiveActivityIds(executionId);

        processEngineConfiguration = processEngine.getProcessEngineConfiguration();
        Context.setProcessEngineConfiguration((ProcessEngineConfigurationImpl) processEngineConfiguration);

        DefaultProcessDiagramGenerator diagramGenerator = new DefaultProcessDiagramGenerator();
        InputStream imageStream = diagramGenerator.generateDiagram(bpmnModel, "png", activeActivityIds,
                Collections.emptyList(),
                processEngineConfiguration.getProcessEngineConfiguration().getActivityFontName(),
                processEngineConfiguration.getProcessEngineConfiguration().getLabelFontName(), null, null, 1.0);
        // 输出资源内容到相应对象
        outResourceAsStream(imageStream, response);
    }

    @RequestMapping(value = "/deploy", produces = CommonConstants.MediaType_APPLICATION_HTML)
    @ResponseBody
    public String deploy(@RequestParam(value = "category", required = false) String category,
                         @RequestParam(value = "file", required = false) MultipartFile file) {
        Map<String, Object> data = new HashMap<>();
        String fileName = file.getOriginalFilename();
        try {
            if (StringUtils.isNotBlank(fileName) && StringUtils.isNotBlank(category)) {
                InputStream fileInputStream = file.getInputStream();
                DeploymentBuilder deploymentBuilder = null;

                String extension = FilenameUtils.getExtension(fileName);
                if (extension.equals("zip") || extension.equals("bar")) {
                    ZipInputStream zip = new ZipInputStream(fileInputStream);
                    deploymentBuilder = repositoryService.createDeployment().addZipInputStream(zip);
                } else {
                    deploymentBuilder = repositoryService.createDeployment().addInputStream(fileName, fileInputStream);
                }
                Deployment deployment = deploymentBuilder.category(category).deploy();
                List<ProcessDefinition> list = repositoryService.createProcessDefinitionQuery()
                        .deploymentId(deployment.getId()).list();

                for (ProcessDefinition processDefinition : list) {
                    repositoryService.setProcessDefinitionCategory(processDefinition.getId(), category);
                    WorkflowUtils.exportDiagramToFile(repositoryService, processDefinition, exportDir);
                }
                data.put("message", "部署成功。");
            } else {
                data.put("message", "请选择要部署的流程类型及文件。\n(支持的文件格式：zip、bar、bpmn、bpmn20.xml)");
            }
        } catch (Exception e) {
            logger.error("error on deploy process, because of file input stream", e);
            data.put("message", "error on deploy process, because of file input stream。");
        }
        return success(data);
    }

    /**
     * 根据Model部署流程
     *
     * @param key
     */
    @RequestMapping(value = "/start-running/{key}", method = RequestMethod.POST, produces = CommonConstants.MediaType_APPLICATION_JSON)
    @ResponseBody
    public String deploy(@PathVariable("key") String key) {
        return success(workflowService.startWorkflowByKey(key, null));
    }

    @RequestMapping(value = "/convert-to-model/{processDefinitionId}", produces = CommonConstants.MediaType_APPLICATION_JSON)
    @ResponseBody
    public String convertToModel(@PathVariable("processDefinitionId") String processDefinitionId) {
        Map<String, Object> data = new HashMap<>();
        try {
            ProcessDefinition processDefinition = repositoryService.createProcessDefinitionQuery()
                    .processDefinitionId(processDefinitionId).singleResult();
            InputStream bpmnStream = repositoryService.getResourceAsStream(processDefinition.getDeploymentId(),
                    processDefinition.getResourceName());
            XMLInputFactory xif = XMLInputFactory.newInstance();
            InputStreamReader in = new InputStreamReader(bpmnStream, StandardCharsets.UTF_8);
            XMLStreamReader xtr = xif.createXMLStreamReader(in);
            BpmnModel bpmnModel = new BpmnXMLConverter().convertToBpmnModel(xtr);

            BpmnJsonConverter converter = new BpmnJsonConverter();
            com.fasterxml.jackson.databind.node.ObjectNode modelNode = converter.convertToJson(bpmnModel);
            Model modelData = repositoryService.newModel();
            modelData.setKey(processDefinition.getKey());
            modelData.setName(processDefinition.getResourceName());
            modelData.setCategory(processDefinition.getCategory());

            ObjectNode modelObjectNode = new ObjectMapper().createObjectNode();
            modelObjectNode.put(ModelDataJsonConstants.MODEL_NAME, processDefinition.getName());
            modelObjectNode.put(ModelDataJsonConstants.MODEL_REVISION, 1);
            modelObjectNode.put(ModelDataJsonConstants.MODEL_DESCRIPTION, processDefinition.getDescription());
            modelData.setMetaInfo(modelObjectNode.toString());

            repositoryService.saveModel(modelData);

            repositoryService.addModelEditorSource(modelData.getId(), modelNode.toString().getBytes(StandardCharsets.UTF_8));

            data.put("message", "转换成功。");
        } catch (Exception e) {
            data.put("message", "转换失败。");
        }
        return success(data);
    }

    /**
     * 挂起、激活流程实例
     */
    @RequestMapping(value = "/processdefinition/update/{state}/{processDefinitionId}", produces = CommonConstants.MediaType_APPLICATION_JSON)
    @ResponseBody
    public String updateState(@PathVariable("state") String state,
                              @PathVariable("processDefinitionId") String processDefinitionId) {
        Map<String, Object> data = new HashMap<>();
        if ("active".equals(state)) {
            data.put("message", "已激活ID为[" + processDefinitionId + "]的流程定义。");
            repositoryService.activateProcessDefinitionById(processDefinitionId, true, null);
        } else if ("suspend".equals(state)) {
            repositoryService.suspendProcessDefinitionById(processDefinitionId, true, null);
            data.put("message", "已挂起ID为[" + processDefinitionId + "]的流程定义。");
        }
        return success(data);
    }

    /**
     * 导出图片文件到硬盘
     *
     * @return
     */
    @RequestMapping(value = "/export/diagrams")
    @ResponseBody
    public List<String> exportDiagrams() throws IOException {
        List<String> files = new ArrayList<>();
        List<ProcessDefinition> list = repositoryService.createProcessDefinitionQuery().list();

        for (ProcessDefinition processDefinition : list) {
            files.add(WorkflowUtils.exportDiagramToFile(repositoryService, processDefinition, exportDir));
        }

        return files;
    }

    @RequestMapping(value = "/activity/jump")
    @ResponseBody
    public boolean jump(@RequestParam("executionId") String executionId,
                        @RequestParam("activityId") String activityId) {
        Command<Object> cmd = new JumpActivityCmd(executionId, activityId);
        managementService.executeCommand(cmd);
        return true;
    }

    @RequestMapping(value = "/bpmn/model/{processDefinitionId}")
    @ResponseBody
    public BpmnModel queryBpmnModel(@PathVariable("processDefinitionId") String processDefinitionId) {
        return repositoryService.getBpmnModel(processDefinitionId);
    }

    @Autowired
    public void setWorkflowProcessDefinitionService(WorkflowProcessDefinitionService workflowProcessDefinitionService) {
        this.workflowProcessDefinitionService = workflowProcessDefinitionService;
    }

    @Autowired
    public void setRepositoryService(RepositoryService repositoryService) {
        this.repositoryService = repositoryService;
    }

    @Autowired
    public void setRuntimeService(RuntimeService runtimeService) {
        this.runtimeService = runtimeService;
    }

    @Autowired
    public void setTraceService(WorkflowTraceService traceService) {
        this.traceService = traceService;
    }

    @Autowired
    public void setTaskService(TaskService taskService) {
        this.taskService = taskService;
    }

}