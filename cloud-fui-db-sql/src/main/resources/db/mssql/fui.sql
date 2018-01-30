/*
 Navicat Premium Data Transfer

 Source Server         : mssql-192.168.131.128
 Source Server Type    : SQL Server
 Source Server Version : 10004000
 Source Host           : 192.168.131.128,1443:1433
 Source Catalog        : fui
 Source Schema         : dbo

 Target Server Type    : SQL Server
 Target Server Version : 10004000
 File Encoding         : 65001

 Date: 07/09/2017 15:38:49
*/


-- ----------------------------
-- Table structure for fui_calendar
-- ----------------------------
IF EXISTS (SELECT * FROM sys.all_objects WHERE object_id = OBJECT_ID(N'[dbo].[fui_calendar]') AND type IN ('U'))
	DROP TABLE [dbo].[fui_calendar]
;

CREATE TABLE [dbo].[fui_calendar] (
  [id] int NOT NULL,
  [title] nvarchar(100) COLLATE Chinese_PRC_CI_AS NOT NULL,
  [starttime] nvarchar(20) COLLATE Chinese_PRC_CI_AS NOT NULL,
  [endtime] nvarchar(20) COLLATE Chinese_PRC_CI_AS NULL,
  [allday] nvarchar(1) COLLATE Chinese_PRC_CI_AS NOT NULL,
  [color] nvarchar(20) COLLATE Chinese_PRC_CI_AS NULL
)
;

ALTER TABLE [dbo].[fui_calendar] SET (LOCK_ESCALATION = TABLE)
;

EXEC sp_addextendedproperty
'MS_Description', N'主键',
'SCHEMA', N'dbo',
'TABLE', N'fui_calendar',
'COLUMN', N'id'
;

EXEC sp_addextendedproperty
'MS_Description', N'标题',
'SCHEMA', N'dbo',
'TABLE', N'fui_calendar',
'COLUMN', N'title'
;

EXEC sp_addextendedproperty
'MS_Description', N'开始时间',
'SCHEMA', N'dbo',
'TABLE', N'fui_calendar',
'COLUMN', N'starttime'
;

EXEC sp_addextendedproperty
'MS_Description', N'结束时间',
'SCHEMA', N'dbo',
'TABLE', N'fui_calendar',
'COLUMN', N'endtime'
;

EXEC sp_addextendedproperty
'MS_Description', N'是否全天',
'SCHEMA', N'dbo',
'TABLE', N'fui_calendar',
'COLUMN', N'allday'
;

EXEC sp_addextendedproperty
'MS_Description', N'颜色',
'SCHEMA', N'dbo',
'TABLE', N'fui_calendar',
'COLUMN', N'color'
;

EXEC sp_addextendedproperty
'MS_Description', N'日程安排表',
'SCHEMA', N'dbo',
'TABLE', N'fui_calendar'
;


-- ----------------------------
-- Table structure for fui_dict_entry
-- ----------------------------
IF EXISTS (SELECT * FROM sys.all_objects WHERE object_id = OBJECT_ID(N'[dbo].[fui_dict_entry]') AND type IN ('U'))
	DROP TABLE [dbo].[fui_dict_entry]
;

CREATE TABLE [dbo].[fui_dict_entry] (
  [id] int NOT NULL,
  [dict_code] nvarchar(125) COLLATE Chinese_PRC_CI_AS NULL,
  [dict_entry_code] nvarchar(125) COLLATE Chinese_PRC_CI_AS NULL,
  [dict_entry_desc] nvarchar(255) COLLATE Chinese_PRC_CI_AS NULL,
  [dict_entry_sort] bigint NULL
)
;

ALTER TABLE [dbo].[fui_dict_entry] SET (LOCK_ESCALATION = TABLE)
;

EXEC sp_addextendedproperty
'MS_Description', N'字典类型名称',
'SCHEMA', N'dbo',
'TABLE', N'fui_dict_entry',
'COLUMN', N'dict_code'
;

EXEC sp_addextendedproperty
'MS_Description', N'字典明细名称',
'SCHEMA', N'dbo',
'TABLE', N'fui_dict_entry',
'COLUMN', N'dict_entry_code'
;

EXEC sp_addextendedproperty
'MS_Description', N'字典明细描述',
'SCHEMA', N'dbo',
'TABLE', N'fui_dict_entry',
'COLUMN', N'dict_entry_desc'
;

EXEC sp_addextendedproperty
'MS_Description', N'排序标识',
'SCHEMA', N'dbo',
'TABLE', N'fui_dict_entry',
'COLUMN', N'dict_entry_sort'
;

EXEC sp_addextendedproperty
'MS_Description', N'字典详细表',
'SCHEMA', N'dbo',
'TABLE', N'fui_dict_entry'
;


-- ----------------------------
-- Records of [fui_dict_entry]
-- ----------------------------
INSERT INTO [dbo].[fui_dict_entry]  VALUES (N'1', N'LAYOUTSTYLE', N'default', N'default', N'1')
;

INSERT INTO [dbo].[fui_dict_entry]  VALUES (N'3', N'LAYOUTSTYLE', N'pact', N'pact', N'2')
;

INSERT INTO [dbo].[fui_dict_entry]  VALUES (N'4', N'SKINSTYLE', N'default', N'银白色（default）', N'1')
;

INSERT INTO [dbo].[fui_dict_entry]  VALUES (N'5', N'SKINSTYLE', N'bootstrap', N'银灰色（bootstrap）', N'2')
;

INSERT INTO [dbo].[fui_dict_entry]  VALUES (N'6', N'SKINSTYLE', N'pact', N'蓝色（pact）', N'5')
;

INSERT INTO [dbo].[fui_dict_entry]  VALUES (N'7', N'SKINSTYLE', N'black', N'黑色（black）', N'4')
;

INSERT INTO [dbo].[fui_dict_entry]  VALUES (N'8', N'SKINSTYLE', N'red', N'红色（red）', N'3')
;

INSERT INTO [dbo].[fui_dict_entry]  VALUES (N'9', N'SKINSTYLE', N'skyblue', N'青色（skyblue）', N'6')
;


-- ----------------------------
-- Table structure for fui_dict_type
-- ----------------------------
IF EXISTS (SELECT * FROM sys.all_objects WHERE object_id = OBJECT_ID(N'[dbo].[fui_dict_type]') AND type IN ('U'))
	DROP TABLE [dbo].[fui_dict_type]
;

CREATE TABLE [dbo].[fui_dict_type] (
  [id] int NOT NULL,
  [dict_code] nvarchar(125) COLLATE Chinese_PRC_CI_AS NULL,
  [dict_desc] nvarchar(255) COLLATE Chinese_PRC_CI_AS NULL
)
;

ALTER TABLE [dbo].[fui_dict_type] SET (LOCK_ESCALATION = TABLE)
;

