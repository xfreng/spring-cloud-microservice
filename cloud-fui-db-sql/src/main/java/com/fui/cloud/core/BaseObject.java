package com.fui.cloud.core;

import org.apache.commons.beanutils.BeanUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.builder.EqualsBuilder;
import org.apache.commons.lang.builder.HashCodeBuilder;
import org.apache.commons.lang.builder.ReflectionToStringBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.Serializable;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

public class BaseObject implements Serializable, Cloneable {
    private static final Logger logger = LoggerFactory.getLogger(BaseObject.class);
    private static final long serialVersionUID = 4406463535024651558L;
    private Map attr;

    public BaseObject() {
    }

    public String toString() {
        return (new ReflectionToStringBuilder(this)).toString();
    }

    public boolean equals(Object obj) {
        return EqualsBuilder.reflectionEquals(this, obj);
    }

    public int hashCode() {
        return HashCodeBuilder.reflectionHashCode(this);
    }

    public Object clone() {
        try {
            return BeanUtils.cloneBean(this);
        } catch (Exception var2) {
            logger.error("clone()", var2);
            return null;
        }
    }

    public Object deepClone() {
        try {
            BaseObject newObj = (BaseObject) this.clone();
            if (this.attr != null) {
                newObj.setAttr((HashMap) ((HashMap) this.attr).clone());
            }

            return newObj;
        } catch (Exception var2) {
            logger.error("fullClone()", var2);
            return null;
        }
    }

    public Map getAttr() {
        return this.attr;
    }

    public void setAttr(Map attr) {
        this.attr = attr;
    }

    public Object get(String key) {
        return this.attr == null ? null : this.attr.get(key);
    }

    public String getString(String key) {
        return this.get(key) == null ? null : String.valueOf(this.get(key));
    }

    public int getInt(String key) {
        try {
            return Integer.parseInt(String.valueOf(this.get(key)));
        } catch (Exception var3) {
            return 0;
        }
    }

    public String getAttrKeys() {
        if (this.attr == null) {
            return "";
        } else {
            StringBuffer sb = new StringBuffer();
            Iterator i = this.attr.keySet().iterator();

            while (i.hasNext()) {
                sb.append((String) i.next() + ",");
            }

            return StringUtils.substringBeforeLast(sb.toString(), ",");
        }
    }

    public void set(String key, Object value) {
        if (this.attr == null) {
            this.attr = new HashMap();
        }

        this.attr.put(key, value);
    }
}
