package com.fui.cloud.core.ef.tag.tagabstract;

import com.fui.cloud.core.ef.tag.taginterface.ITagEF;
import org.apache.commons.lang.StringUtils;

import javax.servlet.jsp.tagext.TagSupport;

/**
 * @Author sf.xiong
 * @Date 2017-12-14
 */
public abstract class TagEFBase extends TagSupport implements ITagEF {
    public String version = "";

    public TagEFBase() {
    }

    public String getVersion() {
        return this.version;
    }

    public void setVersion(String version) {
        this.version = version;
    }

    public String getTagVersion() {
        if (StringUtils.isBlank(this.version)) {
            String contextVersion = (String) this.pageContext.getAttribute("contextVersion");
            if (contextVersion == null) {
                return "1.0";
            } else {
                return contextVersion;
            }
        } else {
            return this.version;
        }
    }
}