EXEC sp_addextendedproperty
'MS_Description', N'字典类型名称',
'SCHEMA', N'dbo',
'TABLE', N'fui_dict_type',
'COLUMN', N'dict_code'
;

EXEC sp_addextendedproperty
'MS_Description', N'字典类型描述',
'SCHEMA', N'dbo',
'TABLE', N'fui_dict_type',
'COLUMN', N'dict_desc'
;

EXEC sp_addextendedproperty
'MS_Description', N'字典主表',
'SCHEMA', N'dbo',
'TABLE', N'fui_dict_type'
;


-- ----------------------------
-- Records of [fui_dict_type]
-- ----------------------------
INSERT INTO [dbo].[fui_dict_type]  VALUES (N'1', N'LAYOUTSTYLE', N'布局风格')
;

INSERT INTO [dbo].[fui_dict_type]  VALUES (N'2', N'SKINSTYLE', N'样式风格')
;


-- ----------------------------
-- Table structure for fui_menu
-- ----------------------------
IF EXISTS (SELECT * FROM sys.all_objects WHERE object_id = OBJECT_ID(N'[dbo].[fui_menu]') AND type IN ('U'))
	DROP TABLE [dbo].[fui_menu]
;

CREATE TABLE [dbo].[fui_menu] (
  [REC_CREATOR] nvarchar(256) COLLATE Chinese_PRC_CI_AS NOT NULL,
  [REC_CREATE_TIME] nvarchar(14) COLLATE Chinese_PRC_CI_AS NOT NULL,
  [REC_REVISOR] nvarchar(256) COLLATE Chinese_PRC_CI_AS NOT NULL,
  [REC_REVISE_TIME] nvarchar(14) COLLATE Chinese_PRC_CI_AS NOT NULL,
  [ARCHIVE_FLAG] nvarchar(1) COLLATE Chinese_PRC_CI_AS NOT NULL,
  [TREE_ENAME] nvarchar(30) COLLATE Chinese_PRC_CI_AS NOT NULL,
  [NODE_ENAME] nvarchar(30) COLLATE Chinese_PRC_CI_AS NOT NULL,
  [NODE_CNAME] nvarchar(80) COLLATE Chinese_PRC_CI_AS NOT NULL,
  [NODE_TYPE] int NOT NULL,
  [NODE_URL] nvarchar(200) COLLATE Chinese_PRC_CI_AS NOT NULL,
  [NODE_SORT_ID] nvarchar(20) COLLATE Chinese_PRC_CI_AS NOT NULL,
  [NODE_PARAM] nvarchar(200) COLLATE Chinese_PRC_CI_AS NOT NULL,
  [NODE_IMAGE_PATH] nvarchar(200) COLLATE Chinese_PRC_CI_AS NOT NULL
)
;

ALTER TABLE [dbo].[fui_menu] SET (LOCK_ESCALATION = TABLE)
;

EXEC sp_addextendedproperty
'MS_Description', N'记录创建责任者',
'SCHEMA', N'dbo',
'TABLE', N'fui_menu',
'COLUMN', N'REC_CREATOR'
;

EXEC sp_addextendedproperty
'MS_Description', N'记录创建时刻',
'SCHEMA', N'dbo',
'TABLE', N'fui_menu',
'COLUMN', N'REC_CREATE_TIME'
;

EXEC sp_addextendedproperty
'MS_Description', N'记录修改责任者',
'SCHEMA', N'dbo',
'TABLE', N'fui_menu',
'COLUMN', N'REC_REVISOR'
;

EXEC sp_addextendedproperty
'MS_Description', N'记录修改时刻',
'SCHEMA', N'dbo',
'TABLE', N'fui_menu',
'COLUMN', N'REC_REVISE_TIME'
;

EXEC sp_addextendedproperty
'MS_Description', N'归档标记',
'SCHEMA', N'dbo',
'TABLE', N'fui_menu',
'COLUMN', N'ARCHIVE_FLAG'
;

EXEC sp_addextendedproperty
'MS_Description', N'节点树英文名',
'SCHEMA', N'dbo',
'TABLE', N'fui_menu',
'COLUMN', N'TREE_ENAME'
;

EXEC sp_addextendedproperty
'MS_Description', N'节点英文名',
'SCHEMA', N'dbo',
'TABLE', N'fui_menu',
'COLUMN', N'NODE_ENAME'
;

EXEC sp_addextendedproperty
'MS_Description', N'节点中文名',
'SCHEMA', N'dbo',
'TABLE', N'fui_menu',
'COLUMN', N'NODE_CNAME'
;

EXEC sp_addextendedproperty
'MS_Description', N'节点类型',
'SCHEMA', N'dbo',
'TABLE', N'fui_menu',
'COLUMN', N'NODE_TYPE'
;

EXEC sp_addextendedproperty
'MS_Description', N'节点URL',
'SCHEMA', N'dbo',
'TABLE', N'fui_menu',
'COLUMN', N'NODE_URL'
;

EXEC sp_addextendedproperty
'MS_Description', N'节点排序标识',
'SCHEMA', N'dbo',
'TABLE', N'fui_menu',
'COLUMN', N'NODE_SORT_ID'
;

EXEC sp_addextendedproperty
'MS_Description', N'节点参数配置',
'SCHEMA', N'dbo',
'TABLE', N'fui_menu',
'COLUMN', N'NODE_PARAM'
;

EXEC sp_addextendedproperty
'MS_Description', N'节点图片路径',
'SCHEMA', N'dbo',
'TABLE', N'fui_menu',
'COLUMN', N'NODE_IMAGE_PATH'
;

EXEC sp_addextendedproperty
'MS_Description', N'项目菜单节点信息',
'SCHEMA', N'dbo',
'TABLE', N'fui_menu'
;


-- ----------------------------
-- Records of [fui_menu]
-- ----------------------------
INSERT INTO [dbo].[fui_menu]  VALUES (N'admin', N'20160830162252', N' ', N' ', N' ', N'$', N'root', N'系统菜单树', N'0', N' ', N'1', N' ', N' ')
;

INSERT INTO [dbo].[fui_menu]  VALUES (N'admin', N'20170105151340', N'admin', N'20170503131811', N' ', N'ACT', N'RACT01', N'模型工作区', N'1', N'/supervisor/workflow/model/index', N'2', N' ', N' ')
;

INSERT INTO [dbo].[fui_menu]  VALUES (N'admin', N'20170105151340', N'admin', N'20170605161921', N' ', N'ACT', N'RACT02', N'流程定义及部署管理', N'1', N'/supervisor/workflow/process/index', N'3', N' ', N' ')
;

INSERT INTO [dbo].[fui_menu]  VALUES (N'admin', N'20170105151340', N'admin', N'20170605161921', N' ', N'ACT', N'RACT03', N'运行中流程', N'1', N'/supervisor/workflow/processinstance/index', N'4', N' ', N' ')
;

INSERT INTO [dbo].[fui_menu]  VALUES (N'admin', N'20170105151207', N' ', N' ', N' ', N'ACT', N'RWPE01', N'流程执行示例', N'1', N' ', N'1', N' ', N' ')
;

