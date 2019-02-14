package com.fui.cloud.service.fui.menu;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.fui.cloud.common.UserUtils;
import com.fui.cloud.dao.fui.menu.MenuShortcutsMapper;
import com.fui.cloud.model.fui.MenuShortcuts;
import com.fui.cloud.service.fui.AbstractSuperImplService;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.PostConstruct;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service("menuShortcutService")
@Transactional
public class MenuShortcutService extends AbstractSuperImplService<MenuShortcuts, Long> {

    @Autowired
    private MenuShortcutsMapper menuShortcutsMapper;

    @PostConstruct
    public void initMapper() {
        this.baseMapper = menuShortcutsMapper;
    }

    /**
     * @param page
     * @param limit
     * @return
     */
    public String queryShortcutBySelective(int page, int limit) {
        Map<String, Object> params = new HashMap<>();
        params.put("userId", UserUtils.getCurrent().getId());
        //分页查询
        PageHelper.startPage(page, limit);
        List list = menuShortcutsMapper.queryShortcutBySelective(params);
        PageInfo pageInfo = createPagination(list);
        return success(list, pageInfo.getTotal(), "items");
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
                MenuShortcuts menuShortcuts = JSONObject.parseObject(jsonString, MenuShortcuts.class);
                menuShortcuts.setUserId(userId);
                String state = jsonObject.getString("_state");
                if ("added".equals(state)) {
                    result = menuShortcutsMapper.insert(menuShortcuts);
                } else if ("modified".equals(state)) {
                    result = menuShortcutsMapper.updateByPrimaryKeySelective(menuShortcuts);
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
                result = menuShortcutsMapper.deleteByPrimaryKey(Long.valueOf(String.valueOf(id)));
            }
        } catch (Exception e) {
            logger.error("删除出错：{}", e);
        }
        return result;
    }
}
