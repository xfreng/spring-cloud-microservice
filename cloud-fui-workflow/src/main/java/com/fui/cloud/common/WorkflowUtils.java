package com.fui.cloud.common;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.fui.cloud.model.FlowItemModel;
import com.fui.cloud.model.VariableModel;
import org.activiti.bpmn.model.BpmnModel;
import org.activiti.bpmn.model.FlowElement;
import org.activiti.engine.HistoryService;
import org.activiti.engine.RepositoryService;
import org.activiti.engine.RuntimeService;
import org.activiti.engine.history.HistoricTaskInstance;
import org.activiti.engine.history.HistoricVariableInstance;
import org.activiti.engine.impl.RepositoryServiceImpl;
import org.activiti.engine.impl.bpmn.behavior.UserTaskActivityBehavior;
import org.activiti.engine.impl.javax.el.ExpressionFactory;
import org.activiti.engine.impl.javax.el.ValueExpression;
import org.activiti.engine.impl.juel.ExpressionFactoryImpl;
import org.activiti.engine.impl.juel.SimpleContext;
import org.activiti.engine.impl.persistence.entity.ExecutionEntity;
import org.activiti.engine.impl.persistence.entity.ProcessDefinitionEntity;
import org.activiti.engine.impl.pvm.PvmActivity;
import org.activiti.engine.impl.pvm.PvmTransition;
import org.activiti.engine.impl.pvm.process.ActivityImpl;
import org.activiti.engine.impl.task.TaskDefinition;
import org.activiti.engine.repository.ProcessDefinition;
import org.activiti.engine.runtime.ProcessInstance;
import org.activiti.engine.task.Task;
import org.apache.commons.io.FileUtils;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.util.*;

/**
 * @author sf.xiong
 */
public class WorkflowUtils {

    private static Logger logger = LoggerFactory.getLogger(WorkflowUtils.class);

    /**
     * 判断节点类型是否展示到树节点上
     *
     * @param typeId
     * @return 是否展示到树节点上
     */
    public static boolean checkTypeShow(String typeId) {
        boolean bool = false;
        List<String> types = new ArrayList<String>();
        types.add("UserTask");
        types.add("ServiceTask");
        types.add("ScriptTask");
        types.add("BusinessRule");
        types.add("ReceiveTask");
        types.add("ManualTask");
        types.add("MailTask");
        types.add("CamelTask");
        types.add("MuleTask");
        types.add("SubProcess");
        types.add("EventSubProcess");
        types.add("CallActivity");
        for (String type : types) {
            if (type.equals(typeId)) {
                bool = true;
                break;
            }
        }
        return bool;
    }

    /**
     * 转换流程节点类型为中文说明
     *
     * @param type 英文名称
     * @return 翻译后的中文名称
     */
    public static String parseToZhType(String type) {
        Map<String, String> types = new HashMap<String, String>();
        types.put("userTask", "用户任务");
        types.put("serviceTask", "系统任务");
        types.put("startEvent", "开始节点");
        types.put("endEvent", "结束节点");
        types.put("exclusiveGateway", "条件判断节点(系统自动根据条件处理)");
        types.put("inclusiveGateway", "并行处理任务");
        types.put("callActivity", "子流程");
        return types.get(type) == null ? type : types.get(type);
    }

    /**
     * 获取页面传入参数
     *
     * @param vars
     * @return 参数Map对象
     */
    public static Map<String, Object> getVariables(String vars) {
        Map<String, Object> variables = new HashMap<String, Object>();
        List varArray = JSONArray.parseArray(vars);
        for (Object obj : varArray) {
            VariableModel var = JSONObject.parseObject(JSONObject.toJSONString(obj), VariableModel.class);
            variables.putAll(var.getVariableMap());
        }
        return variables;
    }