INSERT INTO [dbo].[fui_menu]  VALUES (N'admin', N'20090729174958', N'admin', N'20170617165439', N' ', N'ED', N'EDCM', N'代码管理', N'0', N' ', N'3', N' ', N' ')
;

INSERT INTO [dbo].[fui_menu]  VALUES (N'admin', N'20070622161518', N'admin', N'20170617165439', N' ', N'ED', N'EDPI', N'菜单资源管理', N'0', N' ', N'2', N' ', N' ')
;

INSERT INTO [dbo].[fui_menu]  VALUES (N'admin', N'20110518112122', N'admin', N'20170617165439', N' ', N'ED', N'EDPI00', N'项目信息管理', N'1', N'/supervisor/project/index', N'4', N' ', N'css:icon-cogs')
;

INSERT INTO [dbo].[fui_menu]  VALUES (N' ', N' ', N'admin', N'20170617165439', N' ', N'ED', N'EDUM', N'系统设置', N'0', N'', N'1', N' ', N'')
;

INSERT INTO [dbo].[fui_menu]  VALUES (N'admin', N'20090729175218', N'admin', N'20170904160239', N' ', N'EDCM', N'EDCM00', N'字典管理', N'1', N'/supervisor/dict/index', N'1', N' ', N' ')
;

INSERT INTO [dbo].[fui_menu]  VALUES (N'admin', N'20120926091948', N' ', N' ', N' ', N'EDOT', N'EDFB06', N'请假流程入口', N'1', N' ', N' ', N' ', N' ')
;

INSERT INTO [dbo].[fui_menu]  VALUES (N'admin', N'20070622161533', N'admin', N'20070622161828', N' ', N'EDPI', N'EDPI10', N'菜单信息管理', N'1', N'/supervisor/menu/index', N'1', N' ', N' ')
;

INSERT INTO [dbo].[fui_menu]  VALUES (N' ', N' ', N'admin', N'20170617165525', N' ', N'EDUM', N'EDUM01', N'用户管理', N'1', N'/supervisor/user/index', N'1', N' ', N'')
;

INSERT INTO [dbo].[fui_menu]  VALUES (N' ', N' ', N'admin', N'20170617165525', N' ', N'EDUM', N'EDUM02', N'角色管理', N'1', N'/supervisor/role/index', N'2', N' ', N'')
;

INSERT INTO [dbo].[fui_menu]  VALUES (N' ', N' ', N'admin', N'20170904160127', N' ', N'EDUM', N'EDUM03', N'权限管理', N'1', N'/supervisor/right/index', N'3', N' ', N'')
;

INSERT INTO [dbo].[fui_menu]  VALUES (N'admin', N'20170904160213', N' ', N' ', N' ', N'EDUM', N'EDUM04', N'机构管理', N'1', N'/supervisor/organization/index', N'4', N' ', N'')
;

INSERT INTO [dbo].[fui_menu]  VALUES (N'admin', N'20170906170329', N' ', N' ', N' ', N'EDUM', N'EDUM06', N'皮肤设置', N'1', N'/supervisor/style/index', N'6', N' ', N'')
;

INSERT INTO [dbo].[fui_menu]  VALUES (N'admin', N'20130422143551', N'admin', N'20170617165541', N' ', N'EP', N'ED', N'元数据管理', N'0', N' ', N'1', N' ', N' ')
;

INSERT INTO [dbo].[fui_menu]  VALUES (N'admin', N'20170105150848', N' ', N' ', N' ', N'root', N'ACT', N'流程管理', N'0', N' ', N'6', N' ', N' ')
;

INSERT INTO [dbo].[fui_menu]  VALUES (N'admin', N'20161225184150', N'admin', N'20170524153632', N' ', N'root', N'EP', N'系统平台', N'0', N' ', N'1', N' ', N' ')
;


-- ----------------------------
-- Table structure for fui_menu_shortcut
-- ----------------------------
IF EXISTS (SELECT * FROM sys.all_objects WHERE object_id = OBJECT_ID(N'[dbo].[fui_menu_shortcut]') AND type IN ('U'))
	DROP TABLE [dbo].[fui_menu_shortcut]
;

CREATE TABLE [dbo].[fui_menu_shortcut] (
  [id] int NOT NULL,
  [user_id] int NULL,
  [menu_id] nvarchar(30) COLLATE Chinese_PRC_CI_AS NULL,
  [order_no] int NULL,
  [menu_image_path] nvarchar(50) COLLATE Chinese_PRC_CI_AS NULL
)
;

ALTER TABLE [dbo].[fui_menu_shortcut] SET (LOCK_ESCALATION = TABLE)
;

EXEC sp_addextendedproperty
'MS_Description', N'主键',
'SCHEMA', N'dbo',
'TABLE', N'fui_menu_shortcut',
'COLUMN', N'id'
;


-- ----------------------------
-- Table structure for fui_organization
-- ----------------------------
IF EXISTS (SELECT * FROM sys.all_objects WHERE object_id = OBJECT_ID(N'[dbo].[fui_organization]') AND type IN ('U'))
	DROP TABLE [dbo].[fui_organization]
;

CREATE TABLE [dbo].[fui_organization] (
  [id] bigint NOT NULL,
  [parent_id] bigint NULL,
  [code] nvarchar(50) COLLATE Chinese_PRC_CI_AS NULL,
  [name] nvarchar(100) COLLATE Chinese_PRC_CI_AS NULL,
  [users] nvarchar(max) COLLATE Chinese_PRC_CI_AS NULL
)
;

ALTER TABLE [dbo].[fui_organization] SET (LOCK_ESCALATION = TABLE)
;

EXEC sp_addextendedproperty
'MS_Description', N'主键（组织机构编码）',
'SCHEMA', N'dbo',
'TABLE', N'fui_organization',
'COLUMN', N'id'
;

EXEC sp_addextendedproperty
'MS_Description', N'上级组织机构编码',
'SCHEMA', N'dbo',
'TABLE', N'fui_organization',
'COLUMN', N'parent_id'
;

EXEC sp_addextendedproperty
'MS_Description', N'组织机构编码',
'SCHEMA', N'dbo',
'TABLE', N'fui_organization',
'COLUMN', N'code'
;

EXEC sp_addextendedproperty
'MS_Description', N'机构用户',
'SCHEMA', N'dbo',
'TABLE', N'fui_organization',
'COLUMN', N'users'
;


-- ----------------------------
-- Records of [fui_organization]
-- ----------------------------
INSERT INTO [dbo].[fui_organization]  VALUES (N'1', N'-1', N'root', N'组织结构树', N'1')
;

INSERT INTO [dbo].[fui_organization]  VALUES (N'1001', N'1', N'mintech', N'技术部', N'5')
;

INSERT INTO [dbo].[fui_organization]  VALUES (N'1002', N'1', N'test', N'测试部', N'6,7')
;

