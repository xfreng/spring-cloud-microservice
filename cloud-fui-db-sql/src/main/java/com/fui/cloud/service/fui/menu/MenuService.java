package com.fui.cloud.service.fui.menu;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.fui.cloud.dao.fui.menu.MenuMapper;
import com.fui.cloud.model.fui.Menu;
import com.fui.cloud.service.fui.AbstractSuperImplService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service("menuService")
@Transactional
public class MenuService extends AbstractSuperImplService<Menu, Long> {
    @Autowired
    private MenuMapper menuMapper;

    @PostConstruct
    public void initMapper() {
        this.baseMapper = menuMapper;
    }

    /**
     * @param id
     * @return List<JSONObject>
     */
    public List<JSONObject> queryMenuNodeById(String id) {
        List<JSONObject> menus = new ArrayList<>();
        Map<String, Object> param = new HashMap<>();
        param.put("id", id);
        List<Menu> menuTrees = menuMapper.queryMenuNodeBySelective(param);
        List<JSONObject> menuList = JSONArray.parseArray(JSONArray.toJSONString(menuTrees), JSONObject.class);
        for (JSONObject treeNode : menuList) {
            param.put("id", treeNode.getString("id"));
            List<Menu> nodes = menuMapper.queryMenuNodeBySelective(param);
            if (nodes.size() > 0) {
                treeNode.put("isLeaf", false);
                treeNode.put("expanded", false);
            }
            menus.add(treeNode);
        }
        return menus;
    }

    /**
     * @param param
     * @return List<Menu>
     */
    public List<Menu> queryMenuNodeBySelective(Map<String, Object> param) {
        return menuMapper.queryMenuNodeBySelective(param);
    }

    /**
     * 查询菜单信息
     *
     * @param userId
     * @param id
     * @return list
     */
    public List<Map<String, Object>> query(Long userId, String id) {
        return menuMapper.query(userId, id);
    }

    /**
     * @param id
     * @param rootId
     * @return List<Menu>
     */
    public List<Menu> queryMenu(String id, String rootId) {
        return getMenuNodeById(id, rootId);
    }

    /**
     * 递归获取子菜单
     *
     * @param id
     * @param rootId
     * @return List<Menu>
     */
    private List<Menu> getMenuNodeById(String id, String rootId) {
        List<Menu> roots = getChildNodes(id, rootId);
        List<Menu> menus = new ArrayList<>(roots);
        for (Menu menuTree : roots) {
            List<Menu> nodes = getChildNodes(menuTree.getId(), rootId);
            if (nodes.size() > 0) {
                menus.addAll(nodes);
                for (Menu node : nodes) {
                    menus.addAll(getMenuNodeById(node.getId(), rootId));
                }
            }
        }
        logger.info("递归处理完成...");
        return menus;
    }

    /**
     * 获取子菜单
     *
     * @param id
     * @param rootId
     * @return List<Menu>
     */
    private List<Menu> getChildNodes(String id, String rootId) {
        if (StringUtils.isEmpty(id)) {
            id = rootId;
        }
        Map<String, Object> param = new HashMap<>();
        param.put("id", id);
        return menuMapper.queryMenuNodeBySelective(param);
    }

    /**
     * 保存菜单信息
     *
     * @param info
     * @param columns
     * @return int
     */
    public int saveMenu(JSONObject info, List<JSONObject> columns) {
        int result = 0;
        try {
            for (JSONObject column : columns) {
                Menu menuTree = JSONObject.parseObject(column.toJSONString(), Menu.class);
                menuTree.setId(column.getString("id"));
                menuTree.setRecCreateTime(info.getString("recCreateTime"));
                menuTree.setRecCreator(info.getString("recCreator"));
                result = menuMapper.insertMenuNode(menuTree);
            }
        } catch (Exception e) {
            logger.error("保存菜单出错 {} ", e);
        }
        return result;
    }

    /**
     * 删除菜单信息
     *
     * @param userId
     * @param columns
     * @return int
     */
    public int deleteMenu(Long userId, List<JSONObject> columns) {
        int result = 0;
        try {
            for (JSONObject objectTree : columns) {
                Menu menuTree = JSONObject.parseObject(objectTree.toJSONString(), Menu.class);
                menuTree.setId(objectTree.getString("id"));
                if (userId != null) {
                    int menuChildCount = query(userId, menuTree.getId()).size();
                    if (menuChildCount > 0) {
                        break;
                    }
                }
                result = menuMapper.deleteMenuNodeById(menuTree);
            }
        } catch (Exception e) {
            logger.error("删除菜单出错 {} ", e);
        }
        return result;
    }

    /**
     * 更新菜单信息
     *
     * @param info
     * @param columns
     * @return int
     */
    public int updateMenu(JSONObject info, List<JSONObject> columns) {
        int result = 0;
        try {
            for (JSONObject objectTree : columns) {
                Menu menuTree = JSONObject.parseObject(objectTree.toJSONString(), Menu.class);
                menuTree.setId(objectTree.getString("id"));
                menuTree.setRecReviseTime(info.getString("recReviseTime"));
                menuTree.setRecRevisor(info.getString("recRevisor"));
                result = menuMapper.updateMenuNodeById(menuTree);
            }
        } catch (Exception e) {
            logger.error("更新菜单出错 {} ", e);
        }
        return result;
    }
}