    /**
     * 导出图片文件到硬盘
     *
     * @return 文件的全路径
     */
    public static String exportDiagramToFile(RepositoryService repositoryService, ProcessDefinition processDefinition,
                                             String exportDir) throws IOException {
        String diagramResourceName = processDefinition.getDiagramResourceName();
        String key = processDefinition.getKey();
        int version = processDefinition.getVersion();
        String diagramPath = "";

        InputStream resourceAsStream = repositoryService.getResourceAsStream(processDefinition.getDeploymentId(),
                diagramResourceName);
        byte[] b = new byte[resourceAsStream.available()];

        @SuppressWarnings("unused")
        int len = -1;
        resourceAsStream.read(b, 0, b.length);

        // create file if not exist
        String diagramDir = exportDir + "/" + key + "/" + version;
        File diagramDirFile = new File(diagramDir);
        if (!diagramDirFile.exists()) {
            diagramDirFile.mkdirs();
        }
        diagramPath = diagramDir + "/" + diagramResourceName;
        File file = new File(diagramPath);

        // 文件存在退出
        if (file.exists()) {
            // 文件大小相同时直接返回否则重新创建文件(可能损坏)
            logger.debug("diagram exist, ignore... : {}", diagramPath);
            return diagramPath;
        } else {
            file.createNewFile();
        }

        logger.debug("export diagram to : {}", diagramPath);

        // wirte bytes to file
        FileUtils.writeByteArrayToFile(file, b, true);
        return diagramPath;
    }

    /**
     * 获取已完成程实例(已执行任务)
     *
     * @param historyService
     * @param processInstanceId
     * @return
     */
    public static List<FlowItemModel> queryHistoryTaskInstance(RepositoryService repositoryService,
                                                               HistoryService historyService, String processInstanceId) {
        return queryHistoryTaskInstance(repositoryService, historyService, processInstanceId, null);
    }

    /**
     * 获取单个历史任务实例对象
     *
     * @param historyService
     * @param processInstanceId
     * @param taskDefinitionKey
     * @return 历史任务实例对象
     */
    public static HistoricTaskInstance queryHistoryTaskInstanceByTaskDefinitionKey(HistoryService historyService,
                                                                                   String processInstanceId, String taskDefinitionKey) {
        String userId = UserSession.getLoginName();
        HistoricTaskInstance historicTaskInstance = historyService.createHistoricTaskInstanceQuery()
                .processInstanceId(processInstanceId).taskAssignee(userId).taskDefinitionKey(taskDefinitionKey)
                .orderByHistoricTaskInstanceEndTime().desc().list().get(0);
        return historicTaskInstance;
    }

    /**
     * 获取已完成程实例(已执行任务)
     *
     * @param repositoryService
     * @param historyService
     * @param processInstanceId
     * @param processTaskDefinitionKey 不为空是返回单个对象（即list中存储一个元素）
     * @return
     */
    public static List<FlowItemModel> queryHistoryTaskInstance(RepositoryService repositoryService,
                                                               HistoryService historyService, String processInstanceId, String processTaskDefinitionKey) {
        List<FlowItemModel> historyPageList = new ArrayList<FlowItemModel>();
        String userId = UserSession.getLoginName();
        List<HistoricTaskInstance> historicTaskInstances = new ArrayList<HistoricTaskInstance>();
        if (StringUtils.isNotEmpty(processTaskDefinitionKey)) {
            historicTaskInstances.add(queryHistoryTaskInstanceByTaskDefinitionKey(historyService, processInstanceId,
                    processTaskDefinitionKey));
        } else {
            historicTaskInstances = historyService.createHistoricTaskInstanceQuery()
                    .processInstanceId(processInstanceId).taskAssignee(userId).orderByHistoricTaskInstanceEndTime()
                    .asc().list();
        }
        for (HistoricTaskInstance historicTaskInstance : historicTaskInstances) {
            String processDefinitionId = historicTaskInstance.getProcessDefinitionId();
            String taskDefinitionKey = historicTaskInstance.getTaskDefinitionKey();
            String description = queryDocumentationByTaskDefinitionKey(repositoryService, processDefinitionId,
                    taskDefinitionKey);
            FlowItemModel flowItemEntity = new FlowItemModel();
            flowItemEntity.setId(taskDefinitionKey);
            flowItemEntity.setTaskId(historicTaskInstance.getId());
            flowItemEntity.setName(historicTaskInstance.getName());
            flowItemEntity.setDescription(description);
            String deleteReason = historicTaskInstance.getDeleteReason();
            if (StringUtils.isEmpty(deleteReason)) {
                flowItemEntity.setStatus("0");
            } else {
                flowItemEntity.setStatus("1");
            }
            Map<String, Object> formProperties = new HashMap<String, Object>();
            List<HistoricVariableInstance> historicVariableInstances = historyService
                    .createHistoricVariableInstanceQuery().processInstanceId(processInstanceId)
                    .taskId(historicTaskInstance.getId()).list();
            for (HistoricVariableInstance historicVariableInstance : historicVariableInstances) {
                formProperties.put(historicVariableInstance.getVariableName(), historicVariableInstance.getValue());
            }
            flowItemEntity.setFormProperties(formProperties);
            historyPageList.add(flowItemEntity);
        }
        return historyPageList;
    }