INSERT INTO [dbo].[fui_organization]  VALUES (N'1003', NULL, N'test', N'test', NULL)
;

INSERT INTO [dbo].[fui_organization]  VALUES (N'1004', NULL, N'test1', N'test1', NULL)
;

INSERT INTO [dbo].[fui_organization]  VALUES (N'1005', NULL, N'test2', N'test2', NULL)
;


-- ----------------------------
-- Table structure for fui_permissions
-- ----------------------------
IF EXISTS (SELECT * FROM sys.all_objects WHERE object_id = OBJECT_ID(N'[dbo].[fui_permissions]') AND type IN ('U'))
	DROP TABLE [dbo].[fui_permissions]
;

CREATE TABLE [dbo].[fui_permissions] (
  [id] bigint NOT NULL,
  [parent_id] bigint NULL,
  [code] nvarchar(100) COLLATE Chinese_PRC_CI_AS NULL,
  [text] nvarchar(30) COLLATE Chinese_PRC_CI_AS NULL,
  [url] nvarchar(200) COLLATE Chinese_PRC_CI_AS NULL,
  [node_type] nvarchar(1) COLLATE Chinese_PRC_CI_AS NULL
)
;

ALTER TABLE [dbo].[fui_permissions] SET (LOCK_ESCALATION = TABLE)
;

EXEC sp_addextendedproperty
'MS_Description', N'shiro标签使用的code',
'SCHEMA', N'dbo',
'TABLE', N'fui_permissions',
'COLUMN', N'code'
;

EXEC sp_addextendedproperty
'MS_Description', N'权限名称',
'SCHEMA', N'dbo',
'TABLE', N'fui_permissions',
'COLUMN', N'text'
;

EXEC sp_addextendedproperty
'MS_Description', N'权限功能点url',
'SCHEMA', N'dbo',
'TABLE', N'fui_permissions',
'COLUMN', N'url'
;

EXEC sp_addextendedproperty
'MS_Description', N'节点类型：0-菜单，1-权限',
'SCHEMA', N'dbo',
'TABLE', N'fui_permissions',
'COLUMN', N'node_type'
;

EXEC sp_addextendedproperty
'MS_Description', N'后台用户权限表',
'SCHEMA', N'dbo',
'TABLE', N'fui_permissions'
;


-- ----------------------------
-- Records of [fui_permissions]
-- ----------------------------
INSERT INTO [dbo].[fui_permissions]  VALUES (N'1001', N'-1', N'root.EP', N'系统平台', N'', N'0')
;

INSERT INTO [dbo].[fui_permissions]  VALUES (N'1002', N'-1', N'root.ACT', N'流程管理', N'', N'0')
;

INSERT INTO [dbo].[fui_permissions]  VALUES (N'100101', N'1001', N'EP.ED', N'元数据管理', N'', N'0')
;

INSERT INTO [dbo].[fui_permissions]  VALUES (N'100201', N'1002', N'ACT.RWPE01', N'流程执行示例', N'', N'0')
;

INSERT INTO [dbo].[fui_permissions]  VALUES (N'100202', N'1002', N'ACT.RACT01', N'模型工作区', N'/supervisor/workflow/model/index', N'0')
;

INSERT INTO [dbo].[fui_permissions]  VALUES (N'100203', N'1002', N'ACT.RACT02', N'流程定义及部署管理', N'/supervisor/workflow/process/index', N'0')
;

INSERT INTO [dbo].[fui_permissions]  VALUES (N'100204', N'1002', N'ACT.RACT03', N'运行中流程', N'/supervisor/workflow/processinstance/index', N'0')
;

INSERT INTO [dbo].[fui_permissions]  VALUES (N'10010101', N'100101', N'ED.EDUM', N'系统设置', N'', N'0')
;

INSERT INTO [dbo].[fui_permissions]  VALUES (N'10010103', N'100101', N'ED.EDPI', N'菜单资源管理', N'', N'0')
;

INSERT INTO [dbo].[fui_permissions]  VALUES (N'10010104', N'100101', N'ED.EDCM', N'代码管理', N'', N'0')
;

INSERT INTO [dbo].[fui_permissions]  VALUES (N'10010105', N'100101', N'ED.EDPI00', N'项目信息管理', N'/supervisor/sys/project', N'0')
;

INSERT INTO [dbo].[fui_permissions]  VALUES (N'10020201', N'100202', N'RACT01.01', N'首页', N'/supervisor/workflow/model/index', N'1')
;

INSERT INTO [dbo].[fui_permissions]  VALUES (N'10020202', N'100202', N'RACT01.02', N'查询流程模型列表', N'/supervisor/workflow/model/list', N'1')
;

INSERT INTO [dbo].[fui_permissions]  VALUES (N'10020203', N'100202', N'RACT01.03', N'创建模型', N'/supervisor/workflow/model/create', N'1')
;

INSERT INTO [dbo].[fui_permissions]  VALUES (N'10020204', N'100202', N'RACT01.04', N'另存模型', N'/supervisor/workflow/model/**/saveas', N'1')
;

INSERT INTO [dbo].[fui_permissions]  VALUES (N'10020205', N'100202', N'RACT01.05', N'删除模型（批量）', N'/supervisor/workflow/model/deleteModel', N'1')
;

INSERT INTO [dbo].[fui_permissions]  VALUES (N'10020206', N'100202', N'RACT01.06', N'复制模型', N'/supervisor/workflow/model/copyModel', N'1')
;

INSERT INTO [dbo].[fui_permissions]  VALUES (N'10020207', N'100202', N'RACT01.07', N'复制到模型模板', N'/supervisor/workflow/model/copyModel2Template', N'1')
;

INSERT INTO [dbo].[fui_permissions]  VALUES (N'10020208', N'100202', N'RACT01.08', N'部署流程', N'/supervisor/workflow/model/deploy/**', N'1')
;

INSERT INTO [dbo].[fui_permissions]  VALUES (N'10020209', N'100202', N'RACT01.09', N'导出模型', N'/supervisor/workflow/model/export/**/**', N'1')
;

INSERT INTO [dbo].[fui_permissions]  VALUES (N'10020210', N'100202', N'RACT01.10', N'删除模型（单个）', N'/supervisor/workflow/model/delete/**', N'1')
;

INSERT INTO [dbo].[fui_permissions]  VALUES (N'10020211', N'100202', N'RACT01.11', N'检查模型key值', N'/supervisor/checkModelKey', N'1')
;

INSERT INTO [dbo].[fui_permissions]  VALUES (N'10020212', N'100202', N'RACT01.12', N'获取模型', N'/supervisor/treeModel/getModel', N'1')
;

INSERT INTO [dbo].[fui_permissions]  VALUES (N'10020213', N'100202', N'RACT01.13', N'检查模型', N'/supervisor/treeModel/checkModelByModelId', N'1')
;

