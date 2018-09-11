package com.fui.cloud.service.remote.calendar;

import com.alibaba.fastjson.JSONObject;
import org.springframework.cloud.netflix.feign.FeignClient;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@FeignClient(value = "fui-db-sql")
@RequestMapping("/api/fui/calendar")
public interface CalendarRemote {

    @GetMapping(value = "/query")
    List<Map<String, Object>> query();

    @GetMapping(value = "/getCalendarById/{id}")
    JSONObject getCalendarById(@PathVariable("id") String id);

    @PostMapping(value = "/addCalendar/{data}")
    boolean addCalendar(@PathVariable("data") String data);

    @DeleteMapping("/deleteCalendarById/{id}")
    boolean deleteCalendarById(@PathVariable("id") String id);

    @PutMapping(value = "/updateCalendarById/{data}")
    boolean updateCalendarById(@PathVariable("data") String data);
}
