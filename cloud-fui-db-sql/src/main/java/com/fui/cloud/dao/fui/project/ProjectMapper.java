package com.fui.cloud.dao.fui.project;

import com.fui.cloud.dao.BaseMapper;
import com.fui.cloud.model.fui.Project;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface ProjectMapper extends BaseMapper<Project, Long> {
    /**
     * 查询全部数据
     *
     * @return list
     */
    List<Project> selectAll();
}