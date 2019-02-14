package com.fui.cloud.service.fui.calendar;

import com.fui.cloud.dao.fui.calendar.CalendarsMapper;
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
    private CalendarsMapper calendarsMapper;

    @PostConstruct
    public void initMapper() {
        this.baseMapper = calendarsMapper;
    }

    public List<Map<String, Object>> query() {
        return calendarsMapper.query();
    }

    /**
     * @param id
     * @return
     */
    public Map<String, Object> getCalendarById(String id) {
        return calendarsMapper.getCalendarById(id);
    }

    public boolean addCalendar(Map<String, Object> param) {
        return calendarsMapper.addCalendar(param);
    }

    public boolean deleteCalendarById(String id) {
        return calendarsMapper.deleteCalendarById(id);
    }

    public boolean updateCalendarById(Map<String, Object> param) {
        return calendarsMapper.updateCalendarById(param);
    }
}
