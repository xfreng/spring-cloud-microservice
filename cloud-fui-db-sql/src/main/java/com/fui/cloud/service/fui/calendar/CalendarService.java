package com.fui.cloud.service.fui.calendar;

import com.alibaba.fastjson.JSONObject;
import com.fui.cloud.dao.fui.calendar.CalendarMapper;
import com.fui.cloud.service.fui.AbstractSuperImplService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.PostConstruct;
import java.util.List;
import java.util.Map;

@Service("calendarService")
@Transactional
public class CalendarService extends AbstractSuperImplService {
    @Autowired
    private CalendarMapper calendarMapper;

    @PostConstruct
    public void initMapper() {
        this.baseMapper = calendarMapper;
    }

    public List<Map<String, Object>> query() {
        return calendarMapper.query();
    }

    /**
     * @param id
     * @return
     */
    public Map<String, Object> getCalendarById(String id) {
        return calendarMapper.getCalendarById(id);
    }

    public boolean addCalendar(String data) {
        return calendarMapper.addCalendar(JSONObject.parseObject(data));
    }

    public boolean deleteCalendarById(String id) {
        return calendarMapper.deleteCalendarById(id);
    }

    public boolean updateCalendarById(String data) {
        return calendarMapper.updateCalendarById(JSONObject.parseObject(data));
    }
}
