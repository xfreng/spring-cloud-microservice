package com.fui.cloud.controller.workflow;

import com.fui.cloud.controller.AbstractSuperController;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

/**
 * @Title web设计器所需jsp配置类
 * @Author sf.xiong on 2017/5/31.
 */
@Controller("designerController")
@RequestMapping("/supervisor/workflow/designer")
public class DesignerController extends AbstractSuperController {

    /**
     * 树型流程编辑器
     *
     * @return ModelAndView
     */
    @RequestMapping("/tree-modeler")
    public ModelAndView treeModel() {
        ModelAndView mv = new ModelAndView("supervisor/workflow/tree-modeler");
        mv.addObject("modelId", request.getParameter("modelId"));
        return mv;
    }
}
