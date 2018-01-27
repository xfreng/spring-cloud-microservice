package com.fui.cloud.common;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * @author sf.xiong
 * @version 创建时间：2011-4-7 下午01:46:10
 */
public class DateUtils {
    private static final Logger logger = LoggerFactory.getLogger(DateUtils.class);

    private static String PATTERN_NOLINE_YMDHMS = "yyyyMMddHHmmss";
    private static String PATTERN_LINE_YMDHMS = "yyyy-MM-dd HH:mm:ss";
    private static String PATTERN_YMD = "yyyy-MM-dd";

    public DateUtils() {
    }

    private static SimpleDateFormat getDateParser(String pattern) {
        return new SimpleDateFormat(pattern);
    }

    /**
     * 返回默认格式的当前时间
     *
     * @return String
     */
    public static String curDateStr19() {
        return getDateParser(DateUtils.PATTERN_LINE_YMDHMS).format(new Date(System.currentTimeMillis()));
    }

    /**
     * 返回默认格式的当前时间
     *
     * @return String
     */
    public static String curDateStr10() {
        return getDateParser(DateUtils.PATTERN_YMD).format(new Date(System.currentTimeMillis()));
    }

    /**
     * 返回默认格式的当前时间
     *
     * @return String
     */
    public static String curDateStr14() {
        return getDateParser(DateUtils.PATTERN_NOLINE_YMDHMS).format(new Date(System.currentTimeMillis()));
    }

    /**
     * 返回默认格式的时间
     *
     * @return Date
     */
    public static String getDateStr10(Date date) {
        SimpleDateFormat sdf = getDateParser(DateUtils.PATTERN_YMD);
        return sdf.format(date);
    }

    /**
     * 返回默认格式的时间
     *
     * @return Date
     */
    public static String getDateStr19(Date date) {
        SimpleDateFormat sdf = getDateParser(DateUtils.PATTERN_LINE_YMDHMS);
        return sdf.format(date);
    }

    /**
     * 返回默认格式的时间
     *
     * @return Date
     */
    public static Date getCurDate10() {
        SimpleDateFormat sdf = getDateParser(DateUtils.PATTERN_YMD);
        try {
            return sdf.parse(sdf.format(new Date(System.currentTimeMillis())));
        } catch (ParseException e) {
            e.printStackTrace();
        }
        return null;
    }

    /**
     * 返回默认格式的时间
     *
     * @return Date
     */
    public static Date getDate10(String date) {
        SimpleDateFormat sdf = getDateParser(DateUtils.PATTERN_YMD);
        try {
            return sdf.parse(date);
        } catch (ParseException e) {
            e.printStackTrace();
        }
        return getCurDate10();
    }

    /**
     * 返回默认格式的时间
     *
     * @return Date
     */
    public static Date getCurDate19() {
        SimpleDateFormat sdf = getDateParser(DateUtils.PATTERN_LINE_YMDHMS);
        try {
            return sdf.parse(sdf.format(new Date(System.currentTimeMillis())));
        } catch (ParseException e) {
            e.printStackTrace();
        }
        return null;
    }

    /**
     * 返回默认格式的时间
     *
     * @return Date
     */
    public static Date getDate19(String date) {
        SimpleDateFormat sdf = getDateParser(DateUtils.PATTERN_LINE_YMDHMS);
        try {
            return sdf.parse(date);
        } catch (ParseException e) {
            e.printStackTrace();
        }
        return null;
    }

    /**
     * 返回传入格式的时间
     *
     * @return Date
     */
    public static Date toDate(String dateString, String pattern) {
        Date date = null;
        try {
            date = getDateParser(pattern).parse(dateString);
        } catch (Exception var4) {
            logger.warn("解析date字符串时出错,返回null. dateString:" + dateString + "ex:" + var4);
        }
        return date;
    }

    /**
     * 返回传入格式的时间字符串
     *
     * @return String
     */
    public static String toDateStr(Date date, String pattern) {
        if (date == null) {
            if (logger.isInfoEnabled()) {
                logger.info("传入的date对象为空,返回空字符串");
            }
            return "";
        } else {
            return getDateParser(pattern).format(date);
        }
    }
}
