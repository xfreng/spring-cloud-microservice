package com.fui.cloud.controller.fui.role;

import com.fui.cloud.controller.AbstractSuperController;
import com.fui.cloud.model.fui.Roles;
import com.fui.cloud.service.fui.role.RolesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(value = {"/api/fui/role"})
public class RolesController extends AbstractSuperController {
    @Autowired
    private RolesService rolesService;

    @GetMapping(value = {"/selectByPrimaryKey/{id}"})
    public Roles selectByPrimaryKey(@PathVariable Long id) {
        return rolesService.selectByPrimaryKey(id);
    }

    @GetMapping(value = {"/getUserRights/{userId}"})
    public List<String> getUserRights(@PathVariable Long userId) {
        return rolesService.getUserRights(userId);
    }

    @GetMapping(value = {"/getRolesList"})
    public List<Roles> getRolesList(@RequestParam Map<String, Object> params) {
        return rolesService.getRolesList(params);
    }
}