package com.fui.cloud.controller.fui.menu;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.fui.cloud.controller.AbstractSuperController;
import com.fui.cloud.model.fui.Menu;
import com.fui.cloud.service.fui.menu.MenuService;
import com.fui.cloud.service.fui.menu.MenuShortcutService;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.net.URLDecoder;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(value = "/api/fui/menu")
public class MenuController extends AbstractSuperController {

    @Autowired
    private MenuService menuService;
    @Autowired
    private MenuShortcutService menuShortcutService;

    @GetMapping(value = "/query/{userId}/{pid}")
    public List<Map<String, Object>> query(@PathVariable Long userId, @PathVariable String pid) {
        return menuService.query(userId, pid);
    }

    @GetMapping(value = "/queryMenuNodeBySelective/{params}")
    public List<Menu> queryMenuNodeBySelective(@PathVariable String params) throws Exception {
        return menuService.queryMenuNodeBySelective(JSONObject.parseObject(URLDecoder.decode(params, DEFAULT_CHARACTER)));
    }

    @GetMapping(value = "/queryMenuNodeById/{pid}")
    public List<JSONObject> queryMenuNodeById(@PathVariable String pid) {
        return menuService.queryMenuNodeById(pid);
    }

    @GetMapping(value = {"/loadMenuNodePage/{pageNum}/{pageSize}/{key}/{pid}"})
    public JSONObject loadMenuNodePage(@PathVariable Integer pageNum, @PathVariable Integer pageSize, @PathVariable String key, @PathVariable String pid) {
        Map<String, Object> params = new HashMap<String, Object>();
        params.put("id", pid);
        //分页查询
        PageHelper.startPage(pageNum, pageSize);
        List<Menu> list = menuService.queryMenuNodeBySelective(params);
        PageInfo<Menu> pageInfo = createPagination(list);
        String json = success(list, pageInfo.getTotal(), key);
        return JSONObject.parseObject(json);
    }

    @GetMapping(value = "/queryShortcut/{currPage}/{pageSize}/{key}/{userId}")
    public JSONObject queryShortcut(@PathVariable int currPage, @PathVariable int pageSize, @PathVariable String key, @PathVariable Long userId) {
        Map<String, Object> params = new HashMap<String, Object>();
        params.put("userId", userId);
        //分页查询
        PageHelper.startPage(currPage, pageSize);
        List<JSONObject> list = menuShortcutService.queryShortcutBySelective(params);
        PageInfo<JSONObject> pageInfo = createPagination(list);
        String json = success(list, pageInfo.getTotal(), key);
        return JSONObject.parseObject(json);
    }

    @PostMapping(value = "/saveMenu/{info}/{data}")
    public int saveMenu(@PathVariable String info, @PathVariable String data) {
        JSONObject operateInfo = JSONObject.parseObject(info);
        JSONArray columns = JSONArray.parseArray(data);
        return menuService.saveMenu(operateInfo, columns);
    }

    @DeleteMapping(value = "/deleteMenu/{userId}/{data}")
    public int deleteMenu(@PathVariable Long userId, @PathVariable String data) {
        JSONArray columns = JSONArray.parseArray(data);
        return menuService.deleteMenu(userId, columns);
    }

    @PutMapping(value = "/updateMenu/{info}/{data}")
    public int updateMenu(@PathVariable String info, @PathVariable String data) {
        JSONObject operateInfo = JSONObject.parseObject(info);
        JSONArray columns = JSONArray.parseArray(data);
        return menuService.updateMenu(operateInfo, columns);
    }

    @PostMapping(value = "/saveShortcut/{userId}/{data}")
    public int saveShortcut(@PathVariable Long userId, @PathVariable String data) throws Exception {
        JSONArray columns = JSONArray.parseArray(URLDecoder.decode(data, DEFAULT_CHARACTER));
        return menuShortcutService.saveShortcut(userId, columns);
    }

    @DeleteMapping(value = "/deleteShortcut/{data}")
    public int deleteShortcut(@PathVariable String data) {
        JSONArray ids = JSONArray.parseArray(data);
        return menuShortcutService.deleteShortcuts(ids);
    }
}
