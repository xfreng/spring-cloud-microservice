package com.fui.cloud.controller.fui.project;

import com.fui.cloud.controller.AbstractSuperController;
import com.fui.cloud.model.fui.Project;
import com.fui.cloud.service.fui.project.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = {"/api/fui/project"})
public class ProjectController extends AbstractSuperController {
    @Autowired
    private ProjectService projectService;

    @GetMapping(value = {"/selectAll"})
    public List<Project> selectAll() {
        return projectService.selectAll();
    }
}