    /**
     * @param repositoryService
     * @param processDefinitionId
     * @param taskDefinitionKey   model中节点上配置的id
     * @return documentation (model中的文档配置项内容)
     */
    public static String queryDocumentationByTaskDefinitionKey(RepositoryService repositoryService,
                                                               String processDefinitionId, String taskDefinitionKey) {
        BpmnModel bpmnModel = repositoryService.getBpmnModel(processDefinitionId);
        if (bpmnModel != null) {
            Collection<FlowElement> flowElements = bpmnModel.getMainProcess().getFlowElements();
            for (FlowElement flowElement : flowElements) {
                String id = flowElement.getId();
                if (taskDefinitionKey.equals(id)) {
                    String documentation = flowElement.getDocumentation();
                    if (StringUtils.isNotBlank(documentation)) {
                        return documentation;
                    }
                }
            }
        }
        return null;
    }

    /**
     * 获取当前正在运行的节点id
     *
     * @param runtimeService
     * @param processInstanceId
     * @return 正在运行的节点id
     */
    public static String getActiveTaskDefinitionKey(RuntimeService runtimeService, String processInstanceId) {
        // 执行实例
        ExecutionEntity execution = (ExecutionEntity) runtimeService.createProcessInstanceQuery()
                .processInstanceId(processInstanceId).singleResult();
        if (execution == null) {
            return null;
        }
        // 当前实例的执行到哪个节点
        String activitiId = execution.getActivityId();
        return activitiId;
    }

    /**
     * 获取当前执行流程实例(当前执行任务节点)
     *
     * @param repositoryService
     * @param runtimeService
     * @param historyService
     * @param processDefinitionId
     * @param processInstanceId
     * @return 当前执行任务节点
     */
    public static FlowItemModel getActiveTaskInstance(RepositoryService repositoryService, RuntimeService runtimeService,
                                                      HistoryService historyService, String processDefinitionId, String processInstanceId) {
        return getActiveTaskInstance(repositoryService, runtimeService, historyService, processDefinitionId,
                processInstanceId, false);
    }

