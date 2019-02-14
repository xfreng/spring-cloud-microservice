package com.fui.cloud.common;

import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class StringUtils {

    /**
     * 获取uuid
     *
     * @return uuid
     */
    public static String getUUID() {
        String uuid = UUID.randomUUID().toString();
        return uuid.replaceAll("-", "");
    }

    /**
     * 字符串转list
     *
     * @param str     要转list的字符串
     * @param pattern 分隔符
     * @return list
     */
    public static List<String> asList(String str, String pattern) {
        String[] args = str.split(pattern);
        return Arrays.asList(args);
    }

    /**
     * 判断字符串是不为空
     *
     * @param str
     * @return boolean
     */
    public static boolean isNotEmpty(String str) {
        boolean bool = false;
        if (str != null && str.trim().length() > 0) {
            bool = true;
        }
        return bool;
    }

    /**
     * 判断字符串为空
     *
     * @param obj
     * @return boolean
     */
    public static boolean isNullOrEmpty(Object obj) {
        return obj == null || "".equals(obj.toString().trim());
    }

    /**
     * 方法描述： 根据身份证获取年龄，性别
     * 1表示男
     * 2表示女
     *
     * @param idNum
     * @return String[]
     */
    public static String[] getAgeAndSexById(String idNum) {
        String age = "";
        String sex = "";
        GregorianCalendar calendar = new GregorianCalendar(TimeZone.getDefault());//获取系统当前时间
        int currentYear = calendar.get(Calendar.YEAR);
        if (idNum.matches("^\\d{15}$|^\\d{17}[\\dxX]$")) {
            if (idNum.length() == 18) {
                Pattern pattern = Pattern.compile("\\d{6}(\\d{4})\\d{6}(\\d{1})[\\dxX]{1}");
                Matcher matcher = pattern.matcher(idNum);
                if (matcher.matches()) {

                    age = String.valueOf(currentYear - Integer.parseInt(matcher.group(1)));
                    sex = "" + Integer.parseInt(matcher.group(2)) % 2;
                }
            } else if (idNum.length() == 15) {
                Pattern p = Pattern.compile("\\d{6}(\\d{2})\\d{5}(\\d{1})\\d{1}");
                Matcher m = p.matcher(idNum);
                if (m.matches()) {
                    int year = Integer.parseInt(m.group(1));
                    year = 2000 + year;
                    if (year > 2020) {
                        year = year - 100;
                    }
                    age = String.valueOf(currentYear - year);
                    sex = "" + Integer.parseInt(m.group(2)) % 2;
                }
            }
        }
        if ("0".equals(sex)) {
            sex = "2";
        }
        return new String[]{age, sex};
    }
}
