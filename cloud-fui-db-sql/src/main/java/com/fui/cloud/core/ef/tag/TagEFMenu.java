package com.fui.cloud.core.ef.tag;

import com.fui.cloud.core.ef.tag.tagabstract.TagEFLocatorBase;
import com.fui.cloud.core.ef.tag.taginfo.TagAttrInfoAnnotation;
import com.fui.cloud.core.ef.tag.taginfo.TagInfoAnnotation;
import com.fui.cloud.core.ef.tag.taginterface.ITagEFDatabinding;
import com.fui.cloud.core.ef.tag.taginterface.ITagEFWidget;

import javax.servlet.jsp.JspException;
import javax.servlet.jsp.JspWriter;
import java.io.IOException;

/**
 * @Title 菜单标签
 * @Author sf.xiong
 * @Date 2017/12/14
 */
@TagInfoAnnotation(
        tagName = "EFMenu",
        desc = "菜单"
)
public class TagEFMenu extends TagEFLocatorBase implements ITagEFWidget, ITagEFDatabinding {
    @TagAttrInfoAnnotation(
            attrDesc = "标识ID"
    )
    private String id;
    @TagAttrInfoAnnotation(
            attrDesc = "样式"
    )
    private String model;
    @TagAttrInfoAnnotation(
            attrDesc = "config函数值"
    )
    private String configFunc;
    private String etc = "";
    @TagAttrInfoAnnotation(
            attrDesc = "数据绑定ID",
            supportVersion = "2.0"
    )
    private String bindId = "";

    public TagEFMenu() {
    }

    public String getId() {
        return this.id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getModel() {
        return this.model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public String getConfigFunc() {
        return this.configFunc;
    }

    public void setConfigFunc(String configFunc) {
        this.configFunc = configFunc;
    }

    public int doStartTag() throws JspException {
        if (this.getTagVersion().equalsIgnoreCase("2.0")) {
            new StringBuffer();
            StringBuffer inputStr = this.markPostion();
            JspWriter out = this.pageContext.getOut();

            try {
                out.println(inputStr);
            } catch (IOException var4) {
                var4.printStackTrace();
            }
        }

        return 1;
    }

    public int doEndTag() throws JspException {
        try {
            JspWriter out = this.pageContext.getOut();
            out.println("<div id='" + this.id + "'></div>");
            out.println("<script>");
            out.println("var " + this.id + " = new EFMenu(" + this.model + ", \"" + this.id + "\", \"" + this.id + "\");");
            if (this.configFunc != null && this.configFunc.trim().length() > 0) {
                out.println(this.configFunc + "(" + this.id + ");");
            }

            out.println("$('#" + this.id + "').append( " + this.id + ".render() );");
            out.println("</script>");
            return 6;
        } catch (IOException var2) {
            var2.printStackTrace();
            throw new JspException("IOException");
        }
    }

    public String getEtc() {
        return this.etc;
    }

    public void setEtc(String etc) {
        this.etc = etc;
    }

    public String getBindId() {
        return this.bindId;
    }

    public void setBindId(String bindId) {
        this.bindId = bindId;
    }
}
