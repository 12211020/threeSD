/**
 * 分类管理面板
 */

var ClassifyPannel = function(){};
//记录组件类型的数组
ClassifyPannel.structType = ["基础类型", "卫星平台", "连接件", "内部组件", "外部组件"];
ClassifyPannel.classifyModel=function(modelName){
    switch(modelName)
    {
        case "baseModel": return 0;
        case "platformModel": return 1;
        case "internalModel": return 2;
        case "externalModel": return 3;

        // case "baseMode_1": return 0;
        // case "baseMode_2": return 0;
        // case "baseMode_3": return 0;
        // case "baseMode_4": return 0;
        // case "baseMode_5": return 0;
        // case "baseMode_6": return 0;
        // case "baseMode_7": return 0;
        // case "baseMode_8": return 0;
        //
        // case "satePlatform_1": return 1;
        // case "satePlatform_2": return 1;
        // case "satePlatform_3": return 1;
        // case "satePlatform_4": return 1;
        // case "satePlatform_5": return 1;
        //
        // case "innerLoad_1": return 3;
        // case "innerLoad_2": return 3;
        // case "innerLoad_3": return 3;
        // case "innerLoad_4": return 3;
        // case "innerLoad_5": return 3;
        // case "innerLoad_6": return 3;
        //
        // case "outerLoad_1": return 4;
        // case "outerLoad_2": return 4;
        // case "outerLoad_3": return 4;
        // case "outerLoad_4": return 4;
        // case "outerLoad_5": return 4;
        // case "outerLoad_6": return 4;
        // case "outerLoad_7": return 4;
        // case "outerLoad_8": return 4;
        // case "outerLoad_9": return 4;
        // case "outerLoad_10": return 4;
        // case "outerLoad_11": return 4;
        //
        // case "connector_1": return 2;
        // case "connector_2": return 2;
        // case "connector_3": return 2;
        // case "connector_4": return 2;
        // case "connector_5": return 2;
        // case "connector_6": return 2;
    }
};
//根据标号获取模型的类型
ClassifyPannel.getModelType = function(typeID){
    var type;
    switch(typeID){
        case 0: type = "baseModel";break;
        case 1: type = "satePlatform";break;
        case 2: type = "innerLoad";break;
        case 3: type = "outerLoad";break;
        case 4: type = "connector";break;
        case 5: type = "box";break;
    }
    return type;
};
//分类管理中隐藏复选框事件
ClassifyPannel.showOrHide=function(){
    for(var i=0; i<api.design.scene.children.length; i++){
        var obj = api.design.scene.children[i];
        if(obj.userData.classifyType==0&&$("#baseChecked")[0].checked){
            api.hide(obj);
        }
        else if(obj.userData.classifyType==0&&!$("#baseChecked")[0].checked){
            api.show(obj);
        }
        if(obj.userData.classifyType==1&&$("#satChecked")[0].checked){
            api.hide(obj);
        }
        else if(obj.userData.classifyType==1&&!$("#satChecked")[0].checked){
            api.show(obj);
        }
        if(obj.userData.classifyType==2&&$("#platChecked")[0].checked){
            api.hide(obj);
        }
        else if(obj.userData.classifyType==2&&!$("#platChecked")[0].checked){
            api.show(obj);
        }
        if(obj.userData.classifyType==3&&$("#innerChecked")[0].checked){
            api.hide(obj);
        }
        else if(obj.userData.classifyType==3&&!$("#innerChecked")[0].checked){
            api.show(obj);
        }
        if(obj.userData.classifyType==4&&$("#outerChecked")[0].checked){
            api.hide(obj);
        }
        else if(obj.userData.classifyType==4&&!$("#outerChecked")[0].checked){
            api.show(obj);
        }
    }
}

//分类管理中冻结事件
ClassifyPannel.frozenModel=function(){
    for(var i=0; i<api.design.scene.children.length; i++){
        var obj = api.design.scene.children[i];
        if(obj.userData.classifyType==0&&$("#baseFrozen")[0].checked){
            api.deselect(obj);
            obj.userData.frozen=true;
            ListPannel.disableListPanel(0);
        }
        else if(obj.userData.classifyType==0&&!$("#baseFrozen")[0].checked){
            obj.userData.frozen=false;
            ListPannel.recoverListPanel(0);
        }
        if(obj.userData.classifyType==1&&$("#satFrozen")[0].checked){
            api.deselect(obj);
            obj.userData.frozen=true;
            ListPannel.disableListPanel(1);
        }
        else if(obj.userData.classifyType==1&&!$("#satFrozen")[0].checked){
            obj.userData.frozen=false;
            ListPannel.recoverListPanel(1);
        }
        if(obj.userData.classifyType==2&&$("#platFrozen")[0].checked){
            api.deselect(obj);
            obj.userData.frozen=true;
            ListPannel.disableListPanel(2);
        }
        else if(obj.userData.classifyType==2&&!$("#platFrozen")[0].checked){
            obj.userData.frozen=false;
            ListPannel.recoverListPanel(2);
        }
        if(obj.userData.classifyType==3&&$("#innerFrozen")[0].checked){
            api.deselect(obj);
            obj.userData.frozen=true;
            ListPannel.disableListPanel(3);
        }
        else if(obj.userData.classifyType==3&&!$("#innerFrozen")[0].checked){
            obj.userData.frozen=false;
            ListPannel.recoverListPanel(3);
        }
        if(obj.userData.classifyType==4&&$("#outerFrozen")[0].checked){
            api.deselect(obj);
            obj.userData.frozen=true;
            ListPannel.disableListPanel(4);
        }
        else if(obj.userData.classifyType==4&&!$("#outerFrozen")[0].checked){
            obj.userData.frozen=false;
            ListPannel.recoverListPanel(4);
        }
    }
}