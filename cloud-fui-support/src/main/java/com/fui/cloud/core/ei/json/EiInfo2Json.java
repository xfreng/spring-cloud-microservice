package com.fui.cloud.core.ei.json;

import com.fui.cloud.core.ei.EiBlock;
import com.fui.cloud.core.ei.EiBlockMeta;
import com.fui.cloud.core.ei.EiColumn;
import com.fui.cloud.core.ei.EiInfo;
import net.sf.json.JSONArray;
import net.sf.json.JSONException;
import net.sf.json.JSONNull;
import net.sf.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.*;

public class EiInfo2Json {
    private static final Logger ourLogger = LoggerFactory.getLogger(EiInfo2Json.class);

    public EiInfo2Json() {
    }

    public static String toJsonString(EiInfo info) {
        JSONObject jsonObj = toJsonObject(info);
        return jsonObj.toString();
    }

    public static String toJsonString(EiBlock inblock) {
        JSONObject jsonObj = toJsonObject(inblock);
        return jsonObj.toString();
    }

    public static JSONObject toJsonObject(EiInfo info) {
        try {
            JSONObject jsonEi = new JSONObject();
            HashMap eiBlocks = new HashMap();
            Map blocks = info.getBlocks();
            Iterator keyIt = blocks.keySet().iterator();

            while (keyIt.hasNext()) {
                String blockId = (String) keyIt.next();
                EiBlock block = info.getBlock(blockId);
                if (block != null) {
                    eiBlocks.put(blockId, toJsonObject(block));
                }
            }

            jsonEi.put("name", info.getName());
            jsonEi.put("descName", info.getDescName());
            jsonEi.put("msg", info.getMsg());
            jsonEi.put("msgKey", info.getMsgKey());
            jsonEi.put("detailMsg", info.getDetailMsg());
            jsonEi.put("status", new Integer(info.getStatus()));
            Map attr = info.getAttr();
            if (attr != null) {
                jsonEi.put("attr", info.getAttr());
            }

            jsonEi.put("blocks", eiBlocks);
            return jsonEi;
        } catch (JSONException var7) {
            ourLogger.error(var7.getMessage(), var7);
            throw new IllegalStateException(var7.getMessage());
        }
    }

    public static JSONObject toJsonObject(EiBlock eiBlock) {
        try {
            JSONObject block = new JSONObject();
            Map attr = eiBlock.getAttr();
            if (attr != null) {
                block.put("attr", eiBlock.getAttr());
            }

            EiBlockMeta eiBlockMeta = eiBlock.getBlockMeta();
            block.put("meta", toJsonObject(eiBlockMeta));
            JSONArray records = new JSONArray();
            List list = new ArrayList();
            Map metas = eiBlockMeta.getMetas();
            Iterator keyIt = metas.keySet().iterator();

            while (keyIt.hasNext()) {
                String metaN = (String) keyIt.next();
                EiColumn t = eiBlockMeta.getMeta(metaN);
                if (t != null && !"hidden".equals(t.getType())) {
                    list.add(metaN);
                }
            }

            for (int i = 0; i < eiBlock.getRowCount(); ++i) {
                JSONArray record = new JSONArray();

                for (int j = 0; j < list.size(); ++j) {
                    String column = (String) list.get(j);
                    EiColumn eiColumn = eiBlockMeta.getMeta(column);
                    if (eiColumn != null) {
                        Object property = eiBlock.getCell(i, column);
                        if (ourLogger.isDebugEnabled()) {
                            ourLogger.debug("Set " + i + "th row " + column + " property to " + property);
                            if (property != null) {
                                ourLogger.debug("whose class is" + property.getClass());
                            }
                        }

                        if (property != null) {
                            record.add(j, property.toString());
                        } else {
                            record.add(j, JSONNull.getInstance());
                        }
                    }
                }

                records.add(i, record);
            }

            block.put("rows", records);
            return block;
        } catch (JSONException var14) {
            ourLogger.error(var14.getMessage(), var14);
            throw new IllegalStateException(var14.getMessage());
        }
    }

    public static JSONObject toJsonObject(EiBlockMeta eiBlockMeta) {
        JSONObject columns = new JSONObject();

        try {
            columns.put("desc", eiBlockMeta.getDesc());
            Map attr = eiBlockMeta.getAttr();
            if (attr != null) {
                columns.put("attr", attr);
            }

            JSONArray columnArray = new JSONArray();
            Map metas = eiBlockMeta.getMetas();
            Iterator keyIt = metas.keySet().iterator();
            int index = 0;

            while (keyIt.hasNext()) {
                String metaN = (String) keyIt.next();
                EiColumn eiColumn = eiBlockMeta.getMeta(metaN);
                if (eiColumn != null && !"hidden".equals(eiColumn.getType())) {
                    columnArray.add(index, toJsonObject(eiColumn, index));
                    ++index;
                }
            }

            columns.put("columns", columnArray);
            return columns;
        } catch (JSONException var9) {
            ourLogger.error(var9.getMessage(), var9);
            throw new IllegalStateException(var9.getMessage());
        }
    }

