package com.fui.cloud.core.ep;

import com.fui.cloud.core.ei.EiBlock;
import com.fui.cloud.core.ei.EiConstant;
import com.fui.cloud.core.ei.EiInfo;

import java.util.Collection;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;

public class QueryMap implements Map {
    protected Map properties = new HashMap();

    public static QueryMap getQueryMap(EiInfo info) {
        QueryMap queryMap = new QueryMap();
        queryMap.loadEiInfo(info, EiConstant.queryBlock, EiConstant.resultBlock);
        return queryMap;
    }

    public QueryMap() {
    }

    public void loadEiInfo(EiInfo info, String paramBlockName, String pageBlockName) {
        EiBlock eiBlock = info.getBlock(paramBlockName);
        if (eiBlock != null) {
            this.putAll(eiBlock.getRow(0));
            this.putAll(eiBlock.getAttr());
        }

        EiBlock pgBlock = info.getBlock(pageBlockName);
        if (pgBlock != null) {
            this.setOffset(pgBlock.getInt("offset"));
            int limit = pgBlock.getInt("limit");
            if (limit > 0) {
                this.setLimit(limit);
            }

            this.setCount(pgBlock.getInt("count"));
            this.setOrderBy(pgBlock.getString("orderBy"));
        }

    }

    public void setEiInfo(EiInfo info, String blockName) {
        EiBlock eiBlock = info.getBlock(blockName);
        if (eiBlock == null) {
            eiBlock = info.addBlock(blockName);
        }

        Map attr = eiBlock.getAttr();
        if (attr == null) {
            attr = new HashMap();
        }

        ((Map) attr).put("offset", "" + this.getOffset());
        ((Map) attr).put("limit", "" + this.getLimit());
        ((Map) attr).put("orderBy", this.getOrderBy());
        eiBlock.setAttr((Map) attr);
    }

    public int getLimit() {
        Integer limit = (Integer) this.properties.get("limit");
        return limit == null ? 10 : limit;
    }

    public void setLimit(int limit) {
        Integer limitInteger = new Integer(limit);
        this.properties.put("limit", limitInteger);
    }

    public int getOffset() {
        Integer offset = (Integer) this.properties.get("offset");
        return offset == null ? 0 : offset;
    }

    public void setOffset(int offset) {
        Integer offsetInteger = new Integer(offset);
        this.properties.put("offset", offsetInteger);
    }

    public String getOrderBy() {
        String orderBy = (String) this.properties.get("orderBy");
        return orderBy;
    }

    public void setOrderBy(String orderBy) {
        this.properties.put("orderBy", orderBy);
    }

    public int getCount() {
        Integer count = (Integer) this.properties.get("count");
        return count == null ? -1 : count;
    }

    public void setCount(int count) {
        Integer counterInteger = new Integer(count);
        this.properties.put("count", counterInteger);
    }

    public int size() {
        return this.properties.size();
    }

    public void clear() {
        this.properties.clear();
    }

    public boolean isEmpty() {
        return this.properties.isEmpty();
    }

    public boolean containsKey(Object key) {
        return this.properties.containsKey(key);
    }

    public boolean containsValue(Object obj) {
        return this.properties.containsValue(obj);
    }

    public Collection values() {
        return this.properties.values();
    }

    public void putAll(Map map) {
        if (map != null) {
            this.properties.putAll(map);
        }

    }

    public Set entrySet() {
        return this.properties.entrySet();
    }

    public Set keySet() {
        return this.properties.keySet();
    }

    public Object get(Object key) {
        Object obj = this.properties.get(key);
        return obj;
    }

    public Object remove(Object obj) {
        return this.properties.remove(obj);
    }

    public Object put(Object key, Object obj) {
        if (("offset".equals(key) || "count".equals(key) || "limit".equals(key)) && !(obj instanceof Integer)) {
            int in = Integer.parseInt(obj.toString());
            return this.properties.put(key, new Integer(in));
        } else {
            return "orderBy".equals(key) && !(obj instanceof String) ? this.properties.put(key, obj.toString()) : this.properties.put(key, obj);
        }
    }

    public String toString() {
        return this.properties.toString();
    }
}