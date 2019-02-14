package com.fui.cloud.controller.menu;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.fui.cloud.common.CommonConstants;
import com.fui.cloud.common.ExcelUtils;
import com.fui.cloud.common.FileUtils;
import com.fui.cloud.common.UserUtils;
import com.fui.cloud.controller.AbstractSuperController;
import com.fui.cloud.model.fui.Menus;
import com.fui.cloud.service.fui.menu.MenuService;
import com.fui.cloud.service.fui.menu.MenuShortcutService;
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
public class MenusController extends AbstractSuperController {

    @Autowired
    private MenuService menuService;
    @Autowired
    private MenuShortcutService menuShortcutService;

    @RequestMapping("/index")
    public ModelAndView index() {
        ModelAndView mv = new ModelAndView("supervisor/menu/list");
        return init(mv);
    }

    @RequestMapping("/state")
    public String menuState() {
        return "supervisor/menu/state";
    }

    @RequestMapping("/shortcut")
    public ModelAndView shortcut() {
        ModelAndView mv = new ModelAndView("supervisor/menu/shortcut_manager");
        return init(mv);
    }

    @RequestMapping("/tree")
    public String menuShortcut() {
        return "supervisor/common/tree";
    }

    @RequestMapping(value = "/fuiAdminNodes", produces = CommonConstants.MediaType_APPLICATION_JSON)
    @ResponseBody
    public String fuiAdminNodes() {
        String pid = request.getParameter("id");
        JSONObject result = menuService.fuiAdminNodes(pid);
        return result.toJSONString();
    }

    @RequestMapping(value = "/loadMenuNodes", produces = CommonConstants.MediaType_APPLICATION_JSON)
    @ResponseBody
    public String loadMenuNodes() {
        String pid = request.getParameter("id");
        return menuService.queryMenuNodeById(pid);
    }

    @RequestMapping(value = "/loadMenuNodePage", produces = CommonConstants.MediaType_APPLICATION_JSON)
    @ResponseBody
    public String loadMenuNode(@RequestParam(value = "pageIndex", defaultValue = "1") int pageNum,
                               @RequestParam(value = "pageSize", defaultValue = "10") int pageSize) {
        String pid = request.getParameter("id");
        Map<String, Object> params = new HashMap<>();
        params.put("id", pid);
        return menuService.queryMenuNodeBySelective(pageNum, pageSize, params);
    }

    @RequestMapping(value = "/queryShortcut", produces = CommonConstants.MediaType_APPLICATION_JSON)
    @ResponseBody
    public String queryShortcut(@RequestParam(value = "pageIndex", defaultValue = "1") int pageNum,
                                @RequestParam(value = "pageSize", defaultValue = "10") int pageSize) {
        return menuShortcutService.queryShortcutBySelective(pageNum, pageSize);
    }

    @RequestMapping(value = "/saveMenu", produces = CommonConstants.MediaType_APPLICATION_JSON)
    @ResponseBody
    public String saveMenu() {
        String data = request.getParameter("data");
        int count = menuService.saveMenu(JSONArray.parseArray(data, Menus.class));
        JSONObject json = new JSONObject();
        json.put("count", count);
        return json.toJSONString();
    }

    @RequestMapping(value = "/deleteMenu", produces = CommonConstants.MediaType_APPLICATION_JSON)
    @ResponseBody
    public String deleteMenu() {
        String data = request.getParameter("data");
        int count = 0;
        try {
            menuService.deleteMenu(UserUtils.getCurrent().getId(), JSONArray.parseArray(data, Menus.class));
            count = 1;
        } catch (Exception e) {
            logger.error("删除菜单出错：{}", e);
        }
        JSONObject json = new JSONObject();
        json.put("count", count);
        return json.toJSONString();
    }

    @RequestMapping(value = "/updateMenu", produces = CommonConstants.MediaType_APPLICATION_JSON)
    @ResponseBody
    public String updateMenu() {
        String data = request.getParameter("data");
        int count = 0;
        try {
            menuService.updateMenu(JSONArray.parseArray(data, Menus.class));
            count = 1;
        } catch (Exception e) {
            logger.error("更新菜单出错：{}", e);
        }
        JSONObject json = new JSONObject();
        json.put("count", count);
        return json.toJSONString();
    }

    @RequestMapping("/export")
    public void export(HttpServletResponse response) throws Exception {
        String templateDir = request.getSession().getServletContext().getRealPath("templates");
        String templateFilename = "系统菜单";
        Map<String, Object> params = new HashMap<>();
        Map<String, Object> exportInfo = new HashMap<>();

        List resultData = JSONObject.parseObject(menuService.queryMenuNodeBySelective(1, 1000, params)).getJSONArray("treeNodes");
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
    public String saveShortcut() {
        String data = request.getParameter("data");
        JSONObject json = new JSONObject();
        int count = menuService.saveMenu(JSONArray.parseArray(data, Menus.class));
        json.put("count", count);
        return json.toJSONString();
    }

    @RequestMapping(value = "/deleteShortcut", produces = CommonConstants.MediaType_APPLICATION_JSON)
    @ResponseBody
    public String deleteShortcut() {
        String ids = request.getParameter("ids");
        int count = 0;
        try {
            menuShortcutService.deleteShortcuts(JSONArray.parseArray(ids));
            count = 1;
        } catch (Exception e) {
            logger.error("删除收藏出错：{}", e);
        }
        JSONObject json = new JSONObject();
        json.put("count", count);
        return json.toJSONString();
    }
}