INSERT INTO [dbo].[fui_permissions]  VALUES (N'10020214', N'100202', N'RACT01.14', N'设计器首页', N'/supervisor/designer/tree-modeler', N'1')
;

INSERT INTO [dbo].[fui_permissions]  VALUES (N'10020301', N'100203', N'RACT02.01', N'首页', N'/supervisor/workflow/process/index', N'1')
;

INSERT INTO [dbo].[fui_permissions]  VALUES (N'10020302', N'100203', N'RACT02.02', N'查询流程定义列表', N'/supervisor/workflow/process/list', N'1')
;

INSERT INTO [dbo].[fui_permissions]  VALUES (N'10020303', N'100203', N'RACT02.03', N'读取资源（部署ID）', N'/supervisor/workflow/process/resource/read', N'1')
;

INSERT INTO [dbo].[fui_permissions]  VALUES (N'10020304', N'100203', N'RACT02.04', N'读取资源（流程ID）', N'/supervisor/workflow/process/resource/process-instance', N'1')
;

INSERT INTO [dbo].[fui_permissions]  VALUES (N'10020305', N'100203', N'RACT02.05', N'删除已部署流程', N'/supervisor/workflow/process/delete', N'1')
;

INSERT INTO [dbo].[fui_permissions]  VALUES (N'10020306', N'100203', N'RACT02.06', N'输出跟踪流程信息', N'/supervisor/workflow/process/trace', N'1')
;

INSERT INTO [dbo].[fui_permissions]  VALUES (N'10020307', N'100203', N'RACT02.07', N'读取带跟踪的图片', N'/supervisor/workflow/process/trace/auto/**', N'1')
;

INSERT INTO [dbo].[fui_permissions]  VALUES (N'10020308', N'100203', N'RACT02.08', N'部署流程', N'/supervisor/workflow/process/deploy', N'1')
;

INSERT INTO [dbo].[fui_permissions]  VALUES (N'10020309', N'100203', N'RACT02.09', N'启动流程', N'/supervisor/workflow/process/start-running/**', N'1')
;

INSERT INTO [dbo].[fui_permissions]  VALUES (N'10020310', N'100203', N'RACT02.10', N'转换为模型', N'/supervisor/workflow/process/convert-to-model/**', N'1')
;

INSERT INTO [dbo].[fui_permissions]  VALUES (N'10020311', N'100203', N'RACT02.11', N'流程状态更改', N'/supervisor/workflow/process/processdefinition/update/**/**', N'1')
;

INSERT INTO [dbo].[fui_permissions]  VALUES (N'10020312', N'100203', N'RACT02.12', N'导出流程图', N'/supervisor/workflow/process/export/diagrams', N'1')
;

INSERT INTO [dbo].[fui_permissions]  VALUES (N'10020313', N'100203', N'RACT02.13', N'获取流程定义', N'/supervisor/workflow/process/bpmn/model/**', N'1')
;

INSERT INTO [dbo].[fui_permissions]  VALUES (N'10020401', N'100204', N'RACT03.01', N'首页', N'/supervisor/workflow/processinstance/index', N'1')
;

INSERT INTO [dbo].[fui_permissions]  VALUES (N'10020402', N'100204', N'RACT03.02', N'查询运行中的流程', N'/supervisor/workflow/processinstance/list', N'1')
;

INSERT INTO [dbo].[fui_permissions]  VALUES (N'10020403', N'100204', N'RACT03.03', N'更改运行中流程状态', N'/supervisor/workflow/processinstance/update/**/**', N'1')
;

INSERT INTO [dbo].[fui_permissions]  VALUES (N'100101051', N'10010105', N'EDPI00.01', N'首页', N'/supervisor/project/index', N'1')
;

INSERT INTO [dbo].[fui_permissions]  VALUES (N'100101052', N'10010105', N'EDPI00.02', N'查询项目列表', N'/supervisor/project/list', N'1')
;

INSERT INTO [dbo].[fui_permissions]  VALUES (N'100101053', N'10010105', N'EDPI00.03', N'保存', N'/supervisor/project/save', N'1')
;

INSERT INTO [dbo].[fui_permissions]  VALUES (N'1001010101', N'10010101', N'EDUM.EDUM01', N'用户管理', N'/supervisor/user/index', N'0')
;

INSERT INTO [dbo].[fui_permissions]  VALUES (N'1001010102', N'10010101', N'EDUM.EDUM02', N'角色管理', N'/supervisor/role/index', N'0')
;

INSERT INTO [dbo].[fui_permissions]  VALUES (N'1001010103', N'10010101', N'EDUM.EDUM03', N'权限管理', N'/supervisor/right/index', N'0')
;

INSERT INTO [dbo].[fui_permissions]  VALUES (N'1001010104', N'10010101', N'EDUM.EDUM04', N'机构管理', N'/supervisor/organization/index', N'0')
;

INSERT INTO [dbo].[fui_permissions]  VALUES (N'1001010105', N'10010101', N'EDUM.EDUM05', N'日程管理', N'', N'1')
;

INSERT INTO [dbo].[fui_permissions]  VALUES (N'1001010106', N'10010101', N'EDUM.EDUM06', N'皮肤设置', N'/supervisor/style/index', N'0')
;

INSERT INTO [dbo].[fui_permissions]  VALUES (N'1001010301', N'10010103', N'EDPI.EDPI10', N'菜单信息管理', N'/supervisor/menu/index', N'0')
;

INSERT INTO [dbo].[fui_permissions]  VALUES (N'1001010401', N'10010104', N'EDCM.EDCM00', N'字典管理', N'/supervisor/dict/index', N'0')
;

INSERT INTO [dbo].[fui_permissions]  VALUES (N'10010101011', N'1001010101', N'EDUM01.01', N'首页', N'/supervisor/user/index,/supervisor/user/state', N'1')
;

INSERT INTO [dbo].[fui_permissions]  VALUES (N'10010101012', N'1001010101', N'EDUM01.02', N'查询用户列表', N'/supervisor/user/list', N'1')
;

INSERT INTO [dbo].[fui_permissions]  VALUES (N'10010101013', N'1001010101', N'EDUM01.03', N'新增', N'/supervisor/right/add', N'1')
;

INSERT INTO [dbo].[fui_permissions]  VALUES (N'10010101014', N'1001010101', N'EDUM01.04', N'修改', N'/supervisor/right/update', N'1')
;

INSERT INTO [dbo].[fui_permissions]  VALUES (N'10010101015', N'1001010101', N'EDUM01.05', N'获取角色列表', N'/supervisor/right/roleList', N'1')
;

INSERT INTO [dbo].[fui_permissions]  VALUES (N'10010101016', N'1001010101', N'EDUM01.06', N'重置密码', N'/supervisor/right/resetPwd', N'1')
;

INSERT INTO [dbo].[fui_permissions]  VALUES (N'10010101017', N'1001010101', N'EDUM01.07', N'修改状态', N'/supervisor/right/status', N'1')
;

