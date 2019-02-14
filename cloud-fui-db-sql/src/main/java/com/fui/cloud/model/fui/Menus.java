package com.fui.cloud.model.fui;

import com.fui.cloud.model.BaseModel;

import java.util.ArrayList;
import java.util.List;

/**
 * MenuTree
 */
public class Menus extends BaseModel {
    private static final long serialVersionUID = 1L;
    private String recCreator = " ";
    private String recCreateTime = " ";
    private String recRevisor = " ";
    private String recReviseTime = " ";
    private String archiveFlag = " ";
    private String pid = " ";
    private String id = " ";
    private String text = " ";
    private boolean isLeaf = false;
    private boolean expanded = false;
    private String type = " ";
    private String url = " ";
    private String sortId = " ";
    private String param = " ";
    private String image = " ";
    private List<Menus> children = new ArrayList<>();

    public String getRecCreator() {
        return recCreator;
    }

    public void setRecCreator(String recCreator) {
        this.recCreator = recCreator;
    }

    public String getRecCreateTime() {
        return recCreateTime;
    }

    public void setRecCreateTime(String recCreateTime) {
        this.recCreateTime = recCreateTime;
    }

    public String getRecRevisor() {
        return recRevisor;
    }

    public void setRecRevisor(String recRevisor) {
        this.recRevisor = recRevisor;
    }

    public String getRecReviseTime() {
        return recReviseTime;
    }

    public void setRecReviseTime(String recReviseTime) {
        this.recReviseTime = recReviseTime;
    }

    public String getArchiveFlag() {
        return archiveFlag;
    }

    public void setArchiveFlag(String archiveFlag) {
        this.archiveFlag = archiveFlag;
    }

    public String getPid() {
        return pid;
    }

    public void setPid(String pid) {
        this.pid = pid;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public boolean isLeaf() {
        return isLeaf;
    }

    public void setLeaf(boolean isLeaf) {
        this.isLeaf = isLeaf;
    }

    public boolean isExpanded() {
        return expanded;
    }

    public void setExpanded(boolean expanded) {
        this.expanded = expanded;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getSortId() {
        return sortId;
    }

    public void setSortId(String sortId) {
        this.sortId = sortId;
    }

    public String getParam() {
        return param;
    }

    public void setParam(String param) {
        this.param = param;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public List<Menus> getChildren() {
        return children;
    }

    public void setChildren(List<Menus> children) {
        this.children = children;
    }

}