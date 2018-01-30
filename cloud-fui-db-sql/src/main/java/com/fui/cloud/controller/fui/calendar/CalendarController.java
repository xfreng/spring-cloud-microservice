package com.fui.cloud.controller.fui.calendar;

import com.fui.cloud.controller.AbstractSuperController;
import com.fui.cloud.service.fui.calendar.CalendarService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(value = "/api/fui/calendar")
public class CalendarController extends AbstractSuperController {
    @Autowired
    private CalendarService calendarService;

    @GetMapping(value = "/query")
    public List<Map<String, Object>> query() {
        return calendarService.query();
    }

    @GetMapping(value = "/getCalendarById/{id}")
    public Map<String, Object> getCalendarById(@PathVariable String id) {
        return calendarService.getCalendarById(id);
    }

    @PostMapping(value = "/addCalendar/{data}")
    public boolean addCalendar(@PathVariable String data) {
        return calendarService.addCalendar(data);
    }

    @DeleteMapping(value = "/deleteCalendarById/{id}")
    public boolean deleteCalendarById(@PathVariable String id) {
        return calendarService.deleteCalendarById(id);
    }

    @PostMapping(value = "/updateCalendarById/{data}")
    public boolean updateCalendarById(@PathVariable String data) {
        return calendarService.updateCalendarById(data);
    }
}
