package com.fui.cloud.model;

import java.io.Serializable;
import java.util.List;

public class TreeNodeModel implements Serializable {
    private static final long serialVersionUID = 1L;
    private String id;
    private String resourceId;
    private String text;
    private String state;
    private String iconCls;
    private List<TreeNodeModel> children = null;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getResourceId() {
        return resourceId;
    }

    public void setResourceId(String resourceId) {
        this.resourceId = resourceId;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getIconCls() {
        return iconCls;
    }

    public void setIconCls(String iconCls) {
        this.iconCls = iconCls;
    }

    public List<TreeNodeModel> getChildren() {
        return children;
    }

    public void setChildren(List<TreeNodeModel> children) {
        this.children = children;
    }
}
