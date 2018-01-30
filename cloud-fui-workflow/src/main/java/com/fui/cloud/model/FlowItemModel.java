package com.fui.cloud.model;

import java.io.Serializable;
import java.util.Map;

public class FlowItemModel implements Serializable {
	private static final long serialVersionUID = 1L;
	private String id;
	private String taskId;
	private String name;
	private String status;
	private String description;
	private Map<String, Object> formProperties;

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getTaskId() {
		return taskId;
	}

	public void setTaskId(String taskId) {
		this.taskId = taskId;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public Map<String, Object> getFormProperties() {
		return formProperties;
	}

	public void setFormProperties(Map<String, Object> formProperties) {
		this.formProperties = formProperties;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

}
