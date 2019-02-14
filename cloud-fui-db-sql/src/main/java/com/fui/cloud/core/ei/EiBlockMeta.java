package com.fui.cloud.core.ei;

import com.fui.cloud.core.BaseObject;
import com.fui.cloud.core.LangUtils;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.Map;

public class EiBlockMeta extends BaseObject {
    private static final Logger logger = LoggerFactory.getLogger(EiBlockMeta.class);
    private static final long serialVersionUID = -6951467276422266189L;
    private String blockId;
    private String desc;
    protected Map metas = new LinkedHashMap();

    public EiBlockMeta() {
    }

    public EiBlockMeta(String blockId) {
        this.blockId = blockId;
    }

    public int getMetaCount() {
        return this.metas.size();
    }

    public Map getMetas() {
        return this.metas;
    }

    public void setMetas(Map metas) {
        this.metas = metas;
    }

    public void addMetas(Map newMetas) {
        if (newMetas != null) {
            if (this.metas == null) {
                this.metas = new LinkedHashMap();
            }

            this.metas.putAll(newMetas);
        }
    }

    public void addMetas(EiBlockMeta newBlockMeta) {
        this.addMetas(newBlockMeta.getMetas());
    }

    public void addMeta(EiColumn meta) {
        if (meta == null) {
            if (logger.isInfoEnabled()) {
                logger.info("传入的meta对象为空,返回");
            }

        } else {
            if (logger.isDebugEnabled()) {
                logger.debug("addMeta(EiColumn) - start");
                logger.debug("addMeta(EiColumn) - meta=" + meta);
            }

            this.metas.put(meta.getName(), meta);
            if (logger.isDebugEnabled()) {
                logger.debug("addMeta(EiColumn) - end");
            }

        }
    }

    public EiColumn getMeta(String metaName) {
        return (EiColumn) this.metas.get(metaName);
    }

    public String getMetaNames() {
        return LangUtils.getMapKeys(this.metas);
    }

    public Map getMetaEditors() {
        Map map = new HashMap();
        Iterator it = this.metas.keySet().iterator();

        while (it.hasNext()) {
            String key = (String) it.next();
            String value = this.getMeta(key).getEditor();
            if (!StringUtils.isEmpty(value)) {
                map.put(key, value);
            }
        }

        return map;
    }

    public Map getMetaFormatters() {
        Map map = new HashMap();
        Iterator it = this.metas.keySet().iterator();

        while (it.hasNext()) {
            String key = (String) it.next();
            String value = this.getMeta(key).getFormatter();
            if (!StringUtils.isEmpty(value)) {
                map.put(key, value);
            }
        }

        return map;
    }

    public Map getMetaRegexs() {
        Map map = new HashMap();
        Iterator it = this.metas.keySet().iterator();

        while (it.hasNext()) {
            String key = (String) it.next();
            String value = this.getMeta(key).getRegex();
            if (!StringUtils.isEmpty(value)) {
                map.put(key, value);
            }
        }

        return map;
    }

    public Map getMetaTypes() {
        Map map = new HashMap();
        Iterator it = this.metas.keySet().iterator();

        while (it.hasNext()) {
            String key = (String) it.next();
            String value = this.getMeta(key).getType();
            if (!StringUtils.isEmpty(value)) {
                map.put(key, value);
            }
        }

        return map;
    }

    public String getBlockId() {
        return this.blockId;
    }

    public void setBlockId(String blockId) {
        this.blockId = blockId;
    }

    public String getDesc() {
        return this.desc;
    }

    public void setDesc(String desc) {
        this.desc = desc;
    }

    public String getDescMetaNames() {
        return this.getMetaNames();
    }

    public Map getMetaNotNullNames() {
        Map map = new HashMap();
        Iterator it = this.metas.keySet().iterator();

        while (it.hasNext()) {
            String key = (String) it.next();
            if (this.getMeta(key).isNullable()) {
                map.put(key, key);
            }
        }

        return map;
    }

    public Map getMetaMaxLengths() {
        Map map = new HashMap();
        Iterator it = this.metas.keySet().iterator();

        while (it.hasNext()) {
            String key = (String) it.next();
            int value = this.getMeta(key).getMaxLength();
            if (value > 0) {
                map.put(key, new Integer(value));
            }
        }

        return map;
    }

    public EiColumn removeMeta(EiColumn meta) {
        if (meta == null) {
            if (logger.isInfoEnabled()) {
                logger.info("传入的meta对象为空,返回");
            }

            return null;
        } else {
            if (logger.isDebugEnabled()) {
                logger.debug("removeMeta(EiColumn) - start");
                logger.debug("removeMeta(EiColumn) - meta=" + meta);
            }

            EiColumn removeMeta = (EiColumn) this.metas.remove(meta.getName());
            if (logger.isDebugEnabled()) {
                logger.debug("removeMeta(EiColumn) - end");
            }

            return removeMeta;
        }
    }

    public EiColumn removeMeta(String metaName) {
        if (metaName == null) {
            if (logger.isInfoEnabled()) {
                logger.info("传入的metaName为空,返回");
            }

            return null;
        } else {
            if (logger.isDebugEnabled()) {
                logger.debug("removeMeta(string) - start");
                logger.debug("removeMeta(string) - metaName=" + metaName);
            }

            EiColumn removeMeta = (EiColumn) this.metas.remove(metaName);
            if (logger.isDebugEnabled()) {
                logger.debug("removeMeta(string) - end");
            }

            return removeMeta;
        }
    }

    public Object deepClone() {
        EiBlockMeta newBlockMeta = (EiBlockMeta) super.deepClone();
        if (this.metas != null) {
            newBlockMeta.metas = (LinkedHashMap) ((LinkedHashMap) this.metas).clone();
            newBlockMeta.metas.clear();
            newBlockMeta.metas.putAll(this.metas);
        }

        return newBlockMeta;
    }
}
