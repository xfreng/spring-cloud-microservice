package com.fui.cloud.portal.filter;

import com.fui.cloud.common.CommonConstants;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletRequestWrapper;
import java.io.UnsupportedEncodingException;

/**
 * @Title GET 请求对象装饰
 * @Author sf.xiong on 2017/08/07.
 */
public class GetRequestDecorator extends HttpServletRequestWrapper {

    private static Logger logger = LoggerFactory.getLogger(GetRequestDecorator.class);

    private String charset = CommonConstants.DEFAULT_CHARACTER;

    public GetRequestDecorator(HttpServletRequest request) {
        this(request, CommonConstants.DEFAULT_CHARACTER);
    }

    public GetRequestDecorator(HttpServletRequest request, String character) {
        super(request);
        this.charset = character;
    }

    /**
     * 根据参数名获取参数值
     *
     * @param name
     * @return
     */
    public String getParameter(String name) {
        String value = super.getParameter(name);
        if (StringUtils.isBlank(value)) {
            return "";
        }
        return conventCharacter(name, value);
    }

    /**
     * 根据name 获取多value值
     *
     * @param name
     * @return
     */
    public String[] getParameterValues(String name) {
        String[] array = super.getParameterValues(name);
        if (array == null || array.length == 0) {
            return array;
        }

        for (int i = 0; i < array.length; i++) {
            array[i] = conventCharacter(name, array[i]);
        }
        return array;
    }

    /**
     * 转换字符串字符集
     *
     * @param name
     * @param value
     * @return
     */
    private String conventCharacter(String name, String value) {
        try {
            value = new String(value.getBytes(charset));
        } catch (UnsupportedEncodingException e) {
            logger.error("根据{} 获取参数值转换字符串异常", name);
            value = super.getParameter(name);
        }
        return value;
    }
}