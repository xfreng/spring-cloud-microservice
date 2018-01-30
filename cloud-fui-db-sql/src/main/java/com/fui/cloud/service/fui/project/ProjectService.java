package com.fui.cloud.service.fui.project;

import com.fui.cloud.dao.fui.project.ProjectMapper;
import com.fui.cloud.model.fui.Project;
import com.fui.cloud.service.fui.AbstractSuperImplService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.PostConstruct;
import java.util.List;

/**
 * @Title 框架配置相关业务类
 * @Author sf.xiong
 * @Date 2017-12-23
 */
@Service("projectService")
@Transactional
public class ProjectService extends AbstractSuperImplService {
    @Autowired
    private ProjectMapper projectMapper;

    @PostConstruct
    public void initMapper() {
        this.baseMapper = projectMapper;
    }

    public List<Project> selectAll() {
        return projectMapper.selectAll();
    }
}
