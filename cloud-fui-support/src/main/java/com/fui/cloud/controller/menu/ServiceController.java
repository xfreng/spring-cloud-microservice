package com.fui.cloud.controller.menu;

import com.fui.cloud.common.CommonConstants;
import com.fui.cloud.controller.AbstractSuperController;
import com.fui.cloud.core.FrameworkInfo;
import com.fui.cloud.core.ei.*;
import com.fui.cloud.core.ei.json.EiInfo2Json;
import com.fui.cloud.core.ei.json.Json2EiInfo;
import com.fui.cloud.core.ep.QueryMap;
import com.fui.cloud.service.menu.MenuService;
import com.fui.cloud.service.role.RolesService;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping(value = "/supervisor")
public class ServiceController extends AbstractSuperController {

    private EiBlockMeta eiMetadata;
    @Autowired
    private MenuService menuService;
    @Autowired
    private RolesService roleService;

    @RequestMapping("/EiService")
    public void doPost(HttpServletResponse response) throws IOException {
        try {
            request.setCharacterEncoding(CommonConstants.DEFAULT_CHARACTER);
            response.setContentType(CommonConstants.MediaType_APPLICATION_JSON);

            String eiInfoStr = request.getParameter("eiinfo");

            EiInfo inInfo = new EiInfo();

            if (eiInfoStr != null) {
                inInfo = Json2EiInfo.parse(eiInfoStr);
            }

            EiInfo outInfo = query(inInfo);

            response.getWriter().write(EiInfo2Json.toJsonString(outInfo));
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
            String ret = e.getCause().toString();
            response.getWriter().write(ret);
        }
    }

    protected EiInfo query(EiInfo inInfo) {
        QueryMap queryInfo = QueryMap.getQueryMap(inInfo);
        String p = (String) queryInfo.get("node");
        List<Map<String, Object>> children = new ArrayList<Map<String, Object>>();
        if (p == null) {
            p = CommonConstants.TREE_ROOT_NAME;
        }
        if (CommonConstants.TREE_ROOT_NAME.equals(p))
            children = getTopNodes();
        else {
            children = getChildNodes(p);
        }

        EiInfo outInfo = new EiInfo();
        EiBlock block = outInfo.addBlock(p);
        block.setBlockMeta(initMetaData());
        block.setRows(children);
        return outInfo;
    }

    protected EiBlockMeta initMetaData() {
        if (this.eiMetadata == null) {
            this.eiMetadata = new EiBlockMeta();
            EiColumn eiColumn = new EiColumn("label");
            eiColumn.setDescName("label");
            eiColumn.setNullable(false);
            eiColumn.setPrimaryKey(false);
            this.eiMetadata.addMeta(eiColumn);

            eiColumn = new EiColumn("text");
            eiColumn.setDescName("text");
            eiColumn.setNullable(false);
            eiColumn.setPrimaryKey(false);
            this.eiMetadata.addMeta(eiColumn);

            eiColumn = new EiColumn("imagePath");
            eiColumn.setDescName("imagePath");
            eiColumn.setNullable(false);
            eiColumn.setPrimaryKey(false);
            this.eiMetadata.addMeta(eiColumn);

            eiColumn = new EiColumn("leaf");
            eiColumn.setDescName("leaf");
            eiColumn.setType(EiConstant.columnTypeNumber);
            eiColumn.setNullable(false);
            eiColumn.setPrimaryKey(false);
            this.eiMetadata.addMeta(eiColumn);

            eiColumn = new EiColumn("url");
            eiColumn.setDescName("url");
            eiColumn.setNullable(false);
            eiColumn.setPrimaryKey(false);
            this.eiMetadata.addMeta(eiColumn);
        }
        return this.eiMetadata;
    }

    protected List<Map<String, Object>> getTopNodes() {
        String project = FrameworkInfo.getProjectEname();
        List<Map<String, Object>> projectNodes = getChildNodes(project);
        List<Map<String, Object>> rootNodes = getChildNodes("");

        List<Map<String, Object>> all = new ArrayList<Map<String, Object>>();
        all.addAll(projectNodes);
        for (Map<String, Object> rootNode : rootNodes) {
            Object id = rootNode.get("id");
            if (id != null && checkUserRights(id.toString())) {
                all.add(rootNode);
            }
        }
        return all;
    }

    protected List<Map<String, Object>> getChildNodes(String p) {
        String node = p;
        if ((!StringUtils.isNotEmpty(node)) || (node.equals(CommonConstants.TREE_ROOT_NAME))) {
            node = CommonConstants.TREE_ROOT_ID;
        }
        List<Map<String, Object>> childNodes = menuService.query(node);

        List<Map<String, Object>> all = new ArrayList<Map<String, Object>>();
        for (Map<String, Object> childNode : childNodes) {
            Object id = childNode.get("id");
            if (id != null && checkUserRights(id.toString())) {
                all.add(childNode);
            }
        }
        return all;
    }

    protected boolean checkUserRights(String id) {
        boolean bool = false;
        List<String> rights = roleService.getUserRights();
        for (String right : rights) {
            String[] args = right.split(",");
            for (String rightId : args) {
                if (rightId.equals(id)) {
                    bool = true;
                    break;
                }
            }
        }
        return bool;
    }
}
