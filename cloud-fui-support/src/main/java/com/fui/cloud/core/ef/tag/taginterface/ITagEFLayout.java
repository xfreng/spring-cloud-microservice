package com.fui.cloud.core.ef.tag.taginterface;

import com.fui.cloud.core.ef.tag.TagElement;

/**
 * @Author sf.xiong
 * @Date 2017-12-14
 */
public interface ITagEFLayout extends ITagEF {
    String getRow();

    void setRow(String var1);

    String getRows();

    void setRows(String var1);

    String getCol();

    void setCol(String var1);

    String getCols();

    void setCols(String var1);

    int getSeqId();

    void addFixPos(TagElement var1);

    void addFixRow(TagElement var1);

    void addFixCol(TagElement var1);

    void addFreePos(TagElement var1);
}
