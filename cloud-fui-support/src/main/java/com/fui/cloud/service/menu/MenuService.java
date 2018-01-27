package com.fui.cloud.service.menu;

import com.alibaba.fastjson.JSONObject;
import com.fui.cloud.common.CommonConstants;
import com.fui.cloud.common.DateUtils;
import com.fui.cloud.common.UserUtils;
import com.fui.cloud.enums.AppId;
import com.fui.cloud.service.AbstractSuperService;
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

    public List query(String pid) {
        return getResult(AppId.getName(1), "/menu/query/{userId}/{pid}", List.class, UserUtils.getCurrent().getLong("id"), pid);
    }

    public List queryMenuNodeById(String pid) {
        return getResult(AppId.getName(1), "/menu/queryMenuNodeById/{pid}", List.class, pid);
    }

    public List queryMenuNodeBySelective(Map<String, Object> params) throws Exception {
        return getResult(AppId.getName(1), "/menu/queryMenuNodeBySelective/{params}", List.class, URLEncoder.encode(JSONObject.toJSONString(params), CommonConstants.DEFAULT_CHARACTER));
    }

    public JSONObject loadMenuNodePage(Integer pageNum, Integer pageSize, String key, String pid) {
        return getResult(AppId.getName(1), "/menu/loadMenuNodePage/{pageNum}/{pageSize}/{key}/{pid}", JSONObject.class, pageNum, pageSize, key, pid);
    }

    public JSONObject queryShortcut(Integer pageNum, Integer pageSize, String key, Long userId) {
        return getResult(AppId.getName(1), "/menu/queryShortcut/{pageNum}/{pageSize}/{key}/{pid}", JSONObject.class, pageNum, pageSize, key, userId);
    }

    public int saveMenu(String data) {
        JSONObject info = new JSONObject();
        info.put("recCreateTime", DateUtils.curDateStr14());
        info.put("recCreator", UserUtils.getCurrent().getString("ename"));
        return postResult(AppId.getName(1), "/menu/saveMenu/{info}/{data}", Integer.class, info.toJSONString(), data);
    }

    public void deleteMenu(String data) {
        deleteResult(AppId.getName(1), "/menu/deleteMenu/{userId}/{data}", UserUtils.getCurrent().getLong("id"), data);
    }

    public void updateMenu(String data) {
        JSONObject info = new JSONObject();
        info.put("recReviseTime", DateUtils.curDateStr14());
        info.put("recRevisor", UserUtils.getCurrent().getString("ename"));
        putResult(AppId.getName(1), "/menu/updateMenu/{info}/{data}", info.toJSONString(), data);
    }

    public int saveShortcut(String data) throws Exception {
        return postResult(AppId.getName(1), "/menu/saveShortcut/{userId}/{data}", Integer.class, UserUtils.getCurrent().getLong("id"), URLEncoder.encode(data, CommonConstants.DEFAULT_CHARACTER));
    }

    public void deleteShortcut(String data) {
        deleteResult(AppId.getName(1), "/menu/deleteShortcut/{data}", data);
    }
}
