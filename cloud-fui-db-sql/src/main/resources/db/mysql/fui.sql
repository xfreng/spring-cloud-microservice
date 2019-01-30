/*
 Navicat Premium Data Transfer

 Source Server         : localhost_3306
 Source Server Type    : MySQL
 Source Server Version : 50617
 Source Host           : localhost:3306
 Source Schema         : fui

 Target Server Type    : MySQL
 Target Server Version : 50617
 File Encoding         : 65001

 Date: 22/09/2017 09:06:21
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for fui_calendar
-- ----------------------------
DROP TABLE IF EXISTS `fui_calendar`;
CREATE TABLE `fui_calendar`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键',
  `title` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '' COMMENT '标题',
  `starttime` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '' COMMENT '开始时间',
  `endtime` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT '' COMMENT '结束时间',
  `allday` varchar(1) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '0' COMMENT '是否全天',
  `color` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT '' COMMENT '颜色',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '日程安排表' ROW_FORMAT = Compact;

-- ----------------------------
-- Table structure for fui_dict_entry
-- ----------------------------
DROP TABLE IF EXISTS `fui_dict_entry`;
CREATE TABLE `fui_dict_entry`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `dict_code` varchar(125) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT '' COMMENT '字典类型名称',
  `dict_entry_code` varchar(125) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT '' COMMENT '字典明细名称',
  `dict_entry_desc` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL COMMENT '字典明细描述',
  `dict_entry_sort` bigint(4) DEFAULT NULL COMMENT '排序标识',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 10 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '字典详细表' ROW_FORMAT = Compact;

-- ----------------------------
-- Records of fui_dict_entry
-- ----------------------------
INSERT INTO `fui_dict_entry` VALUES (1, 'LAYOUTSTYLE', 'default', 'default', 1);
INSERT INTO `fui_dict_entry` VALUES (3, 'LAYOUTSTYLE', 'pact', 'pact', 2);
INSERT INTO `fui_dict_entry` VALUES (4, 'SKINSTYLE', 'default', '银白色（default）', 1);
INSERT INTO `fui_dict_entry` VALUES (5, 'SKINSTYLE', 'bootstrap', '银灰色（bootstrap）', 2);
INSERT INTO `fui_dict_entry` VALUES (6, 'SKINSTYLE', 'pact', '蓝色（pact）', 5);
INSERT INTO `fui_dict_entry` VALUES (7, 'SKINSTYLE', 'black', '黑色（black）', 4);
INSERT INTO `fui_dict_entry` VALUES (8, 'SKINSTYLE', 'red', '红色（red）', 3);
INSERT INTO `fui_dict_entry` VALUES (9, 'SKINSTYLE', 'skyblue', '青色（skyblue）', 6);

-- ----------------------------
-- Table structure for fui_dict_type
-- ----------------------------
DROP TABLE IF EXISTS `fui_dict_type`;
CREATE TABLE `fui_dict_type`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `dict_code` varchar(125) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT '' COMMENT '字典类型名称',
  `dict_desc` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL COMMENT '字典类型描述',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '字典主表' ROW_FORMAT = Compact;

-- ----------------------------
-- Records of fui_dict_type
-- ----------------------------
INSERT INTO `fui_dict_type` VALUES (1, 'LAYOUTSTYLE', '布局风格');
INSERT INTO `fui_dict_type` VALUES (2, 'SKINSTYLE', '样式风格');

-- ----------------------------
-- Table structure for fui_menu
-- ----------------------------
DROP TABLE IF EXISTS `fui_menu`;
CREATE TABLE `fui_menu`  (
  `REC_CREATOR` varchar(256) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '记录创建责任者',
  `REC_CREATE_TIME` varchar(14) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '记录创建时刻',
  `REC_REVISOR` varchar(256) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '记录修改责任者',
  `REC_REVISE_TIME` varchar(14) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '记录修改时刻',
  `ARCHIVE_FLAG` varchar(1) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '归档标记',
  `TREE_ENAME` varchar(30) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '节点树英文名',
  `NODE_ENAME` varchar(30) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '节点英文名',
  `NODE_CNAME` varchar(80) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '节点中文名',
  `NODE_TYPE` int(1) NOT NULL COMMENT '节点类型',
  `NODE_URL` varchar(200) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '节点URL',
  `NODE_SORT_ID` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '节点排序标识',
  `NODE_PARAM` varchar(200) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '节点参数配置',
  `NODE_IMAGE_PATH` varchar(200) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '节点图片路径',
  PRIMARY KEY (`TREE_ENAME`, `NODE_ENAME`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '项目菜单节点信息' ROW_FORMAT = Compact;

-- ----------------------------
-- Records of fui_menu
-- ----------------------------
INSERT INTO `fui_menu` VALUES ('admin', '20160830162252', ' ', ' ', ' ', '$', 'root', '系统菜单树', 0, ' ', '1', ' ', ' ');
INSERT INTO `fui_menu` VALUES ('admin', '20170105151340', 'admin', '20170503131811', ' ', 'ACT', 'RACT01', '模型工作区', 1, '/supervisor/workflow/model/index', '2', ' ', ' ');
INSERT INTO `fui_menu` VALUES ('admin', '20170105151340', 'admin', '20170605161921', ' ', 'ACT', 'RACT02', '流程定义及部署管理', 1, '/supervisor/workflow/process/index', '3', ' ', ' ');
INSERT INTO `fui_menu` VALUES ('admin', '20170105151340', 'admin', '20170605161921', ' ', 'ACT', 'RACT03', '运行中流程', 1, '/supervisor/workflow/processinstance/index', '4', ' ', ' ');
INSERT INTO `fui_menu` VALUES ('admin', '20170105151207', 'admin', '20170920090847', ' ', 'ACT', 'RW', '流程执行示例', 0, ' ', '1', ' ', ' ');
INSERT INTO `fui_menu` VALUES ('admin', '20090729174958', 'admin', '20170617165439', ' ', 'ED', 'EDCM', '代码管理', 0, ' ', '3', ' ', ' ');
INSERT INTO `fui_menu` VALUES ('admin', '20070622161518', 'admin', '20170617165439', ' ', 'ED', 'EDPI', '菜单资源管理', 0, ' ', '2', ' ', ' ');
INSERT INTO `fui_menu` VALUES ('admin', '20110518112122', 'admin', '20170617165439', ' ', 'ED', 'EDPI00', '项目信息管理', 1, '/supervisor/project/index', '4', ' ', 'css:icon-cogs');
INSERT INTO `fui_menu` VALUES (' ', ' ', 'admin', '20170617165439', ' ', 'ED', 'EDUM', '系统设置', 0, '', '1', ' ', '');
INSERT INTO `fui_menu` VALUES ('admin', '20090729175218', 'admin', '20170904160239', ' ', 'EDCM', 'EDCM00', '字典管理', 1, '/supervisor/dict/index', '1', ' ', ' ');
INSERT INTO `fui_menu` VALUES ('admin', '20070622161533', 'admin', '20070622161828', ' ', 'EDPI', 'EDPI10', '菜单信息管理', 1, '/supervisor/menu/index', '1', ' ', ' ');
INSERT INTO `fui_menu` VALUES (' ', ' ', 'admin', '20170617165525', ' ', 'EDUM', 'EDUM01', '用户管理', 1, '/supervisor/user/index', '1', ' ', '');
INSERT INTO `fui_menu` VALUES (' ', ' ', 'admin', '20170617165525', ' ', 'EDUM', 'EDUM02', '角色管理', 1, '/supervisor/role/index', '2', ' ', '');
INSERT INTO `fui_menu` VALUES (' ', ' ', 'admin', '20170904160127', ' ', 'EDUM', 'EDUM03', '权限管理', 1, '/supervisor/right/index', '3', ' ', '');
INSERT INTO `fui_menu` VALUES ('admin', '20170904160213', ' ', ' ', ' ', 'EDUM', 'EDUM04', '机构管理', 1, '/supervisor/organization/index', '4', ' ', '');
INSERT INTO `fui_menu` VALUES ('admin', '20170906170329', ' ', ' ', ' ', 'EDUM', 'EDUM06', '皮肤设置', 1, '/supervisor/style/index', '6', ' ', '');
INSERT INTO `fui_menu` VALUES ('admin', '20170908154549', ' ', ' ', ' ', 'EDUM', 'EDUM07', '我的收藏', 1, '/supervisor/menu/shortcut', '7', ' ', '');
INSERT INTO `fui_menu` VALUES ('admin', '20130422143551', 'admin', '20170617165541', ' ', 'EP', 'ED', '元数据管理', 0, ' ', '1', ' ', ' ');
INSERT INTO `fui_menu` VALUES ('admin', '20170105150848', ' ', ' ', ' ', 'root', 'ACT', '流程管理', 0, ' ', '6', ' ', ' ');
INSERT INTO `fui_menu` VALUES ('admin', '20161225184150', 'admin', '20170524153632', ' ', 'root', 'EP', '系统平台', 0, ' ', '1', ' ', ' ');
INSERT INTO `fui_menu` VALUES ('admin', '20170920084917', ' ', ' ', ' ', 'RW', 'RWPE', '请假流程', 0, '', '1', ' ', '');
INSERT INTO `fui_menu` VALUES ('admin', '20170920085006', 'admin', '20170920085242', ' ', 'RWPE', 'RWPE01', '申请', 1, '/supervisor/oa/leave/index', '1', ' ', '');
INSERT INTO `fui_menu` VALUES ('admin', '20170920085114', 'admin', '20170920145916', ' ', 'RWPE', 'RWPE02', '任务列表', 1, '/supervisor/oa/leave/task/list', '2', ' ', '');

-- ----------------------------
-- Table structure for fui_menu_shortcut
-- ----------------------------
DROP TABLE IF EXISTS `fui_menu_shortcut`;
CREATE TABLE `fui_menu_shortcut`  (
  `id` bigint(11) NOT NULL AUTO_INCREMENT COMMENT '主键',
  `user_id` bigint(10) DEFAULT NULL COMMENT '用户id',
  `menu_id` varchar(30) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL COMMENT '菜单编号',
  `order_no` int(4) DEFAULT NULL COMMENT '菜单排序',
  `menu_image_path` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT '' COMMENT '自定义菜单图标路径',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '自定义菜单表' ROW_FORMAT = Compact;

-- ----------------------------
-- Table structure for fui_oa_leave
-- ----------------------------
DROP TABLE IF EXISTS `fui_oa_leave`;
CREATE TABLE `fui_oa_leave`  (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `apply_time` datetime(0) DEFAULT NULL,
  `end_time` datetime(0) DEFAULT NULL,
  `leave_type` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `process_instance_id` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `reality_end_time` datetime(0) DEFAULT NULL,
  `reality_start_time` datetime(0) DEFAULT NULL,
  `reason` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `start_time` datetime(0) DEFAULT NULL,
  `user_id` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of fui_oa_leave
-- ----------------------------
INSERT INTO `fui_oa_leave` VALUES (1, '2017-09-19 16:16:11', '2017-09-20 18:00:00', '公休', 'cc9651d3-4cbe-11e7-a41f-3497f65606b9', '2017-09-22 18:00:00', '2017-09-21 09:00:00', 'dsfgd46', '2017-09-19 10:02:49', '1');
INSERT INTO `fui_oa_leave` VALUES (2, '2017-09-21 12:41:48', '2017-09-30 18:00:00', '公休', '2d985151-9e87-11e7-95fc-005056c00008', '2017-09-30 18:00:00', '2017-09-30 09:00:00', '调整休假', '2017-09-30 09:00:00', '1');

-- ----------------------------
-- Table structure for fui_organization
-- ----------------------------
DROP TABLE IF EXISTS `fui_organization`;
CREATE TABLE `fui_organization`  (
  `id` bigint(20) NOT NULL COMMENT '主键（组织机构编码）',
  `parent_id` bigint(20) DEFAULT NULL COMMENT '上级组织机构编码',
  `code` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL COMMENT '组织机构编码',
  `name` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `users` varchar(5000) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL COMMENT '机构用户',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of fui_organization
-- ----------------------------
INSERT INTO `fui_organization` VALUES (1, -1, 'root', '组织结构树', '1');
INSERT INTO `fui_organization` VALUES (1001, 1, 'mintech', '技术部', '5');
INSERT INTO `fui_organization` VALUES (1002, 1, 'test', '测试部', '6,7');
INSERT INTO `fui_organization` VALUES (1003, NULL, 'test', 'test', NULL);
INSERT INTO `fui_organization` VALUES (1004, NULL, 'test1', 'test1', NULL);
INSERT INTO `fui_organization` VALUES (1005, NULL, 'test2', 'test2', NULL);

-- ----------------------------
-- Table structure for fui_permissions
-- ----------------------------
DROP TABLE IF EXISTS `fui_permissions`;
CREATE TABLE `fui_permissions`  (
  `id` bigint(20) NOT NULL,
  `parent_id` bigint(20) DEFAULT NULL,
  `code` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL COMMENT 'shiro标签使用的code',
  `text` varchar(30) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL COMMENT '权限名称',
  `url` varchar(200) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL COMMENT '权限功能点url',
  `node_type` varchar(1) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL COMMENT '节点类型：0-菜单，1-权限',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '后台用户权限表' ROW_FORMAT = Compact;

-- ----------------------------
-- Records of fui_permissions
-- ----------------------------
INSERT INTO `fui_permissions` VALUES (1001, -1, 'rootEP', '系统平台', '', '0');
INSERT INTO `fui_permissions` VALUES (1002, -1, 'rootACT', '流程管理', '', '0');
INSERT INTO `fui_permissions` VALUES (100101, 1001, 'EPED', '元数据管理', '', '0');
INSERT INTO `fui_permissions` VALUES (100201, 1002, 'ACTRW', '流程执行示例', '', '0');
INSERT INTO `fui_permissions` VALUES (100202, 1002, 'ACTRACT01', '模型工作区', '/supervisor/workflow/model/index', '0');
INSERT INTO `fui_permissions` VALUES (100203, 1002, 'ACTRACT02', '流程定义及部署管理', '/supervisor/workflow/process/index', '0');
INSERT INTO `fui_permissions` VALUES (100204, 1002, 'ACTRACT03', '运行中流程', '/supervisor/workflow/processinstance/index', '0');
INSERT INTO `fui_permissions` VALUES (10010101, 100101, 'EDEDUM', '系统设置', '', '0');
INSERT INTO `fui_permissions` VALUES (10010103, 100101, 'EDEDPI', '菜单资源管理', '', '0');
INSERT INTO `fui_permissions` VALUES (10010104, 100101, 'EDEDCM', '代码管理', '', '0');
INSERT INTO `fui_permissions` VALUES (10010105, 100101, 'EDEDPI00', '项目信息管理', '/supervisor/project/index', '0');
INSERT INTO `fui_permissions` VALUES (10020101, 100201, 'RWRWPE', '请假流程', '', '0');
INSERT INTO `fui_permissions` VALUES (10020201, 100202, 'RACT0101', '首页', '/supervisor/workflow/model/index', '1');
INSERT INTO `fui_permissions` VALUES (10020202, 100202, 'RACT0102', '查询流程模型列表', '/supervisor/workflow/model/list', '1');
INSERT INTO `fui_permissions` VALUES (10020203, 100202, 'RACT0103', '创建模型', '/supervisor/workflow/model/create', '1');
INSERT INTO `fui_permissions` VALUES (10020204, 100202, 'RACT0104', '另存模型', '/supervisor/workflow/model/**/saveas', '1');
INSERT INTO `fui_permissions` VALUES (10020205, 100202, 'RACT0105', '删除模型（批量）', '/supervisor/workflow/model/deleteModel', '1');
INSERT INTO `fui_permissions` VALUES (10020206, 100202, 'RACT0106', '复制模型', '/supervisor/workflow/model/copyModel', '1');
INSERT INTO `fui_permissions` VALUES (10020207, 100202, 'RACT0107', '复制到模型模板', '/supervisor/workflow/model/copyModel2Template', '1');
INSERT INTO `fui_permissions` VALUES (10020208, 100202, 'RACT0108', '部署流程', '/supervisor/workflow/model/deploy/**', '1');
INSERT INTO `fui_permissions` VALUES (10020209, 100202, 'RACT0109', '导出模型', '/supervisor/workflow/model/export/**/**', '1');
INSERT INTO `fui_permissions` VALUES (10020210, 100202, 'RACT0110', '删除模型（单个）', '/supervisor/workflow/model/delete/**', '1');
INSERT INTO `fui_permissions` VALUES (10020211, 100202, 'RACT0111', '检查模型key值', '/supervisor/checkModelKey', '1');
INSERT INTO `fui_permissions` VALUES (10020212, 100202, 'RACT0112', '获取模型', '/supervisor/treeModel/getModel', '1');
INSERT INTO `fui_permissions` VALUES (10020213, 100202, 'RACT0113', '检查模型', '/supervisor/treeModel/checkModelByModelId', '1');
INSERT INTO `fui_permissions` VALUES (10020214, 100202, 'RACT0114', '设计器首页', '/supervisor/designer/tree-modeler', '1');
INSERT INTO `fui_permissions` VALUES (10020301, 100203, 'RACT0201', '首页', '/supervisor/workflow/process/index', '1');
INSERT INTO `fui_permissions` VALUES (10020302, 100203, 'RACT0202', '查询流程定义列表', '/supervisor/workflow/process/list', '1');
INSERT INTO `fui_permissions` VALUES (10020303, 100203, 'RACT0203', '读取资源（部署ID）', '/supervisor/workflow/process/resource/read', '1');
INSERT INTO `fui_permissions` VALUES (10020304, 100203, 'RACT0204', '读取资源（流程ID）', '/supervisor/workflow/process/resource/process-instance', '1');
INSERT INTO `fui_permissions` VALUES (10020305, 100203, 'RACT0205', '删除已部署流程', '/supervisor/workflow/process/delete', '1');
INSERT INTO `fui_permissions` VALUES (10020306, 100203, 'RACT0206', '输出跟踪流程信息', '/supervisor/workflow/process/trace', '1');
INSERT INTO `fui_permissions` VALUES (10020307, 100203, 'RACT0207', '读取带跟踪的图片', '/supervisor/workflow/process/trace/auto/**', '1');
INSERT INTO `fui_permissions` VALUES (10020308, 100203, 'RACT0208', '部署流程', '/supervisor/workflow/process/deploy', '1');
INSERT INTO `fui_permissions` VALUES (10020309, 100203, 'RACT0209', '启动流程', '/supervisor/workflow/process/start-running/**', '1');
INSERT INTO `fui_permissions` VALUES (10020310, 100203, 'RACT0210', '转换为模型', '/supervisor/workflow/process/convert-to-model/**', '1');
INSERT INTO `fui_permissions` VALUES (10020311, 100203, 'RACT0211', '流程状态更改', '/supervisor/workflow/process/processdefinition/update/**/**', '1');
INSERT INTO `fui_permissions` VALUES (10020312, 100203, 'RACT0212', '导出流程图', '/supervisor/workflow/process/export/diagrams', '1');
INSERT INTO `fui_permissions` VALUES (10020313, 100203, 'RACT0213', '获取流程定义', '/supervisor/workflow/process/bpmn/model/**', '1');
INSERT INTO `fui_permissions` VALUES (10020401, 100204, 'RACT0301', '首页', '/supervisor/workflow/processinstance/index', '1');
INSERT INTO `fui_permissions` VALUES (10020402, 100204, 'RACT0302', '查询运行中的流程', '/supervisor/workflow/processinstance/list', '1');
INSERT INTO `fui_permissions` VALUES (10020403, 100204, 'RACT0303', '更改运行中流程状态', '/supervisor/workflow/processinstance/update/**/**', '1');
INSERT INTO `fui_permissions` VALUES (100101051, 10010105, 'EDPI0001', '首页', '/supervisor/project/index', '1');
INSERT INTO `fui_permissions` VALUES (100101052, 10010105, 'EDPI0002', '查询项目列表', '/supervisor/project/list', '1');
INSERT INTO `fui_permissions` VALUES (100101053, 10010105, 'EDPI0003', '保存', '/supervisor/project/save', '1');
INSERT INTO `fui_permissions` VALUES (1001010101, 10010101, 'EDUMEDUM01', '用户管理', '/supervisor/user/index', '0');
INSERT INTO `fui_permissions` VALUES (1001010102, 10010101, 'EDUMEDUM02', '角色管理', '/supervisor/role/index', '0');
INSERT INTO `fui_permissions` VALUES (1001010103, 10010101, 'EDUMEDUM03', '权限管理', '/supervisor/right/index', '0');
INSERT INTO `fui_permissions` VALUES (1001010104, 10010101, 'EDUMEDUM04', '机构管理', '/supervisor/organization/index', '0');
INSERT INTO `fui_permissions` VALUES (1001010105, 10010101, 'EDUMEDUM05', '日程管理', '', '1');
INSERT INTO `fui_permissions` VALUES (1001010106, 10010101, 'EDUMEDUM06', '皮肤设置', '/supervisor/style/index', '0');
INSERT INTO `fui_permissions` VALUES (1001010107, 10010101, 'EDUMEDUM07', '我的收藏', '/supervisor/menu/shortcut', '0');
INSERT INTO `fui_permissions` VALUES (1001010301, 10010103, 'EDPIEDPI10', '菜单信息管理', '/supervisor/menu/index', '0');
INSERT INTO `fui_permissions` VALUES (1001010401, 10010104, 'EDCMEDCM00', '字典管理', '/supervisor/dict/index', '0');
INSERT INTO `fui_permissions` VALUES (1002010101, 10020101, 'RWPERWPE01', '申请', '/supervisor/oa/leave/index', '0');
INSERT INTO `fui_permissions` VALUES (1002010102, 10020101, 'RWPERWPE02', '任务列表', '/supervisor/oa/leave/task/list', '0');
INSERT INTO `fui_permissions` VALUES (10010101011, 1001010101, 'EDUM0101', '首页', '/supervisor/user/index,/supervisor/user/state', '1');
INSERT INTO `fui_permissions` VALUES (10010101012, 1001010101, 'EDUM0102', '查询用户列表', '/supervisor/user/list', '1');
INSERT INTO `fui_permissions` VALUES (10010101013, 1001010101, 'EDUM0103', '新增', '/supervisor/right/add', '1');
INSERT INTO `fui_permissions` VALUES (10010101014, 1001010101, 'EDUM0104', '修改', '/supervisor/right/update', '1');
INSERT INTO `fui_permissions` VALUES (10010101015, 1001010101, 'EDUM0105', '获取角色列表', '/supervisor/right/roleList', '1');
INSERT INTO `fui_permissions` VALUES (10010101016, 1001010101, 'EDUM0106', '重置密码', '/supervisor/right/resetPwd', '1');
INSERT INTO `fui_permissions` VALUES (10010101017, 1001010101, 'EDUM0107', '修改状态', '/supervisor/right/status', '1');
INSERT INTO `fui_permissions` VALUES (10010101018, 1001010101, 'EDUM0108', '修改密码', '/supervisor/right/updatePwd', '1');
INSERT INTO `fui_permissions` VALUES (10010101021, 1001010102, 'EDUM0201', '首页', '/supervisor/role/index,/supervisor/role/state', '1');
INSERT INTO `fui_permissions` VALUES (10010101022, 1001010102, 'EDUM0202', '查询角色列表', '/supervisor/role/list', '1');
INSERT INTO `fui_permissions` VALUES (10010101023, 1001010102, 'EDUM0203', '展示角色树型结构', '/supervisor/right/showRights', '1');
INSERT INTO `fui_permissions` VALUES (10010101024, 1001010102, 'EDUM0204', '新增', '/supervisor/right/add', '1');
INSERT INTO `fui_permissions` VALUES (10010101025, 1001010102, 'EDUM0205', '修改', '/supervisor/right/update', '1');
INSERT INTO `fui_permissions` VALUES (10010101031, 1001010103, 'EDUM0301', '首页', '/supervisor/right/index,/supervisor/right/state', '1');
INSERT INTO `fui_permissions` VALUES (10010101032, 1001010103, 'EDUM0302', '查询权限列表', '/supervisor/right/list', '1');
INSERT INTO `fui_permissions` VALUES (10010101033, 1001010103, 'EDUM0303', '选择权限', '/supervisor/right/selectTreeWindow', '1');
INSERT INTO `fui_permissions` VALUES (10010101034, 1001010103, 'EDUM0304', '展示权限树型结构', '/supervisor/right/selectByKey', '1');
INSERT INTO `fui_permissions` VALUES (10010101035, 1001010103, 'EDUM0305', '新增', '/supervisor/right/add', '1');
INSERT INTO `fui_permissions` VALUES (10010101036, 1001010103, 'EDUM0306', '修改', '/supervisor/right/update', '1');
INSERT INTO `fui_permissions` VALUES (10010101041, 1001010104, 'EDUM0401', '首页', '/supervisor/organization/index,/supervisor/organization/state', '1');
INSERT INTO `fui_permissions` VALUES (10010101042, 1001010104, 'EDUM0402', '选择人员', '/supervisor/organization/selectUserWindow', '1');
INSERT INTO `fui_permissions` VALUES (10010101043, 1001010104, 'EDUM0403', '查询机构信息', '/supervisor/organization/selectByPrimaryKey', '1');
INSERT INTO `fui_permissions` VALUES (10010101044, 1001010104, 'EDUM0404', '展示机构树型结构', '/supervisor/organization/selectByKey', '1');
INSERT INTO `fui_permissions` VALUES (10010101045, 1001010104, 'EDUM0405', '新增', '/supervisor/organization/add', '1');
INSERT INTO `fui_permissions` VALUES (10010101046, 1001010104, 'EDUM0406', '修改', '/supervisor/organization/update', '1');
INSERT INTO `fui_permissions` VALUES (10010101047, 1001010104, 'EDUM0407', '删除', '/supervisor/organization/delete', '1');
INSERT INTO `fui_permissions` VALUES (10010101051, 1001010105, 'EDUM0501', '首页', '/supervisor/calendar', '1');
INSERT INTO `fui_permissions` VALUES (10010101052, 1001010105, 'EDUM0502', '事件监听', '/supervisor/eventopt', '1');
INSERT INTO `fui_permissions` VALUES (10010101053, 1001010105, 'EDUM0503', '获取日历数据', '/supervisor/getCalendarJsonData', '1');
INSERT INTO `fui_permissions` VALUES (10010101054, 1001010105, 'EDUM0504', '事件操作', '/supervisor/event', '1');
INSERT INTO `fui_permissions` VALUES (10010101061, 1001010106, 'EDUM0601', '改变皮肤', '/supervisor/style/updateMenuTypeAndStyle', '1');
INSERT INTO `fui_permissions` VALUES (10010103011, 1001010301, 'EDPI1001', '首页', '/supervisor/menu/index,/supervisor/menu/state', '1');
INSERT INTO `fui_permissions` VALUES (10010103012, 1001010301, 'EDPI1002', '展示菜单树型结构', '/supervisor/menu/loadMenuNodes', '1');
INSERT INTO `fui_permissions` VALUES (10010103013, 1001010301, 'EDPI1003', '查询菜单列表', '/supervisor/menu/loadMenuNodePage', '1');
INSERT INTO `fui_permissions` VALUES (10010103014, 1001010301, 'EDPI1004', '展示Outlook菜单', '/supervisor/menu/loadOutlookTreeNodes', '1');
INSERT INTO `fui_permissions` VALUES (10010103015, 1001010301, 'EDPI1005', '保存', '/supervisor/menu/saveMenu', '1');
INSERT INTO `fui_permissions` VALUES (10010103016, 1001010301, 'EDPI1006', '删除', '/supervisor/menu/deleteMenu', '1');
INSERT INTO `fui_permissions` VALUES (10010103017, 1001010301, 'EDPI1007', '修改', '/supervisor/menu/updateMenu', '1');
INSERT INTO `fui_permissions` VALUES (10010104011, 1001010401, 'EDCM0001', '首页', '/supervisor/dict/index,/supervisor/dict/dictManager,/supervisor/dict/dictImportManager', '1');
INSERT INTO `fui_permissions` VALUES (10010104012, 1001010401, 'EDCM0002', '展示字典树型结构', '/supervisor/dict/queryDictForTree', '1');
INSERT INTO `fui_permissions` VALUES (10010104013, 1001010401, 'EDCM0003', '查询字典类型', '/supervisor/dict/queryDictType', '1');
INSERT INTO `fui_permissions` VALUES (10010104014, 1001010401, 'EDCM0004', '保存字典类型', '/supervisor/dict/saveDictType', '1');
INSERT INTO `fui_permissions` VALUES (10010104015, 1001010401, 'EDCM0005', '保存字典详细', '/supervisor/dict/saveDictEntry', '1');
INSERT INTO `fui_permissions` VALUES (10010104016, 1001010401, 'EDCM0006', '获取字典详细列表', '/supervisor/dict/getLayout', '1');
INSERT INTO `fui_permissions` VALUES (10010104017, 1001010401, 'EDCM0007', '获取字典', '/supervisor/dict/getDictData', '1');
INSERT INTO `fui_permissions` VALUES (100201010101, 1002010101, '10020101010101', '启动请假流程', '/supervisor/oa/leave/start', '1');
INSERT INTO `fui_permissions` VALUES (100201010201, 1002010102, '10020101020101', '签收任务', '/supervisor/oa/leave/task/claim/**', '1');
INSERT INTO `fui_permissions` VALUES (100201010202, 1002010102, '10020101020202', '读取详细数据', '/supervisor/oa/leave/detail/**', '1');
INSERT INTO `fui_permissions` VALUES (100201010203, 1002010102, '10020101020303', '读取详细数据(带流程变量)', '/supervisor/oa/leave/detail-with-vars/**/**', '1');
INSERT INTO `fui_permissions` VALUES (100201010204, 1002010102, '10020101020404', '完成任务', '/supervisor/oa/leave/task/complete/**', '1');

