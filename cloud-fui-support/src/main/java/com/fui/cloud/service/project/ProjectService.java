package com.fui.cloud.service.project;

import com.fui.cloud.service.AbstractSuperService;
import com.fui.cloud.service.remote.project.ProjectRemote;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * @Title 框架配置相关业务类
 * @Author sf.xiong
 * @Date 2017-12-23
 */
@Service("projectService")
public class ProjectService extends AbstractSuperService {

    @Autowired
    private ProjectRemote projectRemote;

    public List selectAll() {
        return projectRemote.selectAll();
    }
}