    /**
     * 获取当前执行流程实例(当前执行任务节点)
     *
     * @param repositoryService
     * @param runtimeService
     * @param processDefinitionId
     * @param processInstanceId
     * @param isCircle            是否是循环节点
     * @return 当前执行任务节点
     */
    public static FlowItemModel getActiveTaskInstance(RepositoryService repositoryService, RuntimeService runtimeService,
                                                      HistoryService historyService, String processDefinitionId, String processInstanceId, boolean isCircle) {
        ProcessDefinitionEntity definitionEntity = (ProcessDefinitionEntity) ((RepositoryServiceImpl) repositoryService)
                .getDeployedProcessDefinition(processDefinitionId);
        // 当前实例的执行到哪个节点
        String activitiId = getActiveTaskDefinitionKey(runtimeService, processInstanceId);
        // 获得当前任务的所有节点
        List<ActivityImpl> activitiList = definitionEntity.getActivities();
        for (ActivityImpl activityImpl : activitiList) {
            String id = activityImpl.getId();
            String name = (String) activityImpl.getProperty("name");
            String description = queryDocumentationByTaskDefinitionKey(repositoryService, processDefinitionId, id);
            if (id.equals(activitiId)) {
                HistoricTaskInstance historicTaskInstance = queryHistoryTaskInstanceByTaskDefinitionKey(historyService,
                        processInstanceId, id);
                FlowItemModel flowItemEntity = null;
                if (historicTaskInstance != null && !isCircle) {
                    List<FlowItemModel> flowItemEntityList = queryHistoryTaskInstance(repositoryService, historyService,
                            processInstanceId, activitiId);
                    flowItemEntity = flowItemEntityList.get(0);
                } else {
                    flowItemEntity = new FlowItemModel();
                    flowItemEntity.setId(activitiId);
                    if (historicTaskInstance != null) {
                        flowItemEntity.setTaskId(historicTaskInstance.getId());
                    }
                    flowItemEntity.setName(StringUtils.isNotEmpty(name) ? name : "");
                    flowItemEntity.setStatus("0");
                    flowItemEntity.setDescription(description);
                }
                return flowItemEntity;
            }
        }
        return null;
    }

    /**
     * 根据实例编号查找下一个任务节点信息
     *
     * @param repositoryService
     * @param runtimeService
     * @param task
     * @param processInstanceId
     * @return 下一个任务节点信息
     */
    public static FlowItemModel queryNextTask(RepositoryService repositoryService, RuntimeService runtimeService, Task task,
                                              String processInstanceId) {
        TaskDefinition taskDefinition = nextTaskDefinition(repositoryService, runtimeService, task, processInstanceId);
        FlowItemModel flowItemEntity = null;
        if (taskDefinition != null) {
            flowItemEntity = new FlowItemModel();
            String id = taskDefinition.getKey();
            String name = taskDefinition.getNameExpression().getExpressionText();
            String description = taskDefinition.getDescriptionExpression().getExpressionText();
            flowItemEntity.setId(id);
            flowItemEntity.setName(name);
            flowItemEntity.setStatus("0");
            flowItemEntity.setDescription(description);
        }
        return flowItemEntity;
    }

    /**
     * 根据实例编号查找下一个任务节点
     *
     * @param repositoryService
     * @param runtimeService
     * @param task
     * @param processInstanceId
     * @return 下一个任务节点信息
     */
    private static TaskDefinition nextTaskDefinition(RepositoryService repositoryService, RuntimeService runtimeService,
                                                     Task task, String processInstanceId) {
        // 获取流程定义id
        String processDefinitionId = task.getProcessDefinitionId();
        ProcessDefinitionEntity processDefinitionEntity = (ProcessDefinitionEntity) ((RepositoryServiceImpl) repositoryService)
                .getDeployedProcessDefinition(processDefinitionId);
        // 当前实例的执行到哪个节点
        String activitiId = getActiveTaskDefinitionKey(runtimeService, processInstanceId);
        // 获得当前任务的所有节点
        List<ActivityImpl> activitiList = processDefinitionEntity.getActivities();
        int size = activitiList.size();
        for (int i = 0; i < size; i++) {
            ActivityImpl activityImpl = activitiList.get(i);
            String id = activityImpl.getId();
            if (id.equals(activitiId)) {
                int j = (i + 1 == (size - 1)) ? size - 1 : (i + 1);
                ActivityImpl nextActivityImpl = activitiList.get(j);
                return nextTaskDefinition(nextActivityImpl, nextActivityImpl.getId(),
                        runtimeService.getVariables(task.getExecutionId()));
            }
        }
        return null;
    }

