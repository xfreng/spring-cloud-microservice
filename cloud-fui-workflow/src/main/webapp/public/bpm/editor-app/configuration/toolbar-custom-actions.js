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
/** Custom controller for the saveas dialog */
var SaveAsModelCtrl = [ '$rootScope', '$scope', '$http', '$route', '$location',
    function ($rootScope, $scope, $http, $route, $location) {
    	
    	var modelMetaData = $scope.editor.getModelMetaData();

	    var description = '';
	    if (modelMetaData.description) {
	    	description = modelMetaData.description;
	    }
	    var name = modelMetaData.name;
	    
	    var saveDialog = { 'name' : name,
	            'description' : description};
	    
	    $scope.saveDialog = saveDialog;
	    
	    var json = $scope.editor.getJSON();
	    json = JSON.stringify(json);
	
	    var params = {
	        modeltype: modelMetaData.model.modelType,
	        json_xml: json,
	        name: 'model'
	    };
	
	    $scope.status = {
	        loading: false
	    };
    	
    	$scope.close = function () {
	    	$scope.$hide();
	    };
	    
    	$scope.save = function () {

	        if (!$scope.saveDialog.name || $scope.saveDialog.name.length == 0) {
	        	alert("名称不能为空");
	            return;
	        }
	        
	        if (!$scope.saveDialog.key || $scope.saveDialog.key.length == 0) {
	        	alert("KEY不能为空");
	            return;
	        }
	
	        // Indicator spinner image
	        $scope.status = {
	        	loading: true
	        };
	        
	        modelMetaData.name = $scope.saveDialog.name;
	        modelMetaData.key = $scope.saveDialog.key;
	        modelMetaData.description = $scope.saveDialog.description;
			
	        var json = $scope.editor.getJSON();
	        // 修改主流程key为另存模型输入的key值
	        json.properties.process_id = $scope.saveDialog.key;
	        
	        json = JSON.stringify(json);
	        
	        var selection = $scope.editor.getSelection();
	        $scope.editor.setSelection([]);
	        
	        // Get the serialized svg image source
	        var svgClone = $scope.editor.getCanvas().getSVGRepresentation(true);
	        $scope.editor.setSelection(selection);
	        if ($scope.editor.getCanvas().properties["oryx-showstripableelements"] === false) {
	            var stripOutArray = jQuery(svgClone).find(".stripable-element");
	            for (var i = stripOutArray.length - 1; i >= 0; i--) {
	            	stripOutArray[i].remove();
	            }
	        }
	
	        // Remove all forced stripable elements
	        var stripOutArray = jQuery(svgClone).find(".stripable-element-force");
	        for (var i = stripOutArray.length - 1; i >= 0; i--) {
	            stripOutArray[i].remove();
	        }
	
	        // Parse dom to string
	        var svgDOM = DataManager.serialize(svgClone);
			// 修改IE11下xml格式问题(url中多了引号["]) -- edit by sf.xiong
	        svgDOM = svgDOM.replace(/marker-start="url\("#/g,"marker-start=\"url(#").replace(/start"\)"/g,"start\)\"");
	        svgDOM = svgDOM.replace(/marker-mid="url\("#/g,"marker-mid=\"url(#").replace(/mid"\)"/g,"mid\)\"");
	        svgDOM = svgDOM.replace(/marker-end="url\("#/g,"marker-end=\"url(#").replace(/end"\)"/g,"end\)\"");
	        
	        var params = {
	        	json_xml: json,
            	svg_xml: svgDOM,
	            name: $scope.saveDialog.name,
	            key: $scope.saveDialog.key,
	            modelId: modelMetaData.modelId,
	            description: $scope.saveDialog.description
	        };
			$http({
            	method: "PUT", 
                data: params,
                ignoreErrors: true,
                headers: {
            		'Accept': 'application/json',
                  	'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
	            },
	            transformRequest: function (obj) {
	                var str = [];
	                for (var p in obj) {
	                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
	                }
	                return str.join("&");
	            },
	            url: KISBPM.URL.putModelAs(modelMetaData.modelId)
            }).success(function(data, status) {
            	if(data.state == 1){
            		alert("输入的key值["+$scope.saveDialog.key+"]已经存在，请重新输入！");
            		// Reset state
                	$scope.error = undefined;
  					$scope.status.loading = false;
            		return;
            	}
            	
            	$scope.editor.handleEvents({
                    type: ORYX.CONFIG.EVENT_SAVED
                });
                
                $scope.modelData.name = $scope.saveDialog.name;
                $scope.modelData.lastUpdated = data.lastUpdated;

                // Fire event to all who is listening
                var saveEvent = {
                    type: KISBPM.eventBus.EVENT_TYPE_MODEL_SAVED,
                    model: params,
                    modelId: modelMetaData.modelId,
		            eventType: 'update-model'
                };
                KISBPM.eventBus.dispatch(KISBPM.eventBus.EVENT_TYPE_MODEL_SAVED, saveEvent);
				
        		// 打开另存的模型
            	top.location.href = ACTIVITI.CONFIG.contextPath + "/bpm/tree-modeler.jsp?modelId="+data.id;
                
                // Reset state
                $scope.error = undefined;
  				$scope.status.loading = false;
                $scope.$hide();
                
            }).error(function(data, status) {
          		$scope.error = {};
                console.log('Something went wrong when updating the process model:' + JSON.stringify(data));
                $scope.status.loading = false;
     	 	});
    	}
}];