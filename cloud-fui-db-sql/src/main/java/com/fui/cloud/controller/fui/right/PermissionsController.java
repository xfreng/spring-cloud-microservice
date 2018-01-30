package com.fui.cloud.controller.fui.right;

import com.fui.cloud.controller.AbstractSuperController;
import com.fui.cloud.model.fui.Permissions;
import com.fui.cloud.service.fui.right.PermissionsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = {"/api/fui/right"})
public class PermissionsController extends AbstractSuperController {
    @Autowired
    private PermissionsService permissionsService;

    @GetMapping(value = {"/selectByPrimaryKey/{id}"})
    public Permissions selectByPrimaryKey(@PathVariable Long id) {
        return permissionsService.selectByPrimaryKey(id);
    }

    @GetMapping(value = {"/selectAllRight"})
    public List<Permissions> selectAllRight() {
        return permissionsService.selectAllRight();
    }
}