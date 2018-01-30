package com.fui.cloud.model.fui;

import com.fui.cloud.model.BaseModel;

public class Organization extends BaseModel {
    /**
     * This field was generated by MyBatis Generator.
     * This field corresponds to the database column fui_organization.id
     *
     * @mbggenerated
     */
    private Long id;

    /**
     * This field was generated by MyBatis Generator.
     * This field corresponds to the database column fui_organization.parent_id
     *
     * @mbggenerated
     */
    private Long parentId;

    /**
     * This field was generated by MyBatis Generator.
     * This field corresponds to the database column fui_organization.code
     *
     * @mbggenerated
     */
    private String code;

    /**
     * This field was generated by MyBatis Generator.
     * This field corresponds to the database column fui_organization.name
     *
     * @mbggenerated
     */
    private String name;

    /**
     * This field was generated by MyBatis Generator.
     * This field corresponds to the database column fui_organization.users
     *
     * @mbggenerated
     */
    private String users;

    /**
     * This method was generated by MyBatis Generator.
     * This method returns the value of the database column fui_organization.id
     *
     * @return the value of fui_organization.id
     *
     * @mbggenerated
     */
    public Long getId() {
        return id;
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method sets the value of the database column fui_organization.id
     *
     * @param id the value for fui_organization.id
     *
     * @mbggenerated
     */
    public void setId(Long id) {
        this.id = id;
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method returns the value of the database column fui_organization.parent_id
     *
     * @return the value of fui_organization.parent_id
     *
     * @mbggenerated
     */
    public Long getParentId() {
        return parentId;
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method sets the value of the database column fui_organization.parent_id
     *
     * @param parentId the value for fui_organization.parent_id
     *
     * @mbggenerated
     */
    public void setParentId(Long parentId) {
        this.parentId = parentId;
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method returns the value of the database column fui_organization.code
     *
     * @return the value of fui_organization.code
     *
     * @mbggenerated
     */
    public String getCode() {
        return code;
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method sets the value of the database column fui_organization.code
     *
     * @param code the value for fui_organization.code
     *
     * @mbggenerated
     */
    public void setCode(String code) {
        this.code = code == null ? null : code.trim();
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method returns the value of the database column fui_organization.name
     *
     * @return the value of fui_organization.name
     *
     * @mbggenerated
     */
    public String getName() {
        return name;
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method sets the value of the database column fui_organization.name
     *
     * @param name the value for fui_organization.name
     *
     * @mbggenerated
     */
    public void setName(String name) {
        this.name = name == null ? null : name.trim();
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method returns the value of the database column fui_organization.users
     *
     * @return the value of fui_organization.users
     *
     * @mbggenerated
     */
    public String getUsers() {
        return users;
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method sets the value of the database column fui_organization.users
     *
     * @param users the value for fui_organization.users
     *
     * @mbggenerated
     */
    public void setUsers(String users) {
        this.users = users == null ? null : users.trim();
    }
}