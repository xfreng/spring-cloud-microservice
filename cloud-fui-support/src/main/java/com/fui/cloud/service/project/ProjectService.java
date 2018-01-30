package com.fui.cloud.service.project;

import com.fui.cloud.enums.AppId;
import com.fui.cloud.service.AbstractSuperService;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * @Title 框架配置相关业务类
 * @Author sf.xiong
 * @Date 2017-12-23
 */
@Service("projectService")
public class ProjectService extends AbstractSuperService {

    public List selectAll() {
        return getResult(AppId.getName(1), "/project/selectAll", List.class);
    }
}
