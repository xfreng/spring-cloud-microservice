package com.fui.cloud.controller.style;

import com.alibaba.fastjson.JSONObject;
import com.fui.cloud.common.CommonConstants;
import com.fui.cloud.common.UserUtils;
import com.fui.cloud.controller.AbstractSuperController;
import com.fui.cloud.model.fui.Users;
import com.fui.cloud.service.fui.style.StyleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import java.util.HashMap;
import java.util.Map;


@Controller
@RequestMapping(value = "/supervisor/style")
public class StyleController extends AbstractSuperController {

    @Autowired
    private StyleService styleService;

    @RequestMapping("/index")
    public ModelAndView index() {
        ModelAndView mv = new ModelAndView("style/style_manager");
        return init(mv);
    }

    @RequestMapping(value = "/updateMenuTypeAndStyle", produces = CommonConstants.MediaType_APPLICATION_JSON)
    @ResponseBody
    public String updateMenuTypeAndStyle() {
        String style = request.getParameter("pageStyle");
        String menuType = request.getParameter("menuType");
        Users user = UserUtils.getCurrent();
        Map<String, Object> beanMap = new HashMap<>();
        beanMap.put("id", user.getId());
        beanMap.put("style", style);
        beanMap.put("menuType", menuType);
        boolean bool = styleService.updateMenuTypeAndStyleByUserId(JSONObject.toJSONString(beanMap));
        if (bool) {
            UserUtils.updateCurrent(style, menuType);
        }
        JSONObject json = new JSONObject();
        json.put("result", bool ? "1" : "0");
        json.put("url", "/supervisor/" + menuType);
        return json.toJSONString();
    }
}