INSERT INTO [dbo].[fui_permissions]  VALUES (N'10010101018', N'1001010101', N'EDUM01.08', N'修改密码', N'/supervisor/right/updatePwd', N'1')
;

INSERT INTO [dbo].[fui_permissions]  VALUES (N'10010101021', N'1001010102', N'EDUM02.01', N'首页', N'/supervisor/role/index,/supervisor/role/state', N'1')
;

INSERT INTO [dbo].[fui_permissions]  VALUES (N'10010101022', N'1001010102', N'EDUM02.02', N'查询角色列表', N'/supervisor/role/list', N'1')
;

INSERT INTO [dbo].[fui_permissions]  VALUES (N'10010101023', N'1001010102', N'EDUM02.03', N'展示角色树型结构', N'/supervisor/right/showRights', N'1')
;

INSERT INTO [dbo].[fui_permissions]  VALUES (N'10010101024', N'1001010102', N'EDUM02.04', N'新增', N'/supervisor/right/add', N'1')
;

INSERT INTO [dbo].[fui_permissions]  VALUES (N'10010101025', N'1001010102', N'EDUM02.05', N'修改', N'/supervisor/right/update', N'1')
;

INSERT INTO [dbo].[fui_permissions]  VALUES (N'10010101031', N'1001010103', N'EDUM03.01', N'首页', N'/supervisor/right/index,/supervisor/right/state', N'1')
;

INSERT INTO [dbo].[fui_permissions]  VALUES (N'10010101032', N'1001010103', N'EDUM03.02', N'查询权限列表', N'/supervisor/right/list', N'1')
;

INSERT INTO [dbo].[fui_permissions]  VALUES (N'10010101033', N'1001010103', N'EDUM03.03', N'选择权限', N'/supervisor/right/selectTreeWindow', N'1')
;

INSERT INTO [dbo].[fui_permissions]  VALUES (N'10010101034', N'1001010103', N'EDUM03.04', N'展示权限树型结构', N'/supervisor/right/selectByKey', N'1')
;

INSERT INTO [dbo].[fui_permissions]  VALUES (N'10010101035', N'1001010103', N'EDUM03.05', N'新增', N'/supervisor/right/add', N'1')
;

INSERT INTO [dbo].[fui_permissions]  VALUES (N'10010101036', N'1001010103', N'EDUM03.06', N'修改', N'/supervisor/right/update', N'1')
;

INSERT INTO [dbo].[fui_permissions]  VALUES (N'10010101041', N'1001010104', N'EDUM04.01', N'首页', N'/supervisor/organization/index,/supervisor/organization/state', N'1')
;

INSERT INTO [dbo].[fui_permissions]  VALUES (N'10010101042', N'1001010104', N'EDUM04.02', N'选择人员', N'/supervisor/organization/selectUserWindow', N'1')
;

INSERT INTO [dbo].[fui_permissions]  VALUES (N'10010101043', N'1001010104', N'EDUM04.03', N'查询机构信息', N'/supervisor/organization/selectByPrimaryKey', N'1')
;

INSERT INTO [dbo].[fui_permissions]  VALUES (N'10010101044', N'1001010104', N'EDUM04.04', N'展示机构树型结构', N'/supervisor/organization/selectByKey', N'1')
;

INSERT INTO [dbo].[fui_permissions]  VALUES (N'10010101045', N'1001010104', N'EDUM04.05', N'新增', N'/supervisor/organization/add', N'1')
;

INSERT INTO [dbo].[fui_permissions]  VALUES (N'10010101046', N'1001010104', N'EDUM04.06', N'修改', N'/supervisor/organization/update', N'1')
;

INSERT INTO [dbo].[fui_permissions]  VALUES (N'10010101047', N'1001010104', N'EDUM04.07', N'删除', N'/supervisor/organization/delete', N'1')
;

INSERT INTO [dbo].[fui_permissions]  VALUES (N'10010101051', N'1001010105', N'EDUM05.01', N'首页', N'/supervisor/calendar', N'1')
;

INSERT INTO [dbo].[fui_permissions]  VALUES (N'10010101052', N'1001010105', N'EDUM05.02', N'事件监听', N'/supervisor/eventopt', N'1')
;

INSERT INTO [dbo].[fui_permissions]  VALUES (N'10010101053', N'1001010105', N'EDUM05.03', N'获取日历数据', N'/supervisor/getCalendarJsonData', N'1')
;

INSERT INTO [dbo].[fui_permissions]  VALUES (N'10010101054', N'1001010105', N'EDUM05.04', N'事件操作', N'/supervisor/event', N'1')
;

INSERT INTO [dbo].[fui_permissions]  VALUES (N'10010101061', N'1001010106', N'EDUM06.01', N'改变皮肤', N'/supervisor/style/updateMenuTypeAndStyle', N'1')
;

INSERT INTO [dbo].[fui_permissions]  VALUES (N'10010103011', N'1001010301', N'EDPI10.01', N'首页', N'/supervisor/menu/index,/supervisor/menu/state', N'1')
;

INSERT INTO [dbo].[fui_permissions]  VALUES (N'10010103012', N'1001010301', N'EDPI10.02', N'展示菜单树型结构', N'/supervisor/menu/loadMenuNodes', N'1')
;

INSERT INTO [dbo].[fui_permissions]  VALUES (N'10010103013', N'1001010301', N'EDPI10.03', N'查询菜单列表', N'/supervisor/menu/loadMenuNodePage', N'1')
;

INSERT INTO [dbo].[fui_permissions]  VALUES (N'10010103014', N'1001010301', N'EDPI10.04', N'展示Outlook菜单', N'/supervisor/menu/loadOutlookTreeNodes', N'1')
;

INSERT INTO [dbo].[fui_permissions]  VALUES (N'10010103015', N'1001010301', N'EDPI10.05', N'保存', N'/supervisor/menu/saveMenu', N'1')
;

INSERT INTO [dbo].[fui_permissions]  VALUES (N'10010103016', N'1001010301', N'EDPI10.06', N'删除', N'/supervisor/menu/deleteMenu', N'1')
;

INSERT INTO [dbo].[fui_permissions]  VALUES (N'10010103017', N'1001010301', N'EDPI10.07', N'修改', N'/supervisor/menu/updateMenu', N'1')
;

INSERT INTO [dbo].[fui_permissions]  VALUES (N'10010104011', N'1001010401', N'EDCM00.01', N'首页', N'/supervisor/dict/index,/supervisor/dict/dictManager,/supervisor/dict/dictImportManager', N'1')
;

INSERT INTO [dbo].[fui_permissions]  VALUES (N'10010104012', N'1001010401', N'EDCM00.02', N'展示字典树型结构', N'/supervisor/dict/queryDictForTree', N'1')
;

INSERT INTO [dbo].[fui_permissions]  VALUES (N'10010104013', N'1001010401', N'EDCM00.03', N'查询字典类型', N'/supervisor/dict/queryDictType', N'1')
;

