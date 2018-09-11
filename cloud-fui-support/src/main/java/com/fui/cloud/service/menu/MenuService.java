package com.fui.cloud.service.menu;

import com.alibaba.fastjson.JSONObject;
import com.fui.cloud.common.CommonConstants;
import com.fui.cloud.common.DateUtils;
import com.fui.cloud.common.UserUtils;
import com.fui.cloud.service.AbstractSuperService;
import com.fui.cloud.service.remote.menu.MenuRemote;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.net.URLEncoder;
import java.util.List;
import java.util.Map;

/**
 * @Title 菜单关业务类
 * @Author sf.xiong
 * @Date 2017-12-23
 */
@Service("menuService")
public class MenuService extends AbstractSuperService {

    @Autowired
    private MenuRemote menuRemote;

    public List query(String pid) {
        return menuRemote.query(UserUtils.getCurrent().getLong("id"), pid);
    }

    public List queryMenuNodeById(String pid) {
        return menuRemote.queryMenuNodeById(pid);
    }

    public List<JSONObject> queryMenuNodeBySelective(Map<String, Object> params) throws Exception {
        return menuRemote.queryMenuNodeBySelective(URLEncoder.encode(JSONObject.toJSONString(params), CommonConstants.DEFAULT_CHARACTER));
    }

    public JSONObject loadMenuNodePage(Integer pageNum, Integer pageSize, String key, String pid) {
        return menuRemote.loadMenuNodePage(pageNum, pageSize, key, pid);
    }

    public JSONObject queryShortcut(Integer pageNum, Integer pageSize, String key, Long userId) {
        return menuRemote.queryShortcut(pageNum, pageSize, key, userId);
    }

    public int saveMenu(String data) {
        JSONObject info = new JSONObject();
        info.put("recCreateTime", DateUtils.curDateStr14());
        info.put("recCreator", UserUtils.getCurrent().getString("ename"));
        return menuRemote.saveMenu(info.toJSONString(), data);
    }

    public void deleteMenu(String data) {
        menuRemote.deleteMenu(UserUtils.getCurrent().getLong("id"), data);
    }

    public void updateMenu(String data) {
        JSONObject info = new JSONObject();
        info.put("recReviseTime", DateUtils.curDateStr14());
        info.put("recRevisor", UserUtils.getCurrent().getString("ename"));
        menuRemote.updateMenu(info.toJSONString(), data);
    }

    public int saveShortcut(String data) throws Exception {
        return menuRemote.saveShortcut(UserUtils.getCurrent().getLong("id"), URLEncoder.encode(data, CommonConstants.DEFAULT_CHARACTER));
    }

    public void deleteShortcut(String data) {
        menuRemote.deleteShortcut(data);
    }
}
