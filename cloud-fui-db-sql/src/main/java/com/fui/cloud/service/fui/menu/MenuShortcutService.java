package com.fui.cloud.service.fui.menu;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.fui.cloud.dao.fui.menu.MenuShortcutMapper;
import com.fui.cloud.model.fui.MenuShortcut;
import com.fui.cloud.service.fui.AbstractSuperImplService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.PostConstruct;
import java.util.List;
import java.util.Map;

@Service("menuShortcutService")
@Transactional
public class MenuShortcutService extends AbstractSuperImplService<MenuShortcut, Long> {
    @Autowired
    private MenuShortcutMapper menuShortcutMapper;

    @PostConstruct
    public void initMapper() {
        this.baseMapper = menuShortcutMapper;
    }

    /**
     * @param param
     * @return
     */
    public List<JSONObject> queryShortcutBySelective(Map<String, Object> param) {
        return menuShortcutMapper.queryShortcutBySelective(param);
    }

    /**
     * 保存收藏
     *
     * @param columnsList
     * @return
     */
    public int saveShortcut(Long userId, JSONArray columnsList) {
        int result = 0;
        try {
            for (Object item : columnsList) {
                String jsonString = JSONObject.toJSONString(item);
                JSONObject jsonObject = JSONObject.parseObject(jsonString);
                MenuShortcut menuShortcut = JSONObject.parseObject(jsonString, MenuShortcut.class);
                menuShortcut.setUserId(userId);
                String state = jsonObject.getString("_state");
                if ("added".equals(state)) {
                    result = menuShortcutMapper.insert(menuShortcut);
                } else if ("modified".equals(state)) {
                    result = menuShortcutMapper.updateByPrimaryKeySelective(menuShortcut);
                }
            }
        } catch (Exception e) {
            logger.error("保存出错：{}", e);
        }
        return result;
    }

    /**
     * 批量删除收藏
     *
     * @param ids
     * @return
     */
    public int deleteShortcuts(JSONArray ids) {
        int result = 0;
        try {
            for (Object id : ids) {
                result = menuShortcutMapper.deleteByPrimaryKey(Long.valueOf(String.valueOf(id)));
            }
        } catch (Exception e) {
            logger.error("删除出错：{}", e);
        }
        return result;
    }
}