-- ----------------------------
-- Table structure for fui_project
-- ----------------------------
DROP TABLE IF EXISTS `fui_project`;
CREATE TABLE `fui_project`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `name_desc` varchar(125) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `remark` varchar(225) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 6 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of fui_project
-- ----------------------------
INSERT INTO `fui_project` VALUES (1, 'project.name', 'jcoffee Demo', '说明：输入项目的中文名');
INSERT INTO `fui_project` VALUES (2, 'logo', 'logo.png', '说明：输入项目的logo文件名或地址');
INSERT INTO `fui_project` VALUES (3, 'dev', '框架研发', '说明：如测试环境，正式环境');
INSERT INTO `fui_project` VALUES (4, 'infogen.dir', '/usr/infogen', '说明：信息输出目录');
INSERT INTO `fui_project` VALUES (5, 'login.background', 'background', '说明：登录页背景图片');

-- ----------------------------
-- Table structure for fui_roles
-- ----------------------------
DROP TABLE IF EXISTS `fui_roles`;
CREATE TABLE `fui_roles`  (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `role_code` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL COMMENT '角色代码',
  `role_name` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL COMMENT '角色名称',
  `permissions` varchar(4000) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL COMMENT '权限',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 6 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '后台用户角色表' ROW_FORMAT = Compact;

-- ----------------------------
-- Records of fui_roles
-- ----------------------------
INSERT INTO `fui_roles` VALUES (1, 'supervisor', '超级管理员', '1001,100101,10010101,1001010101,10010101011,10010101012,10010101013,10010101014,10010101015,10010101016,10010101017,10010101018,1001010102,10010101021,10010101022,10010101023,10010101024,10010101025,1001010103,10010101031,10010101032,10010101033,10010101034,10010101035,10010101036,1001010104,10010101041,10010101042,10010101043,10010101044,10010101045,10010101046,10010101047,1001010105,10010101051,10010101052,10010101053,10010101054,1001010106,10010101061,1001010107,10010103,1001010301,10010103011,10010103012,10010103013,10010103014,10010103015,10010103016,10010103017,10010104,1001010401,10010104011,10010104012,10010104013,10010104014,10010104015,10010104016,10010104017,10010105,100101051,100101052,100101053,1002,100201,10020101,1002010101,100201010101,1002010102,100201010201,100201010202,100201010203,100201010204,100202,10020201,10020202,10020203,10020204,10020205,10020206,10020207,10020208,10020209,10020210,10020211,10020212,10020213,10020214,100203,10020301,10020302,10020303,10020304,10020305,10020306,10020307,10020308,10020309,10020310,10020311,10020312,10020313,100204,10020401,10020402,10020403');
INSERT INTO `fui_roles` VALUES (3, 'flower', '流程管理员', '1001010105,10010101051,10010101052,10010101053,10010101054,1001010106,10010101061,1002,100201,100202,10020201,10020202,10020203,10020204,10020205,10020206,10020207,10020208,10020209,10020210,10020211,10020212,10020213,10020214,100203,10020301,10020302,10020303,10020304,10020305,10020306,10020307,10020308,10020309,10020310,10020311,10020312,10020313,100204,10020401,10020402,10020403');
INSERT INTO `fui_roles` VALUES (4, 'deptLeader', '部门领导', '1001010105');
INSERT INTO `fui_roles` VALUES (5, 'hr', '人事', '1001010105');

-- ----------------------------
-- Table structure for fui_user
-- ----------------------------
DROP TABLE IF EXISTS `fui_user`;
CREATE TABLE `fui_user`  (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `ename` varchar(15) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `cname` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `password` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `style` varchar(10) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT '' COMMENT '菜单风格',
  `menu_type` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL COMMENT '菜单风格',
  `erased` bit(1) DEFAULT b'1' COMMENT '1：正常状态\r\n0：异常状态',
  `login_count` bigint(20) DEFAULT 0,
  `last_login_time` datetime(0) DEFAULT NULL,
  `create_time` datetime(0) DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 7 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '用户表' ROW_FORMAT = Compact;

-- ----------------------------
-- Records of fui_user
-- ----------------------------
INSERT INTO `fui_user` VALUES (1, 'admin', '管理员', '5F4DCC3B5AA765D61D8327DEB882CF99', 'black', 'pact', b'1', 360, '2017-09-22 09:05:50', NULL);
INSERT INTO `fui_user` VALUES (5, 'ls', '李四', '392FFAFA49FDE96C848704EBF013E7E8', 'default', 'default', b'1', 2, '2017-06-17 13:08:09', NULL);
INSERT INTO `fui_user` VALUES (6, 'zhangsan', '张三', '01D7F40760960E7BD9443513F22AB9AF', 'black', 'pact', b'1', 27, '2017-09-06 10:01:09', NULL);

-- ----------------------------
-- Table structure for fui_user_organizations
-- ----------------------------
DROP TABLE IF EXISTS `fui_user_organizations`;
CREATE TABLE `fui_user_organizations`  (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) DEFAULT NULL COMMENT '用户id',
  `organization_id` bigint(20) DEFAULT NULL COMMENT '组织机构id',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 11 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '后台用户角色关联表' ROW_FORMAT = Compact;

-- ----------------------------
-- Records of fui_user_organizations
-- ----------------------------
INSERT INTO `fui_user_organizations` VALUES (7, 1, 1);
INSERT INTO `fui_user_organizations` VALUES (8, 5, 1001);
INSERT INTO `fui_user_organizations` VALUES (9, 6, 1002);
INSERT INTO `fui_user_organizations` VALUES (10, 7, 1002);

-- ----------------------------
-- Table structure for fui_user_roles
-- ----------------------------
DROP TABLE IF EXISTS `fui_user_roles`;
CREATE TABLE `fui_user_roles`  (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) DEFAULT NULL COMMENT '用户id',
  `role_id` bigint(20) DEFAULT NULL COMMENT '角色id',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 9 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '后台用户角色关联表' ROW_FORMAT = Compact;

-- ----------------------------
-- Records of fui_user_roles
-- ----------------------------
INSERT INTO `fui_user_roles` VALUES (4, 5, 3);
INSERT INTO `fui_user_roles` VALUES (5, 6, 3);
INSERT INTO `fui_user_roles` VALUES (6, 1, 1);
INSERT INTO `fui_user_roles` VALUES (7, 1, 4);
INSERT INTO `fui_user_roles` VALUES (8, 1, 5);

SET FOREIGN_KEY_CHECKS = 1;
