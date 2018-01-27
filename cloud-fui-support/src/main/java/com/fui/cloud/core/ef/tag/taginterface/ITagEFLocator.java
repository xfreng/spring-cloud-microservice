package com.fui.cloud.core.ef.tag.taginterface;

/**
 * @Author sf.xiong
 * @Date 2017-12-14
 */
public interface ITagEFLocator extends ITagEF {
    String getRowPos();

    void setRowPos(String var1);

    String getRowSpan();

    void setRowSpan(String var1);

    String getColPos();

    void setColPos(String var1);

    String getColSpan();

    void setColSpan(String var1);

    StringBuffer markPostion();
}
