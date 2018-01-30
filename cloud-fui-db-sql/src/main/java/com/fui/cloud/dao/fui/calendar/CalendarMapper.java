package com.fui.cloud.dao.fui.calendar;

import com.fui.cloud.dao.BaseMapper;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

@Mapper
public interface CalendarMapper extends BaseMapper<Map<String, Object>, String> {
    List<Map<String, Object>> query();

    Map<String, Object> getCalendarById(@Param("id") String id);

    boolean addCalendar(Map<String, Object> beanMap);

    boolean deleteCalendarById(@Param("id") String id);

    boolean updateCalendarById(Map<String, Object> beanMap);
}
