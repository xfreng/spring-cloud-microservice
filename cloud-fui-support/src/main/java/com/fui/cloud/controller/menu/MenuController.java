package com.fui.cloud.controller.menu;

import com.alibaba.fastjson.JSONObject;
import com.fui.cloud.common.CommonConstants;
import com.fui.cloud.common.ExcelUtils;
import com.fui.cloud.common.FileUtils;
import com.fui.cloud.common.UserUtils;
import com.fui.cloud.controller.AbstractSuperController;
import com.fui.cloud.service.menu.MenuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping(value = "/supervisor/menu")
public class MenuController extends AbstractSuperController {

    @Autowired
    private MenuService menuService;

    @RequestMapping("/index")
    public ModelAndView index() throws Exception {
        ModelAndView mv = new ModelAndView("supervisor/menu/list");
        return init(mv);
    }

    @RequestMapping("/state")
    public String menuState() {
        return "supervisor/menu/state";
    }

    @RequestMapping("/shortcut")
    public ModelAndView shortcut() throws Exception {
        ModelAndView mv = new ModelAndView("supervisor/menu/shortcut_manager");
        return init(mv);
    }

    @RequestMapping("/tree")
    public String menuShortcut() {
        return "supervisor/common/tree";
    }

    @RequestMapping(value = "/loadMenuNodes", produces = CommonConstants.MediaType_APPLICATION_JSON)
    @ResponseBody
    public String loadMenuNodes() {
        String pid = request.getParameter("id");
        List menus = menuService.queryMenuNodeById(pid);
        return success(menus, "treeNodes");
    }

    @RequestMapping(value = "/loadMenuNodePage", produces = CommonConstants.MediaType_APPLICATION_JSON)
    @ResponseBody
    public String loadMenuNode(@RequestParam(value = "pageIndex", defaultValue = "1") int pageNum,
                               @RequestParam(value = "pageSize", defaultValue = "10") int pageSize) {
        String pid = request.getParameter("id");
        JSONObject json = menuService.loadMenuNodePage(pageNum, pageSize, "treeNodes", pid);
        return json.toJSONString();
    }

    @RequestMapping(value = "/queryShortcut", produces = CommonConstants.MediaType_APPLICATION_JSON)
    @ResponseBody
    public String queryShortcut(@RequestParam(value = "pageIndex", defaultValue = "1") int pageNum,
                                @RequestParam(value = "pageSize", defaultValue = "10") int pageSize) {
        JSONObject json = menuService.queryShortcut(pageNum, pageSize, "items", UserUtils.getCurrent().getLong("id"));
        return json.toJSONString();
    }

    @RequestMapping(value = "/saveMenu", produces = CommonConstants.MediaType_APPLICATION_JSON)
    @ResponseBody
    public String saveMenu() {
        String data = request.getParameter("data");
        int count = menuService.saveMenu(data);
        JSONObject json = new JSONObject();
        json.put("count", count);
        return success(json);
    }

    @RequestMapping(value = "/deleteMenu", produces = CommonConstants.MediaType_APPLICATION_JSON)
    @ResponseBody
    public String deleteMenu() {
        String data = request.getParameter("data");
        int count = 0;
        try {
            menuService.deleteMenu(data);
            count = 1;
        } catch (Exception e) {
            logger.error("删除菜单出错：{}", e);
        }
        JSONObject json = new JSONObject();
        json.put("count", count);
        return success(json);
    }

    @RequestMapping(value = "/updateMenu", produces = CommonConstants.MediaType_APPLICATION_JSON)
    @ResponseBody
    public String updateMenu() {
        String data = request.getParameter("data");
        int count = 0;
        try {
            menuService.updateMenu(data);
            count = 1;
        } catch (Exception e) {
            logger.error("删除菜单出错：{}", e);
        }
        JSONObject json = new JSONObject();
        json.put("count", count);
        return success(json);
    }

    @RequestMapping("/export")
    public void export(HttpServletResponse response) throws Exception {
        String templateDir = request.getSession().getServletContext().getRealPath("templates");
        String templateFilename = "系统菜单";
        Map<String, Object> params = new HashMap<String, Object>();
        Map<String, Object> exportInfo = new HashMap<String, Object>();

        List resultData = menuService.queryMenuNodeBySelective(params);
        ExcelUtils zipExcelUtil = ExcelUtils.getInstance(resultData.size(), templateDir);
        zipExcelUtil.setTitleCellBold(true);
        String filePath = zipExcelUtil.exportZipExcel(templateFilename, resultData, exportInfo);
        logger.info("导出文件路径文件路径：{}", filePath);
        File file = new File(filePath);
        FileUtils.exportFile(response, "application/vnd.ms-excel", filePath, file.getName());
        // 导出后删除临时文件
        FileUtils.deleteFile(templateDir + File.separator + "temp", file.getName());
    }

    @RequestMapping(value = "/saveShortcut", produces = CommonConstants.MediaType_APPLICATION_JSON)
    @ResponseBody
    public String saveShortcut() throws Exception {
        String data = request.getParameter("data");
        JSONObject json = new JSONObject();
        int count = menuService.saveShortcut(data);
        json.put("count", count);
        return success(json);
    }

    @RequestMapping(value = "/deleteShortcut", produces = CommonConstants.MediaType_APPLICATION_JSON)
    @ResponseBody
    public String deleteShortcut() {
        String ids = request.getParameter("ids");
        int count = 0;
        try {
            menuService.deleteShortcut(ids);
            count = 1;
        } catch (Exception e) {
            logger.error("删除菜单出错：{}", e);
        }
        JSONObject json = new JSONObject();
        json.put("count", count);
        return success(json);
    }
}
