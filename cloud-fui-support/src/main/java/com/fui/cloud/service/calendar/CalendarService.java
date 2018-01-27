package com.fui.cloud.service.calendar;

import com.alibaba.fastjson.JSONObject;
import com.fui.cloud.enums.AppId;
import com.fui.cloud.service.AbstractSuperService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service("calendarService")
public class CalendarService extends AbstractSuperService {

    public List query() {
        return getResult(AppId.getName(1), "/calendar/query", List.class);
    }

    /**
     * @param id
     */
    public JSONObject getCalendarById(String id) {
        return getResult(AppId.getName(1), "/calendar/getCalendarById/{id}", JSONObject.class, id);
    }

    /**
     * @param data
     */
    public boolean addCalendar(JSONObject data) {
        return postResult(AppId.getName(1), "/calendar/addCalendar/{data}", Boolean.class, data.toJSONString());
    }

    /**
     * @param id
     */
    public boolean deleteCalendarById(String id) {
        return postResult(AppId.getName(1), "/calendar/deleteCalendarById/{id}", Boolean.class, id);
    }

    /**
     * @param data
     */
    public boolean updateCalendarById(JSONObject data) {
        return postResult(AppId.getName(1), "/calendar/updateCalendarById/{id}", Boolean.class, data.toJSONString());
    }
}
