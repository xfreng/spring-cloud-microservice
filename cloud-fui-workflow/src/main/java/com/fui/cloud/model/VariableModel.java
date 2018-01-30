package com.fui.cloud.model;

import com.fui.cloud.common.DateConverter;
import com.fui.cloud.common.PropertyType;
import org.apache.commons.beanutils.ConvertUtils;

import java.io.Serializable;
import java.util.HashMap;
import java.util.Map;

public class VariableModel implements Serializable {
    private static final long serialVersionUID = 1L;

    private String type;
    private String key;
    private String value;

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public Map<String, Object> getVariableMap() {
        Map<String, Object> variables = new HashMap<String, Object>();
        ConvertUtils.register(new DateConverter(), java.util.Date.class);
        Class<?> targetType = Enum.valueOf(PropertyType.class, this.type).getValue();
        Object objectValue = ConvertUtils.convert(this.value, targetType);
        variables.put(this.key, objectValue);
        return variables;
    }
}