package com.fui.cloud.core;

import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.*;
import java.util.Map.Entry;

public class LangUtils {
    private static final Logger logger = LoggerFactory.getLogger(LangUtils.class);

    public LangUtils() {
    }

    public static Map splitStr2Map(String source, String sep1, String sep2) {
        if (logger.isDebugEnabled()) {
            logger.debug("splitStr2Map(String, String, String) - start");
        }

        if (source != null && !source.equals("")) {
            Map result = new HashMap();
            String[] sources = StringUtils.split(source, sep1);

            for (int i = 0; i < sources.length; ++i) {
                String[] subsources = StringUtils.split(sources[i], sep2);
                result.put(subsources[0], subsources[1]);
            }

            if (logger.isDebugEnabled()) {
                logger.debug("splitStr2Map(String, String, String) - end");
            }

            return result;
        } else {
            if (logger.isDebugEnabled()) {
                logger.debug("splitStr2Map(String, String, String) - end");
            }

            return null;
        }
    }

    public static Map filterNullMap(Map values) {
        if (logger.isDebugEnabled()) {
            logger.debug("filterNullMap(Map) - start");
        }

        if (values == null) {
            return null;
        } else {
            Map result = new HashMap();
            Iterator i = values.entrySet().iterator();

            while (i.hasNext()) {
                Entry me = (Entry) i.next();
                if (me.getValue() != null) {
                    result.put(me.getKey(), me.getValue());
                }
            }

            if (logger.isDebugEnabled()) {
                logger.debug("filterNullMap(Map) - end");
            }

            return result;
        }
    }

    public static Map filterEmptyMap(Map values) {
        if (logger.isDebugEnabled()) {
            logger.debug("filterEmptyMap(Map) - start");
        }

        if (values == null) {
            if (logger.isDebugEnabled()) {
                logger.debug("filterEmptyMap(Map) - end");
            }

            return null;
        } else {
            Map result = new HashMap();
            Iterator i = values.entrySet().iterator();

            while (i.hasNext()) {
                Entry me = (Entry) i.next();
                String value = (String) me.getValue();
                if (!StringUtils.isEmpty(value)) {
                    result.put(me.getKey(), me.getValue());
                }
            }

            if (logger.isDebugEnabled()) {
                logger.debug("filterEmptyMap(Map) - end");
            }

            return result;
        }
    }

    public static String getStrFromMapList(List list, String key) {
        if (logger.isDebugEnabled()) {
            logger.debug("getStrFromMapList(List, String) - start");
        }

        StringBuffer sb = new StringBuffer();

        for (int i = 0; i < list.size(); ++i) {
            Map map = (Map) list.get(i);
            if (map.get(key) != null) {
                sb.append(String.valueOf(map.get(key)) + ",");
            }
        }

        String result = sb.toString();
        result = StringUtils.substringBeforeLast(result, ",");
        if (logger.isDebugEnabled()) {
            logger.debug("getStrFromMapList(List, String) - end");
        }

        return result;
    }

    public static Map subMap(Map values, String[] keys) {
        if (logger.isDebugEnabled()) {
            logger.debug("subMap(Map, String[]) - start");
        }

        Map result = new HashMap();

        for (int i = 0; i < keys.length; ++i) {
            Object obj = values.get(keys[i]);
            if (obj != null) {
                result.put(keys[i], obj);
            }
        }

        if (logger.isDebugEnabled()) {
            logger.debug("subMap(Map, String[]) - end");
        }

        return result;
    }

    public static String getMapKeys(Map map) {
        if (logger.isDebugEnabled()) {
            logger.debug("getMapKeys(Map) - start");
        }

        if (map == null) {
            if (logger.isDebugEnabled()) {
                logger.debug("getMapKeys(Map) - end");
            }

            return "";
        } else {
            StringBuffer sb = new StringBuffer();
            Iterator i = map.keySet().iterator();

            while (i.hasNext()) {
                sb.append((String) i.next() + ",");
            }

            String returnString = StringUtils.substringBeforeLast(sb.toString(), ",");
            if (logger.isDebugEnabled()) {
                logger.debug("getMapKeys(Map) - end");
            }

            return returnString;
        }
    }

    public static String Array2String(Object[] array) {
        if (logger.isDebugEnabled()) {
            logger.debug("Array2String(Object[]) - start");
        }

        if (array == null) {
            if (logger.isDebugEnabled()) {
                logger.debug("Array2String(Object[]) - end");
            }

            return "";
        } else {
            StringBuffer sb = new StringBuffer();

            for (int i = 0; i < array.length; ++i) {
                sb.append(array[i] + ",");
            }

            String returnString = StringUtils.substringBeforeLast(sb.toString(), ",");
            if (logger.isDebugEnabled()) {
                logger.debug("Array2String(Object[]) - end");
            }

            return returnString;
        }
    }

    public static Map convertMap(String keyName, String keyValue) {
        if (logger.isDebugEnabled()) {
            logger.debug("convertMap(String, String) - start");
        }

        Map pkmap = new HashMap();
        if (keyName.indexOf("|") > 0) {
            String[] keynames = StringUtils.split(keyName, "|");
            String[] keyvalues = StringUtils.split(keyValue, "|");

            for (int i = 0; i < keynames.length; ++i) {
                pkmap.put(keynames[i], keyvalues[i]);
            }
        } else {
            pkmap.put(keyName, keyValue);
        }

        if (logger.isDebugEnabled()) {
            logger.debug("convertMap(String, String) - end");
        }

        return pkmap;
    }

    public static List getMultiPkList(String keyName, String keyValue) {
        if (logger.isDebugEnabled()) {
            logger.debug("getMultiPkList(String, String) - start");
        }

        List keylist = new ArrayList();
        String[] keyValues = StringUtils.split(keyValue, ",");

        for (int i = 0; i < keyValues.length; ++i) {
            new HashMap();
            String value = keyValues[i];
            Map pkmap = convertMap(keyName, value);
            keylist.add(pkmap);
        }

        if (logger.isDebugEnabled()) {
            logger.debug("getMultiPkList(String, String) - end");
        }

        return keylist;
    }

    public static String java2sqlName(String name) {
        if (logger.isDebugEnabled()) {
            logger.debug("java2sqlName(String) - start");
        }

        String column = "";

        for (int i = 0; i < name.length(); ++i) {
            if (i < name.length() - 1 && name.charAt(i) >= 'a' && name.charAt(i) <= 'z' && name.charAt(i + 1) >= 'A' && name.charAt(i + 1) <= 'Z') {
                column = column + name.charAt(i) + "_";
            } else {
                column = column + name.charAt(i);
            }
        }

        String returnString = column.toLowerCase();
        if (logger.isDebugEnabled()) {
            logger.debug("java2sqlName(String) - end");
        }

        return returnString;
    }

    public static String sql2javaName(String name) {
        if (logger.isDebugEnabled()) {
            logger.debug("sql2javaName(String) - start");
        }

        name = name.toLowerCase();
        String column = "";

        for (int i = 0; i < name.length(); ++i) {
            if (name.charAt(i) == '_') {
                StringBuilder var10000 = new StringBuilder(String.valueOf(column));
                ++i;
                column = var10000.append(i < name.length() ? String.valueOf(name.charAt(i)).toUpperCase() : "").toString();
            } else {
                column = column + name.charAt(i);
            }
        }

        if (logger.isDebugEnabled()) {
            logger.debug("sql2javaName(String) - end");
        }

        return column;
    }
}
