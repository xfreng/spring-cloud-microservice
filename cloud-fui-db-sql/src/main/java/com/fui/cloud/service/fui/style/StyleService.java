package com.fui.cloud.service.fui.style;

import com.alibaba.fastjson.JSONObject;
import com.fui.cloud.dao.fui.style.StyleMapper;
import com.fui.cloud.service.fui.AbstractSuperImplService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

/**
 * @Title 用户角色相关业务类
 * @Author sf.xiong
 * @Date 2019-01-29
 */
@Service("styleService")
@Transactional
public class StyleService extends AbstractSuperImplService<Map<String, Object>, String> {

    @Autowired
    private StyleMapper styleMapper;

    @Override
    public void initMapper() {
        this.baseMapper = styleMapper;
    }

    public boolean updateMenuTypeAndStyleByUserId(String data) {
        Map<String, Object> beanMap = JSONObject.parseObject(data);
        return styleMapper.updateMenuTypeAndStyleByUserId(beanMap);
    }
}
