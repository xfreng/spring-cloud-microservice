package com.fui.cloud.core.ei;

import com.fui.cloud.core.BaseObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;

public class EiColumn extends BaseObject {
    private static final Logger logger = LoggerFactory.getLogger(EiColumn.class);
    private static final long serialVersionUID = -1665103398765698648L;
    private String name = "";
    private String type = "C";
    private String descName = " ";
    private String regex = null;
    private String formatter = null;
    private String editor = "text";
    private int minLength = 0;
    private int maxLength = 0;
    private int fieldLength = 0;
    private int scaleLength = 0;
    private boolean primaryKey = false;
    private int width = 0;
    private int height = 0;
    private String align = "left";
    private String displayType = "text";
    private String dateFormat = "";
    private String validateType = "text";
    private String validateErrorPrompt = null;
    private String defaultValue = "";
    private boolean nullable = true;
    private boolean visible = true;
    private boolean readonly = false;
    private String labelProperty = null;
    private String valueProperty = null;
    private String sourceName = null;
    private String blockName = null;

    public void setNotNull(boolean nullable) {
        this.nullable = !nullable;
    }

    public boolean getNotNull() {
        return !this.nullable;
    }

    public boolean isNotNull() {
        return !this.nullable;
    }

    public String getLabelProperty() {
        return this.labelProperty;
    }

    public void setLabelProperty(String labelProperty) {
        this.labelProperty = labelProperty;
    }

    public String getValueProperty() {
        return this.valueProperty;
    }

    public void setValueProperty(String valueProperty) {
        this.valueProperty = valueProperty;
    }

    public EiColumn(String name) {
        this.name = name;
    }

    public String getEditor() {
        return this.editor;
    }

    public void setEditor(String editor) {
        this.editor = editor;
    }

    public String getFormatter() {
        return this.formatter;
    }

    public void setFormatter(String formatter) {
        this.formatter = formatter;
    }

    public String getDescName() {
        return this.descName;
    }

    public void setDescName(String name) {
        this.descName = name;
    }

    public String getType() {
        return this.type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getRegex() {
        return this.regex;
    }

    public void setRegex(String regex) {
        if (regex != null && !"".equals(regex.trim())) {
            this.regex = regex;
        }

    }

    public int getMaxLength() {
        return this.maxLength;
    }

    public void setMaxLength(int maxLength) {
        this.maxLength = maxLength;
    }

    public boolean isPrimaryKey() {
        return this.primaryKey;
    }

    public void setPrimaryKey(boolean primaryKey) {
        this.primaryKey = primaryKey;
    }

    public boolean isNullable() {
        return this.nullable;
    }

    public void setNullable(boolean nullable) {
        this.nullable = nullable;
    }

    public int getHeight() {
        return this.height;
    }

    public void setHeight(int height) {
        this.height = height;
    }

    public int getWidth() {
        return this.width;
    }

    public void setWidth(int width) {
        this.width = width;
    }

    public String getAlign() {
        return this.align;
    }

    public void setAlign(String align) {
        this.align = align;
    }

    public String getDisplayType() {
        return this.displayType;
    }

    public void setDisplayType(String displayType) {
        this.displayType = displayType;
    }

    public String getDateFormat() {
        return this.dateFormat;
    }

    public void setDateFormat(String dateFormat) {
        this.dateFormat = dateFormat;
    }

    public String getValidateType() {
        return this.validateType;
    }

    public void setValidateType(String validateType) {
        this.validateType = validateType;
    }

    public int getMinLength() {
        return this.minLength;
    }

    public void setMinLength(int minLength) {
        if (minLength >= 0) {
            this.minLength = minLength;
        }
    }

    public String getDefaultValue() {
        return this.defaultValue;
    }

    public void setDefaultValue(String defaultValue) {
        if (defaultValue != null) {
            this.defaultValue = defaultValue;
        }

    }

    public boolean isVisible() {
        return this.visible;
    }

    public void setVisible(boolean visible) {
        this.visible = visible;
    }

    public boolean isReadonly() {
        return this.readonly;
    }

    public void setReadonly(boolean readonly) {
        this.readonly = readonly;
    }

    public String getCname() {
        return this.getDescName();
    }

    public void setCname(String columnCname) {
        this.setDescName(columnCname);
    }

    public int getDecLen() {
        return this.getInt("declen");
    }

    public void setDecLen(int columnDecLen) {
        this.set("declen", new Integer(columnDecLen));
    }

    public int getLen() {
        return this.getMaxLength();
    }

    public void setLen(int columnLen) {
        this.setMaxLength(columnLen);
    }

    public String getEname() {
        return this.getName();
    }

    public void setEname(String columnEname) {
        this.setName(columnEname);
    }

    public String getValidateErrorPrompt() {
        return this.validateErrorPrompt;
    }

    public void setValidateErrorPrompt(String validateErrorPrompt) {
        if (validateErrorPrompt != null) {
            this.validateErrorPrompt = validateErrorPrompt.trim();
        }

    }

    public String getBlockName() {
        return this.blockName;
    }

    public void setBlockName(String blockName) {
        this.blockName = blockName;
    }

    public String getSourceName() {
        return this.sourceName;
    }

    public void setSourceName(String sourceName) {
        this.sourceName = sourceName;
    }

    public int getFieldLength() {
        return this.fieldLength;
    }

    public void setFieldLength(int fieldLength) {
        this.fieldLength = fieldLength;
    }

    public int getScaleLength() {
        return this.scaleLength;
    }

    public void setScaleLength(int scaleLength) {
        this.scaleLength = scaleLength;
    }

    public Object clone() {
        EiColumn newCol = new EiColumn("clone");

        try {
            BeanUtils.copyProperties(newCol, this);
        } catch (Exception var3) {
            logger.error("clone error: " + var3);
        }

        return newCol;
    }
}