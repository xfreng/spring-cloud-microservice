package com.fui.cloud.core.ef.tag;

import com.fui.cloud.core.ef.tag.tagabstract.TagEFLocatorBase;
import com.fui.cloud.core.ef.tag.taginfo.TagAttrInfoAnnotation;
import com.fui.cloud.core.ef.tag.taginfo.TagInfoAnnotation;
import com.fui.cloud.core.ef.tag.taginterface.ITagEFDatabinding;
import com.fui.cloud.core.ef.tag.taginterface.ITagEFWidget;

import javax.servlet.jsp.JspException;
import javax.servlet.jsp.JspWriter;
import java.io.IOException;

@TagInfoAnnotation(
        tagName = "EFTree",
        desc = "树"
)
public class TagEFTree extends TagEFLocatorBase implements ITagEFWidget, ITagEFDatabinding {
    private static final long serialVersionUID = 8000608986019149858L;
    @TagAttrInfoAnnotation(
            attrDesc = "样式信息"
    )
    private String style = "";
    @TagAttrInfoAnnotation(
            attrDesc = "标识ID",
            attrPrior = "0",
            attrRequired = true
    )
    protected String id;
    @TagAttrInfoAnnotation(
            attrDesc = "显示值"
    )
    protected String text;
    @TagAttrInfoAnnotation(
            attrDesc = ""
    )
    protected String model;
    @TagAttrInfoAnnotation(
            attrDesc = "config函数值"
    )
    protected String configFunc;
    @TagAttrInfoAnnotation(
            attrDesc = "类型"
    )
    protected String type = "tree";
    @TagAttrInfoAnnotation(
            attrDesc = "树节点图标在EiInfo的字段名"
    )
    protected String eiIconSrc = "";
    @TagAttrInfoAnnotation(
            attrDesc = "是否启用树的搜索功能"
    )
    private String useSearch = "false";
    @TagAttrInfoAnnotation(
            attrDesc = "其它的html属性、事件"
    )
    private String etc = "";
    private String bindId = "";
    private String rightMenuDiv = "";
    private String menuDepth = "1";

    public TagEFTree() {
    }

    public String getRightMenuDiv() {
        return this.rightMenuDiv;
    }

    public void setRightMenuDiv(String rightMenuDiv) {
        this.rightMenuDiv = rightMenuDiv;
    }

    public String getId() {
        return this.id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getText() {
        return this.text;
    }

    public void setText(String text) {
        this.text = text;
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

    public String getType() {
        return this.type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getStyle() {
        return this.style;
    }

    public void setStyle(String style) {
        this.style = style;
    }

    public String getEiIconSrc() {
        return this.eiIconSrc;
    }

    public void setEiIconSrc(String eiIconSrc) {
        this.eiIconSrc = eiIconSrc;
    }

    public String getUseSearch() {
        return this.useSearch;
    }

    public void setUseSearch(String useSearch) {
        this.useSearch = useSearch;
    }

    public int doStartTag() throws JspException {
        if (this.getTagVersion().equalsIgnoreCase("2.0")) {
            new StringBuffer();
            StringBuffer inputStr = this.markPostion();
            inputStr.append("<div id='" + this.id + "Div' style='" + this.style + "' ");
            if (this.etc != null) {
                inputStr.append(this.etc.trim());
            }

            inputStr.append(" >");
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
        JspWriter out = this.pageContext.getOut();

        try {
            if (this.type.equalsIgnoreCase("tree")) {
                out.println("<div id='" + this.id + "'>");
                out.println("<script>");
                out.println("var " + this.id + " = new EFTree(" + this.model + ", \"" + this.id + "\", \"" + this.text + "\",\"" + this.rightMenuDiv + "\",\"" + this.menuDepth + "\");");
            } else if (this.type.equalsIgnoreCase("menuTree")) {
                out.println("<div id='" + this.id + "'>");
                out.println("<script> var " + this.id + " = {};$(document).ready(function(){");
                out.println(this.id + " = new EFMenuTree(" + this.model + ", \"" + this.id + "\", \"" + this.text + "\");");
            }

            if (!this.eiIconSrc.trim().equals("")) {
                out.println(this.model + ".eiIcon(" + "\"" + this.eiIconSrc + "\");");
            }

            out.println("$('#" + this.id + "').empty(); ");
            if (this.useSearch.equalsIgnoreCase("true") && this.type.equalsIgnoreCase("tree")) {
                out.println(this.id + ".renderSearchBar();");
            }

            if (!this.type.equalsIgnoreCase("menuTree")) {
                if (this.configFunc != null && this.configFunc.trim().length() > 0) {
                    out.println(this.configFunc + "(" + this.id + ");");
                }

                out.println("$('#" + this.id + "').append(" + this.id + ".render() );");
            } else {
                if (this.configFunc != null && this.configFunc.trim().length() > 0) {
                    out.println("if(" + this.id + " instanceof EFTree){" + this.configFunc + "(" + this.id + ");}else{" + this.id + ".configFunc=" + this.configFunc + ";}");
                }

                out.println("if(" + this.id + " instanceof EFTree){" + "$('#" + this.id + "').append(" + this.id + ".render() );}else{" + this.id + ".render(\"" + this.id + "\") ;}");
            }

            if (this.type.equalsIgnoreCase("menuTree")) {
                out.println("});</script>");
            } else {
                out.println("</script>");
            }

            out.println("</div>");
            if (this.getTagVersion().equalsIgnoreCase("2.0")) {
                out.println("</div>");
            }
        } catch (IOException var3) {
            var3.printStackTrace();
        }

        return 6;
    }

    public String getMenuDepth() {
        return this.menuDepth;
    }

    public void setMenuDepth(String menuDepth) {
        this.menuDepth = menuDepth;
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