/*
 * Activiti Modeler component part of the Activiti project
 * Copyright 2005-2014 Alfresco Software, Ltd. All rights reserved.
 * 
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 2.1 of the License, or (at your option) any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.

 * You should have received a copy of the GNU Lesser General Public
 * License along with this library; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301  USA
 */
/*
 * 文档的controller
 */
var jsonStr = null;//定义全局变量，存放数据
var formula = ""; //定义全局变量，表达式的值
var documentController = ['$scope', '$modal', '$rootScope', function ($scope, $modal, $rootScope) {
    var opts = {
        template: 'editor-app/configuration/properties/document-text.html?version=' + Date.now(),
        scope: $scope
    };
    // Open the dialog
    $modal(opts);
}];
var documentControllerCtrl = ['$scope', function ($scope) {
    jsonStr = $scope.property.value;
    var formEname = null;
    try {
        var jsonObject = eval("(" + jsonStr + ")");
        formEname = jsonObject.attr.efFormEname;
    } catch (e) {
        var jsonObject = JSON.parse(JSON.stringify(jsonStr));
        formEname = jsonObject.formEname;
    }
    $scope.iframesrc = ACTIVITI.CONFIG.contextPath + "/DispatchAction.do?efFormEname=" + formEname;
    $scope.save = function () {
        var iframeObject = document.getElementById("iframepage").contentWindow;
        var jsonStrValue = iframeObject.getJsonStr();
        $scope.property.value = jsonStrValue;
        $scope.updatePropertyInModel($scope.property);
        $scope.close();
    };

    $scope.cancel = function () {
        $scope.$hide();
        $scope.property.mode = 'read';
    };

    $scope.close = function () {
        $scope.property.mode = 'read';
        $scope.$hide();
    };
}];
/**
 * 添加页面的efgrid数据到EiBlock对象中
 * @param {} iframeObject iframe对象
 * @param {} eiinfo    EiInfo对象
 * @param {} grid_id grid id数组(可单个)
 */
appendPageGridEiBlock = function (eiinfo, grid_id) {
    if (grid_id && typeof(grid_id) === "object" && Array == grid_id.constructor) {
        for (index in grid_id) {
            appendPageGridEiBlock(eiinfo, grid_id[index]);
        }
    } else {
        var iframeObject = document.getElementById("iframepage").contentWindow;
        var grid = iframeObject.efgrid.getGridObject(grid_id);
        var block = eiinfo.getBlock(grid.blockId);
        if (!iframeObject.isAvailable(block)) {
            block = new iframeObject.EiBlock(grid.getBlockData().getBlockMeta());
            eiinfo.addBlock(block);
        }
        var blockData = grid.getBlockData();
        for (var i = 0; i < grid.getRowCount(); i++) {
            var row = blockData.getRows()[i];
            for (var j = 0; j < row.length; j++) {
                row[j] = iframeObject.efutils.trimString(row[j]);
                if (row[j] == "")
                    row[j] = (grid.supportNull) ? "" : " ";
            }
            block.addRow(row);
        }
        block.setAttr(grid.getBlockData().getAttr());
        block.set("orderBy", grid.getOrderBy());
    }
}
/**
 * 将jsonEiInfo的数据设置到efgrid中
 * @param {} grid_id grid id数组(可单个)
 */
setGridDataByEiInfo = function (eiinfo, grid_id) {
    if (grid_id && typeof(grid_id) === "object" && Array == grid_id.constructor) {
        for (index in grid_id) {
            setGridDataByEiInfo(eiinfo, grid_id[index]);
        }
    } else {
        var iframeObject = document.getElementById("iframepage").contentWindow;
        var grid = iframeObject.efgrid.getGridObject(grid_id);
        grid.setData(eiinfo);
        grid.refresh();
    }
}

/*
 * 调用元素的controller
 */
var callelementController = ['$scope', '$modal', '$rootScope', function ($scope, $modal, $rootScope) {
    var opts = {
        template: 'editor-app/configuration/properties/callelement-text.html?version=' + Date.now(),
        scope: $scope
    };
    // Open the dialog
    $modal(opts);
}];
var callelementControllerCtrl = ['$scope', function ($scope) {
    var canvas = $scope.editor.getCanvas();
    var category = canvas.properties["oryx-process_namespace"];
    $scope.iframesrc = ACTIVITI.CONFIG.contextPath + "/DispatchAction.do?efFormEname=RWPE102&inqu_status-0-category=" + category;
    $scope.save = function () {
        var iframeObject = document.getElementById("iframepage").contentWindow;
        var jsonStrValue = iframeObject.getJsonStr();
        $scope.property.value = jsonStrValue;
        $scope.updatePropertyInModel($scope.property);
        $scope.close();
    };

    $scope.cancel = function () {
        $scope.$hide();
        $scope.property.mode = 'read';
    };

    $scope.close = function () {
        $scope.property.mode = 'read';
        $scope.$hide();
    };
}];