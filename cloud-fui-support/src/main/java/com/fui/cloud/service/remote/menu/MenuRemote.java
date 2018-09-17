package com.fui.cloud.service.remote.menu;

import com.alibaba.fastjson.JSONObject;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@FeignClient(value = "fui-db-sql")
@RequestMapping("/api/fui/menu")
public interface MenuRemote {

    @GetMapping(value = "/query/{userId}/{pid}")
    List<Map<String, Object>> query(@PathVariable("userId") Long userId, @PathVariable("pid") String pid);

    @GetMapping(value = "/queryMenuNodeById/{pid}")
    List queryMenuNodeById(@PathVariable("pid") String pid);

    @GetMapping(value = "/queryMenuNodeBySelective/{params}")
    List<JSONObject> queryMenuNodeBySelective(@PathVariable("params") String params);

    @GetMapping(value = "/loadMenuNodePage/{pageNum}/{pageSize}/{key}/{pid}")
    JSONObject loadMenuNodePage(@PathVariable("pageNum") Integer pageNum, @PathVariable("pageSize") Integer pageSize, @PathVariable("key") String key, @PathVariable("pid") String pid);

    @GetMapping(value = "/queryShortcut/{pageNum}/{pageSize}/{key}/{userId}")
    JSONObject queryShortcut(@PathVariable("pageNum") Integer pageNum, @PathVariable("pageSize") Integer pageSize, @PathVariable("key") String key, @PathVariable("userId") Long userId);

    @PostMapping(value = "/saveMenu/{info}/{data}")
    int saveMenu(@PathVariable("info") String info, @PathVariable("data") String data);

    @DeleteMapping(value = "/deleteMenu/{userId}/{data}")
    void deleteMenu(@PathVariable("userId") Long userId, @PathVariable("data") String data);

    @PutMapping(value = "/updateMenu/{info}/{data}")
    void updateMenu(@PathVariable("info") String info, @PathVariable("data") String data);

    @PostMapping(value = "/saveShortcut/{userId}/{data}")
    int saveShortcut(@PathVariable("userId") Long userId, @PathVariable("data") String data);

    @DeleteMapping(value = "/deleteShortcut/{data}")
    void deleteShortcut(@PathVariable("data") String data);
}
