package com.fui.cloud.dao.fui.organization;

import com.fui.cloud.dao.BaseMapper;
import com.fui.cloud.model.fui.Organization;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface OrganizationMapper extends BaseMapper<Organization, Long> {
    /**
     * 查询指定id对应的权限
     *
     * @param id 主键
     * @return 相匹配的机构信息
     */
    List<Organization> selectByKey(Long id);

    /**
     * 根据机构编码查询机构信息
     *
     * @param orgCode
     * @return 机构信息
     */
    Organization findOrganizationByCode(@Param("orgCode") String orgCode);
}