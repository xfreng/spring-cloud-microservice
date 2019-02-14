package com.fui.cloud.core.ei.json;

import com.fui.cloud.core.ei.EiBlock;
import com.fui.cloud.core.ei.EiBlockMeta;
import com.fui.cloud.core.ei.EiColumn;
import com.fui.cloud.core.ei.EiInfo;
import net.sf.json.JSONArray;
import net.sf.json.JSONNull;
import net.sf.json.JSONObject;
import org.apache.commons.beanutils.DynaBean;
import org.apache.commons.beanutils.DynaProperty;

import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;


public class Json2EiInfo {
    public Json2EiInfo() {
    }

    public static EiInfo parse(String jsonStr) {
        JSONObject jsonObj = JSONObject.fromObject(jsonStr);
        if (jsonObj.isEmpty()) {
            return null;
        }
        return parse(jsonObj);
    }

    public static EiInfo parse(JSONObject jsonObj) {
        EiInfo eiInfo = new EiInfo();
        String _temp;
        if (jsonObj.containsKey("name")) {
            _temp = (String) jsonObj.get("name");
            eiInfo.setName(_temp);
        }

        if (jsonObj.containsKey("descName")) {
            _temp = (String) jsonObj.get("descName");
            eiInfo.setDescName(_temp);
        }

        if (jsonObj.containsKey("msg")) {
            _temp = (String) jsonObj.get("msg");
            eiInfo.setMsg(_temp);
        }

        if (jsonObj.containsKey("msgKey")) {
            _temp = (String) jsonObj.get("msgKey");
            eiInfo.setMsgKey(_temp);
        }

        if (jsonObj.containsKey("detailMsg")) {
            _temp = (String) jsonObj.get("detailMsg");
            eiInfo.setDetailMsg(_temp);
        }

        if (jsonObj.containsKey("status")) {
            _temp = jsonObj.get("status").toString();
            eiInfo.setStatus(Integer.parseInt(_temp));
        }

        JSONObject jsonBlocks;
        if (jsonObj.containsKey("attr")) {
            jsonBlocks = (JSONObject) jsonObj.get("attr");
            Map attr = toMap(jsonBlocks);
            eiInfo.setAttr(attr);
        }

        if (jsonObj.containsKey("blocks")) {
            jsonBlocks = (JSONObject) jsonObj.get("blocks");
            Iterator blocks = jsonBlocks.keySet().iterator();

            while (blocks.hasNext()) {
                String _blockId = (String) blocks.next();
                JSONObject jsonBlock = (JSONObject) jsonBlocks.get(_blockId);
                EiBlock block = parseEiBlock(_blockId, jsonBlock);
                eiInfo.addBlock(block);
            }
        }

        return eiInfo;
    }

    private static Map toMap(JSONObject jsonObj) {
        try {
            DynaBean attr = (DynaBean) JSONObject.toBean(jsonObj);
            DynaProperty[] origDescriptors = attr.getDynaClass().getDynaProperties();
            Map map = new HashMap();

            for (int i = 0; i < origDescriptors.length; ++i) {
                String name = origDescriptors[i].getName();
                Object value = attr.get(name);
                map.put(name, value);
            }

            return map;
        } catch (Exception var7) {
            var7.printStackTrace();
            throw new IllegalStateException();
        }
    }

    protected static EiBlock parseEiBlock(String blockId, JSONObject jsonBlock) {
        EiBlockMeta meta = null;
        if (jsonBlock.containsKey("meta")) {
            JSONObject jsonMeta = (JSONObject) jsonBlock.get("meta");
            meta = parseEiBlockMeta(blockId, jsonMeta);
        } else {
            meta = new EiBlockMeta(blockId);
        }

        String[] columnNames = meta.getMetaNames().split(",");
        EiBlock block = new EiBlock(meta);
        if (jsonBlock.containsKey("attr")) {
            JSONObject jsonAttr = (JSONObject) jsonBlock.get("attr");
            Map attr = toMap(jsonAttr);
            block.setAttr(attr);
        }

        if (jsonBlock.containsKey("rows")) {
            JSONArray jsonData = (JSONArray) jsonBlock.get("rows");
            int length = jsonData.size();

            for (int i = 0; i < length; ++i) {
                JSONArray record = (JSONArray) jsonData.get(i);

                for (int j = 0; j < columnNames.length; ++j) {
                    Object value = j < record.size() ? record.get(j) : null;
                    if (value instanceof JSONNull) {
                        value = null;
                    }

                    block.setCell(i, columnNames[j], value);
                }
            }
        }

        return block;
    }

