package com.fui.cloud.enums;

public enum AppId {
    FUI("fui", 1);

    // 成员变量
    private String name;
    private int index;

    // 构造方法
    AppId(String name, int index) {
        this.name = name;
        this.index = index;
    }

    // 普通方法
    public static String getName(int index) {
        for (AppId appId : AppId.values()) {
            if (appId.getIndex() == index) {
                return appId.name;
            }
        }
        return null;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getIndex() {
        return index;
    }

    public void setIndex(int index) {
        this.index = index;
    }
}
