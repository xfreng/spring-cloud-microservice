package com.fui.cloud.controller.right;

import com.fui.cloud.common.CommonConstants;
import com.fui.cloud.controller.AbstractSuperController;
import com.fui.cloud.service.fui.right.PermissionsService;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import java.util.HashMap;
import java.util.Map;

/**
 * @Title 权限管理
 * @Author sf.xiong on 2019/2/1.
 */
@Controller
@RequestMapping(value = "/supervisor/right")
public class RightsController extends AbstractSuperController {

    @Autowired
    private PermissionsService permissionsService;

    @GetMapping("/index")
    public ModelAndView index() {
        ModelAndView mv = new ModelAndView("supervisor/right/list");
        return init(mv);
    }

    @RequestMapping(value = "/list", produces = CommonConstants.MediaType_APPLICATION_JSON)
    @ResponseBody
    public String getRightsList(@RequestParam(value = "page", defaultValue = "1") int page,
                                @RequestParam(value = "limit", defaultValue = "10") int limit) {
        Map<String, Object> params = new HashMap<>();
        String orgId = request.getParameter("orgId");
        if (org.apache.commons.lang.StringUtils.isNotEmpty(orgId)) {
            params.put("orgId", orgId);
        }
        String userCode = request.getParameter("userCode");
        if (org.apache.commons.lang.StringUtils.isNotEmpty(userCode)) {
            params.put("userCode", userCode);
        }
        String userName = request.getParameter("userName");
        if (StringUtils.isNotEmpty(userName)) {
            params.put("userName", userName);
        }
        return permissionsService.getRightsList(page, limit, params);
    }
}