INSERT INTO [dbo].[fui_permissions]  VALUES (N'10010104014', N'1001010401', N'EDCM00.04', N'保存字典类型', N'/supervisor/dict/saveDictType', N'1')
;

INSERT INTO [dbo].[fui_permissions]  VALUES (N'10010104015', N'1001010401', N'EDCM00.05', N'保存字典详细', N'/supervisor/dict/saveDictEntry', N'1')
;

INSERT INTO [dbo].[fui_permissions]  VALUES (N'10010104016', N'1001010401', N'EDCM00.06', N'获取字典详细列表', N'/supervisor/dict/getLayout', N'1')
;

INSERT INTO [dbo].[fui_permissions]  VALUES (N'10010104017', N'1001010401', N'EDCM00.07', N'获取字典', N'/supervisor/dict/getDictData', N'1')
;


-- ----------------------------
-- Table structure for fui_project
-- ----------------------------
IF EXISTS (SELECT * FROM sys.all_objects WHERE object_id = OBJECT_ID(N'[dbo].[fui_project]') AND type IN ('U'))
	DROP TABLE [dbo].[fui_project]
;

CREATE TABLE [dbo].[fui_project] (
  [id] int NOT NULL,
  [name] nvarchar(50) COLLATE Chinese_PRC_CI_AS NULL,
  [name_desc] nvarchar(125) COLLATE Chinese_PRC_CI_AS NULL,
  [remark] nvarchar(225) COLLATE Chinese_PRC_CI_AS NULL
)
;

ALTER TABLE [dbo].[fui_project] SET (LOCK_ESCALATION = TABLE)
;


-- ----------------------------
-- Records of [fui_project]
-- ----------------------------
INSERT INTO [dbo].[fui_project]  VALUES (N'1', N'project.name', N'jcoffee Demo', N'说明：输入项目的中文名')
;

INSERT INTO [dbo].[fui_project]  VALUES (N'2', N'logo', N'logo.png', N'说明：输入项目的logo文件名或地址')
;

INSERT INTO [dbo].[fui_project]  VALUES (N'3', N'dev', N'框架研发', N'说明：如测试环境，正式环境')
;

INSERT INTO [dbo].[fui_project]  VALUES (N'4', N'infogen.dir', N'c:/infogen', N'说明：信息输出目录')
;

INSERT INTO [dbo].[fui_project]  VALUES (N'5', N'login.background', N'background', N'说明：登录页背景图片')
;


-- ----------------------------
-- Table structure for fui_roles
-- ----------------------------
IF EXISTS (SELECT * FROM sys.all_objects WHERE object_id = OBJECT_ID(N'[dbo].[fui_roles]') AND type IN ('U'))
	DROP TABLE [dbo].[fui_roles]
;

CREATE TABLE [dbo].[fui_roles] (
  [id] bigint NOT NULL,
  [role_code] nvarchar(20) COLLATE Chinese_PRC_CI_AS NULL,
  [role_name] nvarchar(50) COLLATE Chinese_PRC_CI_AS NULL,
  [permissions] nvarchar(4000) COLLATE Chinese_PRC_CI_AS NULL
)
;

ALTER TABLE [dbo].[fui_roles] SET (LOCK_ESCALATION = TABLE)
;

EXEC sp_addextendedproperty
'MS_Description', N'角色代码',
'SCHEMA', N'dbo',
'TABLE', N'fui_roles',
'COLUMN', N'role_code'
;

EXEC sp_addextendedproperty
'MS_Description', N'角色名称',
'SCHEMA', N'dbo',
'TABLE', N'fui_roles',
'COLUMN', N'role_name'
;

EXEC sp_addextendedproperty
'MS_Description', N'权限',
'SCHEMA', N'dbo',
'TABLE', N'fui_roles',
'COLUMN', N'permissions'
;

EXEC sp_addextendedproperty
'MS_Description', N'后台用户角色表',
'SCHEMA', N'dbo',
'TABLE', N'fui_roles'
;


-- ----------------------------
-- Records of [fui_roles]
-- ----------------------------
INSERT INTO [dbo].[fui_roles]  VALUES (N'1', N'supervisor', N'超级管理员', N'1001,100101,10010101,1001010101,10010101011,10010101012,10010101013,10010101014,10010101015,10010101016,10010101017,10010101018,1001010102,10010101021,10010101022,10010101023,10010101024,10010101025,1001010103,10010101031,10010101032,10010101033,10010101034,10010101035,10010101036,1001010104,10010101041,10010101042,10010101043,10010101044,10010101045,10010101046,10010101047,1001010105,10010101051,10010101052,10010101053,10010101054,1001010106,10010101061,10010103,1001010301,10010103011,10010103012,10010103013,10010103014,10010103015,10010103016,10010103017,10010104,1001010401,10010104011,10010104012,10010104013,10010104014,10010104015,10010104016,10010104017,10010105,100101051,100101052,100101053,1002,100201,100202,10020201,10020202,10020203,10020204,10020205,10020206,10020207,10020208,10020209,10020210,10020211,10020212,10020213,10020214,100203,10020301,10020302,10020303,10020304,10020305,10020306,10020307,10020308,10020309,10020310,10020311,10020312,10020313,100204,10020401,10020402,10020403')
;

INSERT INTO [dbo].[fui_roles]  VALUES (N'3', N'flower', N'流程管理员', N'1001010105,10010101051,10010101052,10010101053,10010101054,1001010106,10010101061,1002,100201,100202,10020201,10020202,10020203,10020204,10020205,10020206,10020207,10020208,10020209,10020210,10020211,10020212,10020213,10020214,100203,10020301,10020302,10020303,10020304,10020305,10020306,10020307,10020308,10020309,10020310,10020311,10020312,10020313,100204,10020401,10020402,10020403')
;


-- ----------------------------
-- Table structure for fui_user
-- ----------------------------
IF EXISTS (SELECT * FROM sys.all_objects WHERE object_id = OBJECT_ID(N'[dbo].[fui_user]') AND type IN ('U'))
	DROP TABLE [dbo].[fui_user]
;

CREATE TABLE [dbo].[fui_user] (
  [id] bigint NOT NULL,
  [ename] varchar(15) COLLATE Chinese_PRC_CI_AS NULL,
  [cname] varchar(50) COLLATE Chinese_PRC_CI_AS NULL,
  [password] varchar(50) COLLATE Chinese_PRC_CI_AS NULL,
  [style] varchar(10) COLLATE Chinese_PRC_CI_AS NULL,
  [menu_type] varchar(50) COLLATE Chinese_PRC_CI_AS NULL,
  [erased] bit NULL,
  [login_count] bigint NULL,
  [last_login_time] datetime NULL,
  [create_time] datetime NULL
)
;

ALTER TABLE [dbo].[fui_user] SET (LOCK_ESCALATION = TABLE)
;

