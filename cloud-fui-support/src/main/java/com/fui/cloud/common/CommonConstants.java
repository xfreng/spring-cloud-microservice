package com.fui.cloud.common;

/**
 * @Title 通用常量表
 * @Author sf.xiong on 2017/08/04.
 */
public interface CommonConstants {
    /**
     * 日期格式
     */
    String PARTTERN_YYYY_MM_DD = "yyyy-MM-dd";
    String PARTTERN_YYYY_MM_DD_HH = "yyyy-MM-dd HH";
    String PARTTERN_YYYY_MM_DD_HH_MM = "yyyy-MM-dd HH:mm";
    String PARTTERN_YYYY_MM_DD_HH_MM_SS = "yyyy-MM-dd HH:mm:ss";
    String PARTTERN_YYYYMMDD = "yyyyMMdd";
    String PARTTERN_YYYY_MM_DD_HH_MM_SS_SSS = "yyyyMMddHHmmssSSS";

    // 系统默认字符集
    String DEFAULT_CHARACTER = "UTF-8";

    // 响应JSON格式
    String MediaType_APPLICATION_JSON = "application/json;charset=utf-8";

    // 响应HTML格式
    String MediaType_APPLICATION_HTML = "text/html;charset=utf-8";

    // 超级管理员用户名
    String SUPER_USER_ID = "admin";

    // 默认用户密码
    String DEFAULT_USER_PWD = "888888";

    // 用户session对象ID
    String USER_SESSION_ID = "userObject";

    // 随机数字符串
    String RAND_STRING = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

    // 默认样式
    String DEFAULT_STYLE = "default";

    // 树根节点id
    String TREE_ROOT_NAME = "$";

    // 树根节点id
    String TREE_ROOT_ID = "root";

    // 前台分页总条数
    String PAGE_TOTAL = "total";

    // 前台分页json名
    String PAGE_KEY_NAME = "data";

    // 图片上传请求参数
    String UPLOADS = "file";

    // rest service请求前缀
    String HTTP_PREFIX = "http://";

    // rest service名称
    String DB_SERVICE_NAME = "fui-db-sql";

    // rest service api请求前缀
    String DB_SERVICE_PREFIX_MAPPING = "/api/";

    // 流程过滤类型
    String CATEGORY_NOT_EQUALS = "99";

    // 上传文件最大容量
    long FILE_LIMIT_SIZE = 5048576L;

    // 压缩图片质量
    float OUTPUT_QUALITY = 0.8F;

    // 压缩图片比例
    float SCALE = 1.0F;

}
