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
 * Condition expression
 */

var KisBpmConditionExpressionCtrl = [ '$scope', '$modal', function($scope, $modal) {
    // Config for the modal window
    var opts = {
        template:  'editor-app/configuration/properties/condition-expression-popup.html?version=' + Date.now(),
        scope: $scope
    };

    // Open the dialog
    $modal(opts);
}];
var formula = ""; //定义全局变量，表达式的值
var conditionRows = null; //定义全局变量，存放配置全局参数
var KisBpmConditionExpressionPopupCtrl = [ '$scope', '$translate', '$http', function($scope, $translate, $http) {
	conditionRows = $scope.gridData;
	// Put json representing condition on scope
    if ($scope.property.value !== undefined && $scope.property.value !== null) {
        $scope.conditionExpression = {value: $scope.property.value};
    } else {
        $scope.conditionExpression = {value: ''};
    }
    formula = $scope.property.value;
	$scope.iframesrc = ACTIVITI.CONFIG.contextPath + "/bpm/editor-app/configuration/customs/condition-expression-popup.jsp";
    $scope.save = function() {
        //$scope.property.value = $scope.conditionExpression.value;
		var iframeObject = document.getElementById("iframepage").contentWindow;
        $scope.property.value = iframeObject.document.getElementById("formula").value;
        $scope.updatePropertyInModel($scope.property);
        $scope.close();
    };

    // Close button handler
    $scope.close = function() {
    	$scope.property.mode = 'read';
    	$scope.$hide();
    };
}];