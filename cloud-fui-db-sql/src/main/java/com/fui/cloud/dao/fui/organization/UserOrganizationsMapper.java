package com.fui.cloud.dao.fui.organization;

import com.fui.cloud.dao.BaseMapper;
import com.fui.cloud.model.fui.UserOrganizations;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface UserOrganizationsMapper extends BaseMapper<UserOrganizations, Long> {
    /**
     * 根据机构id删除对应的用户机构关联信息
     *
     * @param orgId 机构id
     * @return 删除结果
     */
    int deleteByOrgId(Long orgId);
}