EXEC sp_addextendedproperty
'MS_Description', N'0：异常状态',
'SCHEMA', N'dbo',
'TABLE', N'fui_user',
'COLUMN', N'erased'
;


-- ----------------------------
-- Records of [fui_user]
-- ----------------------------
INSERT INTO [dbo].[fui_user]  VALUES (N'1', N'admin', N'管理员', N'5F4DCC3B5AA765D61D8327DEB882CF99', N'black', N'pact', N'0', N'311', N'2017-09-07 11:21:54.000', NULL)
;

INSERT INTO [dbo].[fui_user]  VALUES (N'5', N'ls', N'李四', N'392FFAFA49FDE96C848704EBF013E7E8', N'default', N'default', N'0', N'2', N'2017-06-17 13:08:09.000', NULL)
;

INSERT INTO [dbo].[fui_user]  VALUES (N'6', N'zhangsan', N'张三', N'01D7F40760960E7BD9443513F22AB9AF', N'black', N'pact', N'0', N'27', N'2017-09-06 10:01:09.000', NULL)
;


-- ----------------------------
-- Table structure for fui_user_organizations
-- ----------------------------
IF EXISTS (SELECT * FROM sys.all_objects WHERE object_id = OBJECT_ID(N'[dbo].[fui_user_organizations]') AND type IN ('U'))
	DROP TABLE [dbo].[fui_user_organizations]
;

CREATE TABLE [dbo].[fui_user_organizations] (
  [id] bigint NOT NULL,
  [user_id] bigint NULL,
  [organization_id] bigint NULL
)
;

ALTER TABLE [dbo].[fui_user_organizations] SET (LOCK_ESCALATION = TABLE)
;

EXEC sp_addextendedproperty
'MS_Description', N'用户id',
'SCHEMA', N'dbo',
'TABLE', N'fui_user_organizations',
'COLUMN', N'user_id'
;

EXEC sp_addextendedproperty
'MS_Description', N'组织机构id',
'SCHEMA', N'dbo',
'TABLE', N'fui_user_organizations',
'COLUMN', N'organization_id'
;

EXEC sp_addextendedproperty
'MS_Description', N'后台用户角色关联表',
'SCHEMA', N'dbo',
'TABLE', N'fui_user_organizations'
;


-- ----------------------------
-- Records of [fui_user_organizations]
-- ----------------------------
INSERT INTO [dbo].[fui_user_organizations]  VALUES (N'7', N'1', N'1')
;

INSERT INTO [dbo].[fui_user_organizations]  VALUES (N'8', N'5', N'1001')
;

INSERT INTO [dbo].[fui_user_organizations]  VALUES (N'9', N'6', N'1002')
;

INSERT INTO [dbo].[fui_user_organizations]  VALUES (N'10', N'7', N'1002')
;


-- ----------------------------
-- Table structure for fui_user_roles
-- ----------------------------
IF EXISTS (SELECT * FROM sys.all_objects WHERE object_id = OBJECT_ID(N'[dbo].[fui_user_roles]') AND type IN ('U'))
	DROP TABLE [dbo].[fui_user_roles]
;

CREATE TABLE [dbo].[fui_user_roles] (
  [id] bigint NOT NULL,
  [user_id] bigint NULL,
  [role_id] bigint NULL
)
;

ALTER TABLE [dbo].[fui_user_roles] SET (LOCK_ESCALATION = TABLE)
;

EXEC sp_addextendedproperty
'MS_Description', N'用户id',
'SCHEMA', N'dbo',
'TABLE', N'fui_user_roles',
'COLUMN', N'user_id'
;

EXEC sp_addextendedproperty
'MS_Description', N'角色id',
'SCHEMA', N'dbo',
'TABLE', N'fui_user_roles',
'COLUMN', N'role_id'
;

EXEC sp_addextendedproperty
'MS_Description', N'后台用户角色关联表',
'SCHEMA', N'dbo',
'TABLE', N'fui_user_roles'
;


-- ----------------------------
-- Records of [fui_user_roles]
-- ----------------------------
INSERT INTO [dbo].[fui_user_roles]  VALUES (N'1', N'1', N'1')
;

INSERT INTO [dbo].[fui_user_roles]  VALUES (N'4', N'5', N'3')
;

INSERT INTO [dbo].[fui_user_roles]  VALUES (N'5', N'6', N'3')
;


-- ----------------------------
-- Primary Key structure for table fui_organization
-- ----------------------------
ALTER TABLE [dbo].[fui_organization] ADD CONSTRAINT [PK__fui_orga__3213E83F0425A276] PRIMARY KEY CLUSTERED ([id])
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = OFF, ALLOW_PAGE_LOCKS = OFF)  
ON [PRIMARY]
;


-- ----------------------------
-- Primary Key structure for table fui_permissions
-- ----------------------------
ALTER TABLE [dbo].[fui_permissions] ADD CONSTRAINT [PK__fui_perm__3213E83F07F6335A] PRIMARY KEY CLUSTERED ([id])
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = OFF, ALLOW_PAGE_LOCKS = OFF)  
ON [PRIMARY]
;


-- ----------------------------
-- Primary Key structure for table fui_project
-- ----------------------------
ALTER TABLE [dbo].[fui_project] ADD CONSTRAINT [PK__fui_proj__3213E83F0BC6C43E] PRIMARY KEY CLUSTERED ([id])
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = OFF, ALLOW_PAGE_LOCKS = OFF)  
ON [PRIMARY]
;


-- ----------------------------
-- Primary Key structure for table fui_roles
-- ----------------------------
ALTER TABLE [dbo].[fui_roles] ADD CONSTRAINT [PK__fui_role__3213E83F0F975522] PRIMARY KEY CLUSTERED ([id])
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = OFF, ALLOW_PAGE_LOCKS = OFF)  
ON [PRIMARY]
;


-- ----------------------------
-- Primary Key structure for table fui_user
-- ----------------------------
ALTER TABLE [dbo].[fui_user] ADD CONSTRAINT [PK__fui_user__3213E83F1B0907CE] PRIMARY KEY CLUSTERED ([id])
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = OFF, ALLOW_PAGE_LOCKS = OFF)  
ON [PRIMARY]
;


-- ----------------------------
-- Primary Key structure for table fui_user_organizations
-- ----------------------------
ALTER TABLE [dbo].[fui_user_organizations] ADD CONSTRAINT [PK__fui_user__3213E83F145C0A3F] PRIMARY KEY CLUSTERED ([id])
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = OFF, ALLOW_PAGE_LOCKS = OFF)  
ON [PRIMARY]
;


-- ----------------------------
-- Primary Key structure for table fui_user_roles
-- ----------------------------
ALTER TABLE [dbo].[fui_user_roles] ADD CONSTRAINT [PK__fui_user__3213E83F173876EA] PRIMARY KEY CLUSTERED ([id])
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = OFF, ALLOW_PAGE_LOCKS = OFF)  
ON [PRIMARY]
;

