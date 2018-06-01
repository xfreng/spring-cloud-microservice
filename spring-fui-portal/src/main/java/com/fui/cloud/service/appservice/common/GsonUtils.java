package com.fui.cloud.service.appservice.common;

import com.fui.cloud.common.DateUtils;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.TypeAdapter;
import com.google.gson.TypeAdapterFactory;
import com.google.gson.reflect.TypeToken;
import com.google.gson.stream.JsonReader;
import com.google.gson.stream.JsonToken;
import com.google.gson.stream.JsonWriter;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.util.Date;

/**
 * @Title 通用转换类
 * @Author sf.xiong on 2017/4/15.
 */
public class GsonUtils {
    private static final Logger logger = LoggerFactory.getLogger(GsonUtils.class);

    /**
     * 空的 {@code JSON} 数据 - <code>"{}"</code>。
     */
    private static final String EMPTY_JSON = "{}";
    /**
     * 默认的 {@code JSON} 日期/时间字段的格式化模式。
     */
    public static final String DEFAULT_DATE_PATTERN = "yyyy-MM-dd HH:mm:ss";

    /**
     * 将给定的目标对象根据指定的条件参数转换成 {@code JSON} 格式的字符串
     *
     * @param target
     * @return 目标对象的 {@code JSON} 格式的字符串
     */
    public static String toJson(Object target) {
        return toJson(target, false, DEFAULT_DATE_PATTERN);
    }

    /**
     * 将给定的目标对象根据指定的条件参数转换成 {@code JSON} 格式的字符串
     *
     * @param target
     * @return 目标对象的 {@code JSON} 格式的字符串
     */
    public static String toJson(Object target, String datePattern) {
        return toJson(target, false, datePattern);
    }

    /**
     * 将给定的目标对象根据指定的条件参数转换成 {@code JSON} 格式的字符串
     *
     * @param target           目标对象
     * @param isSerializeNulls 是否序列化 {@code null} 值字段
     * @param datePattern      日期字段的格式化模式
     * @return 目标对象的 {@code JSON} 格式的字符串
     */
    public static String toJson(Object target, boolean isSerializeNulls, String datePattern) {
        if (target == null)
            return EMPTY_JSON;
        GsonBuilder builder = new GsonBuilder().registerTypeAdapterFactory(new NullDateToEmptyAdapterFactory(datePattern));
        if (isSerializeNulls) {
            builder.serializeNulls();
        }
        if (StringUtils.isBlank(datePattern)) {
            datePattern = DEFAULT_DATE_PATTERN;
        }
        builder.setDateFormat(datePattern);
        builder.disableHtmlEscaping().setPrettyPrinting();
        Gson gson = builder.create();
        return gson.toJson(target);
    }

    /**
     * 将给定的 {@code JSON} 字符串转换成指定的类型对象。<strong>此方法通常用来转换普通的 {@code JavaBean}
     * 对象。</strong>
     *
     * @param <T>   要转换的目标类型。
     * @param json  给定的 {@code JSON} 字符串。
     * @param clazz 要转换的目标类。
     * @return 给定的 {@code JSON} 字符串表示的指定的类型对象。
     */
    public static <T> T fromJson(String json, Class<T> clazz) {
        return fromJson(json, clazz, DEFAULT_DATE_PATTERN);
    }

    /**
     * 将给定的 {@code JSON} 字符串转换成指定的类型对象。<strong>此方法通常用来转换普通的 {@code JavaBean}
     * 对象。</strong>
     *
     * @param <T>         要转换的目标类型。
     * @param json        给定的 {@code JSON} 字符串。
     * @param clazz       要转换的目标类。
     * @param datePattern 日期格式模式。
     * @return 给定的 {@code JSON} 字符串表示的指定的类型对象。
     */
    public static <T> T fromJson(String json, Class<T> clazz, String datePattern) {
        if (!StringUtils.isNotEmpty(json)) {
            return null;
        }
        GsonBuilder builder = new GsonBuilder();
        if (StringUtils.isNotEmpty(datePattern)) {
            datePattern = DEFAULT_DATE_PATTERN;
        }
        builder.setDateFormat(datePattern);
        Gson gson = builder.create();
        try {
            return gson.fromJson(json, clazz);
        } catch (Exception ex) {
            logger.error(json + " 无法转换为 " + clazz.getName() + " 对象!", ex);
            return null;
        }
    }

    public static class NullDateToEmptyAdapterFactory implements TypeAdapterFactory {
        private String datePattern;

        public NullDateToEmptyAdapterFactory(String datePattern) {
            this.datePattern = datePattern;
        }

        public <T> TypeAdapter<T> create(Gson gson, TypeToken<T> type) {
            Class<T> rawType = (Class<T>) type.getRawType();
            if (rawType != new Date().getClass()) {
                return null;
            }
            return (TypeAdapter<T>) new DateAdapter(datePattern);
        }
    }

    public static class DateAdapter extends TypeAdapter<Date> {
        private String datePattern;

        public DateAdapter(String datePattern) {
            this.datePattern = datePattern;
        }

        public Date read(JsonReader reader) throws IOException {
            if (reader.peek() == JsonToken.NULL) {
                reader.nextNull();
                return null;
            }
            return DateUtils.toDate(reader.nextString(), datePattern);
        }

        public void write(JsonWriter writer, Date value) throws IOException {
            if (value == null) {
                writer.nullValue();
                return;
            }
            writer.value(DateUtils.toDateStr(value, datePattern));
        }
    }
}