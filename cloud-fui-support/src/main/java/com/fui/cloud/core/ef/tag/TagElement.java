package com.fui.cloud.core.ef.tag;

import com.fui.cloud.core.ef.tag.taginterface.ITagEFLayout;
import org.apache.commons.lang.StringUtils;

import javax.servlet.jsp.tagext.Tag;

/**
 * @Author sf.xiong
 * @Date 2017-12-14
 */
public class TagElement {
    private String rowPos = " ";
    private String rowSpan = "1";
    private String colPos = " ";
    private String ratio = "";
    private String colSpan = "1";
    private String content = "";

    public TagElement(String rowPos, String colPos, String content) {
        this.rowPos = rowPos;
        this.colPos = colPos;
        this.content = content;
    }

    public TagElement(String rowPos, String colPos, String rowSpan, String colSpan) {
        this.rowPos = rowPos;
        this.colPos = colPos;
        this.rowSpan = rowSpan;
        this.colSpan = colSpan;
    }

    public String getColPos() {
        return this.colPos;
    }

    public void setColPos(String colPos) {
        this.colPos = colPos;
    }

    public String getColSpan() {
        return this.colSpan;
    }

    public void setColSpan(String colSpan) {
        this.colSpan = colSpan;
    }

    public String getContent() {
        return this.content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getRatio() {
        return this.ratio;
    }

    public void setRatio(String ratio) {
        this.ratio = ratio;
    }

    public String getRowPos() {
        return this.rowPos;
    }

    public void setRowPos(String rowPos) {
        this.rowPos = rowPos;
    }

    public String getRowSpan() {
        return this.rowSpan;
    }

    public void setRowSpan(String rowSpan) {
        this.rowSpan = rowSpan;
    }

    public void addToParent(ITagEFLayout parent) {
        boolean isFixRow = StringUtils.isNotBlank(this.getRowPos());
        boolean isFixCol = StringUtils.isNotBlank(this.getColPos());
        if (isFixRow && isFixCol) {
            parent.addFixPos(this);
        }

        if (isFixRow && !isFixCol) {
            parent.addFixRow(this);
        }

        if (!isFixRow && isFixCol) {
            parent.addFixCol(this);
        }

        if (!isFixRow && !isFixCol) {
            parent.addFreePos(this);
        }

    }

    public StringBuffer addToParent(Tag tag, StringBuffer inputStr) {
        if (tag != null && tag instanceof ITagEFLayout) {
            ITagEFLayout parent = (ITagEFLayout) tag;
            String seqId = String.valueOf(parent.getSeqId());
            this.setContent(seqId);
            inputStr.append("##subnode of tageflayout##" + seqId + "##pos of tageflayout##");
            this.addToParent(parent);
        }

        return inputStr;
    }
}
