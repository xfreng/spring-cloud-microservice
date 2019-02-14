package com.fui.cloud.service.fui.menu;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.fui.cloud.common.DateUtils;
import com.fui.cloud.common.UserUtils;
import com.fui.cloud.dao.fui.menu.MenusMapper;
import com.fui.cloud.model.fui.Menus;
import com.fui.cloud.service.fui.AbstractSuperImplService;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
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
public class MenuService extends AbstractSuperImplService<Menus, Long> {

    @Autowired
    private MenusMapper menusMapper;

    @PostConstruct
    public void initMapper() {
        this.baseMapper = menusMapper;
    }

    public JSONObject fuiAdminNodes(String id) {
        JSONObject json = new JSONObject();
        List menus = JSONObject.parseObject(queryMenuNodeById(id)).getJSONArray("treeNodes");
        StringBuilder html = new StringBuilder("<li data-name='home' class='layui-nav-item'>");
        html.append("<a href='javascript:;' lay-tips='系统监控' lay-direction='2'>");
        html.append("<i class='layui-icon layui-icon-app'></i>");
        html.append("<cite>系统监控</cite>");
        html.append("</a>");
        html.append("<dl class='layui-nav-child'>");
        html.append("<dd data-name='console'>");
        html.append("<a lay-href='home/console.html'>控制台</a>");
        html.append("</dd>");
        html.append("</dl>");
        html.append("</li>");
        for (Object menu : menus) {
            JSONObject item = JSONObject.parseObject(JSONObject.toJSONString(menu));
            String name = item.getString("id");
            String text = item.getString("text");
            String image = item.getString("image");
            html.append("<li data-name='").append(name).append("' class='layui-nav-item'>");
            html.append("<a href='javascript:;' lay-tips='").append(text).append("' lay-direction='2'>");
            if (StringUtils.isNotBlank(image)) {
                html.append("<i class='layui-icon ").append(image).append("'></i>");
            }
            html.append("<cite>").append(text).append("</cite>");
            html.append("</a>");
            html.append(appendChildNodes(name));
            html.append("</li>");
        }
        json.put("html", html);
        return json;
    }

    private StringBuilder appendChildNodes(String id) {
        StringBuilder html = new StringBuilder();
        List menus = JSONObject.parseObject(queryMenuNodeById(id)).getJSONArray("treeNodes");
        for (Object menu : menus) {
            JSONObject item = JSONObject.parseObject(JSONObject.toJSONString(menu));
            String name = item.getString("id");
            String url = item.getString("url");
            String text = item.getString("text");
            String param = item.getString("param");
            html.append("<dl class='layui-nav-child'>");
            html.append("<dd ").append(param).append(" data-name='").append(name).append("'>");
            if (StringUtils.isNotBlank(url)) {
                html.append("<a lay-href='").append(url).append("'>").append(text).append("</a>");
            } else {
                html.append("<a href='javascript:;'>").append(text).append("</a>");
            }
            html.append(appendChildNodes(name));
            html.append("</dd>");
            html.append("</dl>");
        }
        return html;
    }

    /**
     * @param id
     * @return List<JSONObject>
     */
    public String queryMenuNodeById(String id) {
        List menus = new ArrayList();
        Map<String, Object> param = new HashMap<>();
        param.put("id", id);
        List<Menus> menusTrees = menusMapper.queryMenuNodeBySelective(param);
        List<JSONObject> menuList = JSONArray.parseArray(JSONArray.toJSONString(menusTrees), JSONObject.class);
        for (JSONObject treeNode : menuList) {
            param.put("id", treeNode.getString("id"));
            List<Menus> nodes = menusMapper.queryMenuNodeBySelective(param);
            if (nodes.size() > 0) {
                treeNode.put("isLeaf", false);
                treeNode.put("expanded", false);
            }
            menus.add(treeNode);
        }
        return success(menus, "treeNodes");
    }

    /**
     * @param param
     * @return List<Menus>
     */
    public String queryMenuNodeBySelective(int page, int limit, Map<String, Object> param) {
        //分页查询
        PageHelper.startPage(page, limit);
        List<Menus> list = menusMapper.queryMenuNodeBySelective(param);
        PageInfo<Menus> pageInfo = createPagination(list);
        return success(list, pageInfo.getTotal(), "treeNodes");
    }

    /**
     * 查询菜单信息
     *
     * @param userId
     * @param id
     * @return list
     */
    public List<Map<String, Object>> query(Long userId, String id) {
        return menusMapper.query(userId, id);
    }

    /**
     * @param id
     * @param rootId
     * @return List<Menus>
     */
    public List<Menus> queryMenu(String id, String rootId) {
        return getMenuNodeById(id, rootId);
    }

    /**
     * 递归获取子菜单
     *
     * @param id
     * @param rootId
     * @return List<Menus>
     */
    private List<Menus> getMenuNodeById(String id, String rootId) {
        List<Menus> roots = getChildNodes(id, rootId);
        List<Menus> menus = new ArrayList<>(roots);
        for (Menus menusTree : roots) {
            List<Menus> nodes = getChildNodes(menusTree.getId(), rootId);
            if (nodes.size() > 0) {
                menus.addAll(nodes);
                for (Menus node : nodes) {
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
     * @return List<Menus>
     */
    private List<Menus> getChildNodes(String id, String rootId) {
        if (StringUtils.isEmpty(id)) {
            id = rootId;
        }
        Map<String, Object> param = new HashMap<>();
        param.put("id", id);
        return menusMapper.queryMenuNodeBySelective(param);
    }

    /**
     * 保存菜单信息
     *
     * @param columns
     * @return int
     */
    public int saveMenu(List<Menus> columns) {
        int result = 0;
        try {
            for (Menus menus : columns) {
                menus.setRecCreateTime(DateUtils.curDateStr14());
                menus.setRecCreator(UserUtils.getCurrent().getEname());
                result = menusMapper.insertMenuNode(menus);
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
    public int deleteMenu(Long userId, List<Menus> columns) {
        int result = 0;
        try {
            for (Menus menu : columns) {
                if (userId != null) {
                    int menuChildCount = query(userId, menu.getId()).size();
                    if (menuChildCount > 0) {
                        break;
                    }
                }
                result = menusMapper.deleteMenuNodeById(menu);
            }
        } catch (Exception e) {
            logger.error("删除菜单出错 {} ", e);
        }
        return result;
    }

    /**
     * 更新菜单信息
     *
     * @param columns
     * @return int
     */
    public int updateMenu(List<Menus> columns) {
        int result = 0;
        try {
            for (Menus menu : columns) {
                menu.setRecReviseTime(DateUtils.curDateStr14());
                menu.setRecRevisor(UserUtils.getCurrent().getEname());
                result = menusMapper.updateMenuNodeById(menu);
            }
        } catch (Exception e) {
            logger.error("更新菜单出错 {} ", e);
        }
        return result;
    }
}