    public static JSONObject toJsonObject(EiColumn eiColumn, int index) {
        try {
            JSONObject jsonColumn = new JSONObject();
            jsonColumn.put("pos", new Integer(index));
            String tempString = eiColumn.getName();
            if (tempString != null) {
                jsonColumn.put("name", tempString);
            }

            if ((tempString = eiColumn.getDescName()) != null) {
                jsonColumn.put("descName", tempString);
            }

            if ((tempString = eiColumn.getBlockName()) != null) {
                jsonColumn.put("blockName", tempString);
            }

            if ((tempString = eiColumn.getSourceName()) != null) {
                jsonColumn.put("sourceName", tempString);
            }

            tempString = eiColumn.getType();
            if (tempString != null && !"C".equals(tempString)) {
                jsonColumn.put("type", tempString);
            }

            if (tempString != null && "N".equals(tempString)) {
                if (eiColumn.getScaleLength() > 0) {
                    jsonColumn.put("scaleLength", new Integer(eiColumn.getScaleLength()));
                }

                if (eiColumn.getFieldLength() > 0) {
                    jsonColumn.put("fieldLength", new Integer(eiColumn.getFieldLength()));
                }
            }

            if ((tempString = eiColumn.getRegex()) != null) {
                jsonColumn.put("regex", tempString);
            }

            if ((tempString = eiColumn.getFormatter()) != null) {
                jsonColumn.put("formatter", tempString);
            }

            tempString = eiColumn.getEditor();
            if (tempString != null && !"text".equals(tempString)) {
                jsonColumn.put("editor", tempString);
            }

            int tempInteger = eiColumn.getMinLength();
            if (tempInteger > 0) {
                jsonColumn.put("minLength", new Integer(tempInteger));
            }

            if ((tempInteger = eiColumn.getMaxLength()) > 0) {
                jsonColumn.put("maxLength", new Integer(tempInteger));
            }

            boolean tempBoolean = eiColumn.isPrimaryKey();
            if (tempBoolean) {
                jsonColumn.put("primaryKey", tempBoolean);
            }

            if (!(tempBoolean = eiColumn.isNullable())) {
                jsonColumn.put("nullable", tempBoolean);
            }

            if ((tempInteger = eiColumn.getWidth()) > 0) {
                jsonColumn.put("width", new Integer(tempInteger));
            }

            if ((tempInteger = eiColumn.getHeight()) > 0) {
                jsonColumn.put("height", new Integer(tempInteger));
            }

            tempString = eiColumn.getAlign();
            if (tempString != null && !"left".equals(tempString)) {
                jsonColumn.put("align", tempString);
            }

            tempString = eiColumn.getDisplayType();
            if (tempString != null && !"text".equals(tempString)) {
                jsonColumn.put("displayType", tempString);
            }

            tempString = eiColumn.getDateFormat();
            if (tempString != null && !"yyyy-mm-dd".equals(tempString)) {
                jsonColumn.put("dateFormat", tempString);
            }

            tempString = eiColumn.getValidateType();
            if (tempString != null && !"text".equals(tempString)) {
                jsonColumn.put("validateType", tempString);
            }

            tempString = eiColumn.getDefaultValue();
            if (tempString != null && !"".equals(tempString)) {
                jsonColumn.put("defaultValue", tempString);
            }

            if ((tempString = eiColumn.getValidateErrorPrompt()) != null) {
                jsonColumn.put("errorPrompt", tempString);
            }

            if (!(tempBoolean = eiColumn.isVisible())) {
                jsonColumn.put("visible", tempBoolean);
            }

            if (tempBoolean = eiColumn.isReadonly()) {
                jsonColumn.put("readonly", tempBoolean);
            }

            if ((tempString = eiColumn.getLabelProperty()) != null) {
                jsonColumn.put("labelProperty", tempString);
            }

            if ((tempString = eiColumn.getValueProperty()) != null) {
                jsonColumn.put("valueProperty", tempString);
            }

            Map attr = eiColumn.getAttr();
            if (attr != null) {
                jsonColumn.put("attr", attr);
            }

            return jsonColumn;
        } catch (JSONException var7) {
            ourLogger.error(var7.getMessage(), var7);
            throw new IllegalStateException(var7.getMessage());
        }
    }
}
