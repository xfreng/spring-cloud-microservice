package com.fui.cloud.service.calendar;

import com.alibaba.fastjson.JSONObject;
import com.fui.cloud.service.AbstractSuperService;
import com.fui.cloud.service.remote.calendar.CalendarRemote;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service("calendarService")
public class CalendarService extends AbstractSuperService {

    @Autowired
    private CalendarRemote calendarRemote;

    public List<Map<String, Object>> query() {
        return calendarRemote.query();
    }

    /**
     * @param id
     */
    public JSONObject getCalendarById(String id) {
        return calendarRemote.getCalendarById(id);
    }

    /**
     * @param data
     */
    public boolean addCalendar(JSONObject data) {
        return calendarRemote.addCalendar(data.toJSONString());
    }

    /**
     * @param id
     */
    public boolean deleteCalendarById(String id) {
        return calendarRemote.deleteCalendarById(id);
    }

    /**
     * @param data
     */
    public boolean updateCalendarById(JSONObject data) {
        return calendarRemote.updateCalendarById(data.toJSONString());
    }
}
