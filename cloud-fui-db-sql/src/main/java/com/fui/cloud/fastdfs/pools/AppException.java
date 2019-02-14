package com.fui.cloud.fastdfs.pools;

/**
 * @Title FastDFS通用异常
 */
public class AppException extends Exception {

    private String code;
    private String description;


    public AppException(String code, String message) {
        super(message);
        this.code = code;
    }

    public AppException(String code, String message, String description) {
        super(message);
        this.code = code;
        this.description = description;
    }

    /**
     * 错误码
     *
     * @return
     */
    public String getCode() {
        return code;
    }

    /**
     * 用户可读描述信息
     *
     * @return
     */
    public String getDescription() {
        return description;
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append(getClass().getName());
        sb.append(code);
        sb.append(" - ");
        sb.append(getMessage());
        if (getDescription() != null) {
            sb.append(" - ");
            sb.append(getDescription());
        }
        return sb.toString();
    }
}