    protected static EiBlockMeta parseEiBlockMeta(String blockId, JSONObject metaBlock) {
        EiBlockMeta meta = new EiBlockMeta();
        meta.setBlockId(blockId);
        if (metaBlock.containsKey("desc")) {
            String desc = (String) metaBlock.get("desc");
            meta.setDesc(desc);
        }

        if (metaBlock.containsKey("attr")) {
            JSONObject attr = (JSONObject) metaBlock.get("attr");
            Map map = toMap(attr);
            meta.setAttr(map);
        }

        if (metaBlock.containsKey("columns")) {
            JSONArray columnList = (JSONArray) metaBlock.get("columns");
            int len = columnList.size();

            for (int i = 0; i < len; ++i) {
                JSONObject jsonColumn = (JSONObject) columnList.get(i);
                EiColumn column = parseEiColumn(jsonColumn);
                meta.addMeta(column);
            }
        }

        return meta;
    }

    protected static EiColumn parseEiColumn(JSONObject jsonColumn) {
        String name = (String) jsonColumn.get("name");
        EiColumn column = new EiColumn(name);
        if (jsonColumn.containsKey("descName")) {
            column.setDescName(jsonColumn.getString("descName"));
        }

        if (jsonColumn.containsKey("type")) {
            column.setType(jsonColumn.getString("type"));
        }

        if (jsonColumn.containsKey("regex")) {
            column.setRegex(jsonColumn.getString("regex"));
        }

        if (jsonColumn.containsKey("formatter")) {
            column.setFormatter(jsonColumn.getString("formatter"));
        }

        if (jsonColumn.containsKey("editor")) {
            column.setEditor(jsonColumn.getString("editor"));
        }

        if (jsonColumn.containsKey("minLength")) {
            column.setMinLength(jsonColumn.getInt("minLength"));
        }

        if (jsonColumn.containsKey("maxLength")) {
            column.setMaxLength(jsonColumn.getInt("maxLength"));
        }

        if (jsonColumn.containsKey("primaryKey")) {
            column.setPrimaryKey(jsonColumn.getBoolean("primaryKey"));
        }

        if (jsonColumn.containsKey("nullable")) {
            column.setNullable(jsonColumn.getBoolean("nullable"));
        }

        if (jsonColumn.containsKey("width")) {
            column.setWidth(jsonColumn.getInt("width"));
        }

        if (jsonColumn.containsKey("height")) {
            column.setHeight(jsonColumn.getInt("height"));
        }

        if (jsonColumn.containsKey("align")) {
            column.setAlign(jsonColumn.getString("align"));
        }

        if (jsonColumn.containsKey("displayType")) {
            column.setDisplayType(jsonColumn.getString("displayType"));
        }

        if (jsonColumn.containsKey("dateFormat")) {
            column.setDateFormat(jsonColumn.getString("dateFormat"));
        }

        if (jsonColumn.containsKey("validateType")) {
            column.setValidateType(jsonColumn.getString("validateType"));
        }

        if (jsonColumn.containsKey("defaultValue")) {
            column.setDefaultValue(jsonColumn.getString("defaultValue"));
        }

        if (jsonColumn.containsKey("errorPrompt")) {
            column.setValidateErrorPrompt(jsonColumn.getString("errorPrompt"));
        }

        if (jsonColumn.containsKey("visible")) {
            column.setVisible(jsonColumn.getBoolean("visible"));
        }

        if (jsonColumn.containsKey("readonly")) {
            column.setReadonly(jsonColumn.getBoolean("readonly"));
        }

        if (jsonColumn.containsKey("blockName")) {
            column.setBlockName(jsonColumn.getString("blockName"));
        }

        if (jsonColumn.containsKey("sourceName")) {
            column.setSourceName(jsonColumn.getString("sourceName"));
        }

        if (jsonColumn.containsKey("labelProperty")) {
            column.setLabelProperty(jsonColumn.getString("labelProperty"));
        }

        if (jsonColumn.containsKey("valueProperty")) {
            column.setValueProperty(jsonColumn.getString("valueProperty"));
        }

        if (jsonColumn.containsKey("scaleLength")) {
            column.setScaleLength(jsonColumn.getInt("scaleLength"));
        }

        return column;
    }
}