package com.fui.cloud.controller.workflow;

import com.alibaba.fastjson.JSONObject;
import com.fui.cloud.common.CommonConstants;
import com.fui.cloud.controller.AbstractSuperController;
import org.activiti.engine.RepositoryService;
import org.activiti.engine.repository.Model;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

@Controller("validateController")
@RequestMapping("/supervisor/workflow")
public class ValidateController extends AbstractSuperController {

    @Autowired
    private RepositoryService repositoryService;

    @RequestMapping(value = "/checkModelKey", produces = CommonConstants.MediaType_APPLICATION_JSON)
    @ResponseStatus(HttpStatus.OK)
    @ResponseBody
    public String checkModelByKey() {
        String modelKey = request.getParameter("key");
        Model model = repositoryService.createModelQuery().modelKey(modelKey).singleResult();
        JSONObject data = new JSONObject();
        if (model != null) {
            data.put("state", 1);
        } else {
            data.put("state", 0);
        }
        return data.toJSONString();
    }
}
