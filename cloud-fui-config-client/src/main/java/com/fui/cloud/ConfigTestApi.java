package com.fui.cloud;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.context.config.annotation.RefreshScope;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @Title 配置测试
 * @Author sf.xiong
 * @Date 2017-12-14
 */
@RefreshScope
@RestController
public class ConfigTestApi {

    @Value("${search.name}")
    private String name;
    @Value("${search.url}")
    private String url;
    @Value("${search.location}")
    private String location;

    @RequestMapping("/baidu-info")
    public String getSearchInfo() {
        return "从Github仓库中获取得到百度搜索信息：【" + location + "," + "," + url + "," + name + "】";
    }
}
