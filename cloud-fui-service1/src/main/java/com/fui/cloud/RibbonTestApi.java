package com.fui.cloud;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

/**
 * @Title 测试 api
 * @Author sf.xiong
 * @Date 2017-12-14
 */
@RestController
@RequestMapping(value = "/ribbon")
public class RibbonTestApi {

    /**
     * 获取git地址API
     *
     * @return 相关信息
     */
    @RequestMapping(value = "/name", method = RequestMethod.GET)
    public String getMyBlogNameApi() {
        return "xfreng - https://github.com/xfreng/spring-cloud-microservice" + "该服务器端口8071";
    }
}