    /**
     * 下一个任务节点
     *
     * @param activityImpl
     * @param activityId
     * @param param
     * @return 下一个任务节点信息
     */
    private static TaskDefinition nextTaskDefinition(ActivityImpl activityImpl, String activityId,
                                                     Map<String, Object> param) {
        if ("userTask".equals(activityImpl.getProperty("type")) && !activityId.equals(activityImpl.getId())) {
            TaskDefinition taskDefinition = ((UserTaskActivityBehavior) activityImpl.getActivityBehavior())
                    .getTaskDefinition();
            return taskDefinition;
        } else {
            List<PvmTransition> outTransitions = activityImpl.getOutgoingTransitions();
            List<PvmTransition> outTransitionsTemp = null;
            for (PvmTransition tr : outTransitions) {
                PvmActivity ac = tr.getDestination(); // 获取线路的终点节点
                if ("exclusiveGateway".equals(ac.getProperty("type"))) {
                    outTransitionsTemp = ac.getOutgoingTransitions();
                    if (outTransitionsTemp.size() == 1) {
                        return nextTaskDefinition((ActivityImpl) outTransitionsTemp.get(0).getDestination(), activityId,
                                param);
                    } else if (outTransitionsTemp.size() > 1) {
                        for (PvmTransition tr1 : outTransitionsTemp) {
                            String expression = (String) tr1.getProperty("conditionText");
                            Object value = getExpressionValue(param, expression);
                            logger.info("value:" + value);
                        }
                    }
                } else if ("userTask".equals(ac.getProperty("type"))) {
                    return ((UserTaskActivityBehavior) ((ActivityImpl) ac).getActivityBehavior()).getTaskDefinition();
                } else {
                    logger.debug((String) ac.getProperty("type"));
                }
            }
            return null;
        }
    }

    /**
     * 判断是否是循环任务节点
     *
     * @param repositoryService
     * @param runtimeService
     * @param task
     * @param param
     * @param paramCondition
     * @return boolean
     */
    public static boolean checkCircleByTaskId(RepositoryService repositoryService, RuntimeService runtimeService,
                                              Task task, Map<String, Object> param, String paramCondition) {
        String processDefinitionId = task.getProcessDefinitionId();
        ProcessDefinitionEntity processDefinitionEntity = (ProcessDefinitionEntity) repositoryService
                .getProcessDefinition(processDefinitionId);
        String processInstanceId = task.getProcessInstanceId();
        ProcessInstance pi = runtimeService.createProcessInstanceQuery().processInstanceId(processInstanceId)
                .singleResult();
        ActivityImpl activityImpl = processDefinitionEntity.findActivity(pi.getActivityId());
        List<PvmTransition> pvmList = activityImpl.getOutgoingTransitions();
        List<PvmTransition> outTransitionsTemp = null;
        if (pvmList != null && pvmList.size() > 0) {
            for (PvmTransition pvm : pvmList) {
                PvmActivity ac = pvm.getDestination(); // 获取线路的终点节点
                outTransitionsTemp = ac.getOutgoingTransitions();
                for (PvmTransition tr : outTransitionsTemp) {
                    String conditionText = (String) tr.getProperty("conditionText");
                    if (paramCondition.equals(conditionText)) {
                        return Boolean.valueOf(String.valueOf(getExpressionValue(param, paramCondition)));
                    }
                }
            }
        }
        return false;
    }

    /**
     * 获取el表达式的值
     *
     * @param param      map的key就是变量名,value是对应的值
     * @param expression 完整的el表达式
     * @return el表达式的值
     */
    public static Object getExpressionValue(Map<String, Object> param, String expression) {
        ExpressionFactory factory = new ExpressionFactoryImpl();
        SimpleContext context = new SimpleContext();
        for (String key : param.keySet()) {
            context.setVariable(key, factory.createValueExpression(param.get(key), Object.class));
        }
        ValueExpression valueExpression = factory.createValueExpression(context, expression, Object.class);
        return valueExpression.getValue(context);
    }
}
