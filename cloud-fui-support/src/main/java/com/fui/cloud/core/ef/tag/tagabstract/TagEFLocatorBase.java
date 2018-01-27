package com.fui.cloud.core.ef.tag.tagabstract;

import com.fui.cloud.core.ef.tag.TagElement;
import com.fui.cloud.core.ef.tag.taginterface.ITagEFLocator;

import javax.servlet.jsp.tagext.Tag;

/**
 * @Author sf.xiong
 * @Date 2017-12-14
 */
public abstract class TagEFLocatorBase extends TagEFBase implements ITagEFLocator {
    protected String rowPos = null;
    protected String rowSpan = "1";
    protected String colPos = null;
    protected String colSpan = "1";

    public TagEFLocatorBase() {
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

    public StringBuffer markPostion() {
        StringBuffer inputStr = new StringBuffer();
        Tag tag = this.getParent();
        TagElement te = new TagElement(this.rowPos, this.colPos, this.rowSpan, this.colSpan);
        inputStr = te.addToParent(tag, inputStr);
        return inputStr;
    }
}