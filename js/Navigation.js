/**
 * Created by dell on 2015/12/28.
 */

$(function () {

// resource = require('../main.js').resource;
// console.log(resource);

var fs = require('fs');
var path = require('path');
base_model_dir = "resource/baseModel";
basic_models = fs.readdirSync(base_model_dir);
//console.log(resource);

var obj;
    basic_models.forEach(function (filePath) {
        //console.log(file);
        if(path.extname(filePath) == '.png') {
            basename = path.basename(filePath, '.png'); // default the type of the icons is png
            //filepath = path.join('resource/basic',basename);
            filepath = '../baseModel/'+basename;
            $('#basic_model_panel').append('<li class="button" onclick="api.addModel(\''+filepath+'\')" > <img src="../resource/baseModel/'+ basename+'.png"> </li>');
        }
    });
    //$('#basic_model_panel').append('<li class="button" onclick="api.addModel(this)" id="baseMode_1"> <img src="../resource/icons/model_icons/basicLoad/Cube.png"> </li>');
    $('#desiginScene').contextPopup({
        items: [
            {label:'平移',     icon:'../resource/icons/button_icons/translate.png', action:function() { api.setTransformMode('translate') } },
            {label:'旋转', icon:'../resource/icons/button_icons/rotate.png',    action:function() { api.setTransformMode('rotate') } },
            {label:'缩放',     icon:'../resource/icons/button_icons/scale.png',  action:function() { api.setTransformMode('scale') } },
            null, /* null can be used to add a separator to the menu items */
            {label:'组合',     icon:'../resource/icons/button_icons/combine.png', action:function() { api.combine() } },
            {label:'分离', icon:'../resource/icons/button_icons/separate.png',    action:function() { api.separate()} },
            {label:'吸附',     icon:'../resource/icons/button_icons/assembly.png',  action:function() { Navigation.assembly() } },
            null,
            {label:'隐藏',     icon:'../resource/icons/button_icons/invisible.png', action:function() {
                obj = api.design.selected[0].clone();
                api.hide(api.design.selected[0]); } },
            {label:'全部取消隐藏',     icon:'../resource/icons/button_icons/visible.png', action:function() {
                api.getSceneStructers();
                for (var i = 0; i < api.structures.length; i++) {
                    var obj = api.structures[i];
                    if (obj.userData.type!=null) {
                       api.design.showOBJ(obj);
                    }
                }
                }},
            {label:'复制',     icon:'../resource/icons/button_icons/copy.png', action:function() { Navigation.copy() } },
            {label:'设定视场',     icon:'../resource/icons/button_icons/reset.png',  action:function() { api.setTargetOnFocus()} },
            {label:'删除', icon:'../resource/icons/button_icons/delete.png',    action:function() { Navigation.delete()} }
        ]});



    $("#menus").button({
        icons: {
            primary: "ui-icon-menu",
            secondary: "ui-icon-triangle-1-s"
        },
        text: true
    });
    $("#create").button({
        icons: {
            primary: "ui-icon-create"
        },
        text: true
    });
    $("#open").button({
        icons: {
            primary: "ui-icon-open"
        },
        text: true
    });
    $("#save").button({
        icons: {
            primary: "ui-icon-save"
        },
        text: true
    });
    $("#saveSelected").button({
        icons: {
            primary: "ui-icon-save"
        },
        text: true
    });
    $("#saveAs").button({
        icons: {
            primary: "ui-icon-saveAs"
        },
        text: true
    });
    $( "#export_menu" ).menu();
    $("#export").button({
        icons: {
            primary: "ui-icon-export"
        },
        text: true
    });
    $("#export_mesh").button({
        icons: {
            primary: "ui-icon-export"
        },
        text: true
    });
    $("#export_scene").button({
        icons: {
            primary: "ui-icon-export"
        },
        text: true
    });
    $("#parameter").button({
        icons: {
            primary: "ui-icon-parameter"
        },
        text: true
    });
    $("#list").button({
        icons: {
            primary: "ui-icon-list"
        },
        text: true
    });
    $("#operate").button({
        icons: {
            primary: "ui-icon-operate"
        },
        text: true
    });

    $("#edit").button({
        icons: {
            primary: "ui-icon-align",
            secondary: "ui-icon-triangle-1-s"
        },
        text: true
    });

    $("#translate").button({
        icons: {
            primary: "ui-icon-translate"
        },
        text: true
    });
    $("#rotate").button({
        icons: {
            primary: "ui-icon-rotate"
        },
        text: true
    });
    $("#scale").button({
        icons: {
            primary: "ui-icon-scale"
        },
        text: true
    });
    $("#combine").button({
        icons: {
            primary: "ui-icon-combine"
        },
        text: true
    });
    $("#separate").button({
        icons: {
            primary: "ui-icon-separate"
        },
        text: true
    });
    $("#assembly").button({
        icons: {
            primary: "ui-icon-assembly"
        },
        text: true
    });

    $("#coxail").button({
        icons: {
            primary: "ui-icon-assembly"
        },
        text: true
    });
    $("#align").button({
        icons: {
            primary: "ui-icon-align",
            secondary: "ui-icon-triangle-1-s"
        },
        text: true
    });
    $("#alignX").button({
        icons: {
            primary: "ui-icon-alignX"
        },
        text: true
    });
    $("#alignY").button({
        icons: {
            primary: "ui-icon-alignY"
        },
        text: true
    });
    $("#alignZ").button({
        icons: {
            primary: "ui-icon-alignZ"
        },
        text: true
    });

    $("#coxailX").button({
        icons: {
            primary: "ui-icon-alignX"
        },
        text: true
    });
    $("#coxailY").button({
        icons: {
            primary: "ui-icon-alignY"
        },
        text: true
    });
    $("#coxailZ").button({
        icons: {
            primary: "ui-icon-alignZ"
        },
        text: true
    });
    $("#parallel").button({
        icons: {
            primary: "ui-icon-align",
            secondary: "ui-icon-triangle-1-s"
        },
        text: true
    });
    $("#parallelX").button({
        icons: {
            primary: "ui-icon-alignX"
        },
        text: true
    });
    $("#parallelY").button({
        icons: {
            primary: "ui-icon-alignY"
        },
        text: true
    });
    $("#parallelZ").button({
        icons: {
            primary: "ui-icon-alignZ"
        },
        text: true
    });
    $("#selectBox").button({
        icons: {
            primary: "ui-icon-selectBox"
        },
        text: true
    });
    $("#copy").button({
        icons: {
            primary: "ui-icon-copy"
        },
        text: true
    });
    $("#delete").button({
        icons: {
            primary: "ui-icon-delete"
        },
        text: true
    });
    $("#back").button({
        icons: {
            primary: "ui-icon-back"
        },
        text: true
    });
    $("#reset").button({
        icons: {
            primary: "ui-icon-reset",
            secondary: "ui-icon-triangle-1-s"
        },
        text: true
    });
    $("#resetAttitude").button({
        icons: {
            primary: "ui-icon-resetAttitude"
        },
        text: true
    });
    $("#resetPosition").button({
        icons: {
            primary: "ui-icon-resetPosition"
        },
        text: true
    });
    $("#resetScale").button({
        icons: {
            primary: "ui-icon-resetScale"
        },
        text: true
    });
    $("#classifyManagement").button({
        icons: {
            primary: "ui-icon-classifyManagement"
        },
        text: true
    });
    $("#statistic").button({
        icons: {
            primary: "ui-icon-statistic"
        },
        text: true
    });

    $("#setField").button({
        icons: {
            primary: "ui-icon-statistic"
        },
        text: true
    });
    $("#recoverField").button({
        icons: {
            primary: "ui-icon-statistic"
        },
        text: true
    });

    $("#setAdhere").button({
        icons: {
            primary: "ui-icon-statistic"
        },
        text: true
    });

    $("#setCameraView").button({
        icons: {
            primary: "ui-icon-statistic"
        },
        text: true
    });

    $("#FrameMode").button({
        icons: {
            primary: "ui-icon-statistic"
        },
        text: true
    });
    $("#EntityMode").button({
        icons: {
            primary: "ui-icon-statistic"
        },
        text: true
    });


    $("#shatterCrack").button({
        icons: {
            primary: "ui-icon-statistic"
        },
        text: true
    });
});

//导航栏中按钮响应函数
var Navigation = function () {
//    center=undefined;

};
Navigation.boxselected = false;
Navigation.boxFlag = -1;
//Navigation.selectBoxDiv = document.createElement("div");
Navigation.startPoint = {x:0,y:0};
//创建文件
Navigation.createFile = function () {
    //新建之前,提示是否要保存
    $("#is_save_dialog").dialog({
        dialogClass: "no-close"
    });
};
//打开文件
Navigation.openFile = function () {
    var fileInput = document.createElement('input');
    fileInput.type = "file";
    fileInput.style.display = "none";
    fileInput.addEventListener('change', function(event){
        FileOperation.openFile(fileInput.files[0]);
    });
    fileInput.click();
//    var path = api.structureFilePath;
//    var fileList = FileOperation.openFileList(path);
//    $("#open_file_list_dialog").dialog({
//        dialogClass: "no-close"
//    });
//    var data = FileOperation.openFile(path + "/" + fileList[0].fileName);
};
//弹出保存文件提示框
Navigation.saveStructureFileDialog = function(){
    //如果当前没有文件打开
    //判断场景是否空
    api.getSceneStructers();
    if(api.structures.length > 0){
        //弹出输入文件名的提示框
        $("#save_file_dialog").dialog({
            dialogClass: "no-close"
        });
    }
    else{
        alert("场景中没有模型");
    }
};
//保存文件
Navigation.saveFile = function () {
    Navigation.saveStructureFileDialog();
};
//保存选中文件
Navigation.saveSelected = function(){
    var data = api.design.saveFocus();
    if(data != undefined){
        FileOperation.fileExport(data, "模型", "json");
    }
};
//弹出另存为文件
Navigation.saveAsStructureFileDialog = function(){
    //弹出输入文件名的提示框
    $("#save_file_dialog").dialog({
        dialogClass: "no-close"
    });
};
//另存为
Navigation.saveAsFile = function () {
    Navigation.saveAsStructureFileDialog();
};
//导出文件
Navigation.exportFile = function () {
    //获取当前场景中组件的mesh格式数据
    var data = FileOperation.exportSceneFile();
    if(data != null){
        //将mesh.xml文件下载到本地
        var aLink = document.createElement("a");
        var blob = new Blob([data["mesh"]]);
        var evt = document.createEvent("MouseEvents");
        evt.initEvent("click", false, false);
        aLink.download = data["fileName"] + ".mesh.xml";
        aLink.href = URL.createObjectURL(blob);
        aLink.dispatchEvent(evt);
        //将material文件下载到本地
        aLink = document.createElement("a");
        blob = new Blob([data["material"]]);
        evt = document.createEvent("MouseEvents");
        evt.initEvent("click", false, false);
        aLink.download = data["fileName"] + ".material";
        aLink.href = URL.createObjectURL(blob);
        aLink.dispatchEvent(evt);
    }
};
//打开组件参数面板
Navigation.openParaPanel = function () {
    $('#parameter_dialog').dialog({
        position: { my: "right bottom", at: "right bottom", of: window },
        resizable: false
    });
    StructParameter.show();
};
//打开列表板//
Navigation.openListPanel = function () {
    $('#list_dialog').dialog({
        position: { my: "left+82 top+18", at: "left+82 top+18", of: window },
        resizable: false
    });
};
//打开操作板
Navigation.openOperPanel = function () {
    $('#operation_dialog').dialog({
        position: { my: "right top+18", at: "right top+18", of: window },
        resizable: false
    });
};
//平移
Navigation.translation = function () {
//    design.structManage.transform.transformControl.setMode('translate');
//    design.render();
};
//旋转
Navigation.rote = function () {
//    design.structManage.transform.transformControl.setMode('rotate');
//    design.render();
};
//缩放
Navigation.scale = function () {
//    design.structManage.transform.transformControl.setMode('scale');
//    design.render();
};
//组合
Navigation.combine = function () {
//    design.structManage.combinaOperate(design);
};
//分离
Navigation.separate = function () {
//    design.structManage.breakOperate(design);
};
//吸附
Navigation.assembly = function () {
    api.design.resetAlign();
    api.design.setMouseMode('adhere');
};

Navigation.coxailY = function(){
    api.design.setMouseMode('adhere');
   api.design.setAlign('y');
}

Navigation.coxailX = function(){
    api.design.setMouseMode('adhere');
    api.design.setAlign('x');
}

Navigation.coxailZ = function(){
    api.design.setMouseMode('adhere');
    api.design.setAlign('z');
}

//按X轴对齐
Navigation.alignX = function () {
    var selected = api.getSelctedList();
    if (selected.length <= 1) return;
    var selectedLastY = selected[selected.length - 1].position.y;
    var selectedLastZ = selected[selected.length - 1].position.z;
    for (var i = 0; i < selected.length - 1; i++) {
        api.resetOBJ(selected[i], new THREE.Vector3(selected[i].position.x, selectedLastY, selectedLastZ), selected[i].rotation, selected[i].scale);
    }
};
//按Y轴对齐
Navigation.alignY = function () {
    var selected = api.getSelctedList();
    if (selected.length <= 1) return;
    var selectedLastX = selected[selected.length - 1].position.x;
    var selectedLastZ = selected[selected.length - 1].position.z;
    for (var i = 0; i < selected.length - 1; i++) {
        api.resetOBJ(selected[i], new THREE.Vector3(selectedLastX, selected[i].position.y, selectedLastZ), selected[i].rotation, selected[i].scale);
    }
};
//按Z轴对齐
Navigation.alignZ = function () {
    var selected = api.getSelctedList();
    if (selected.length <= 1) return;
    var selectedLastX = selected[selected.length - 1].position.x;
    var selectedLastY = selected[selected.length - 1].position.y;
    for (var i = 0; i < selected.length - 1; i++) {
        api.resetOBJ(selected[i], new THREE.Vector3(selectedLastX, selectedLastY, selected[i].position.z), selected[i].rotation, selected[i].scale);
    }
};
//按X轴平行
Navigation.parallelX = function(){
    var selected = api.getSelctedList();
    if (selected.length <= 1) return;
    var selectedLastY = selected[selected.length - 1].rotation.y;
    var selectedLastZ = selected[selected.length - 1].rotation.z;
    for (var i = 0; i < selected.length - 1; i++) {
        api.resetOBJ(selected[i], selected[i].position, new THREE.Euler(selected[i].rotation.x, selectedLastY, selectedLastZ), selected[i].scale);
    }
};
//按Y轴平行
Navigation.parallelY = function(){
    var selected = api.getSelctedList();
    if (selected.length <= 1) return;
    var selectedLastX = selected[selected.length - 1].rotation.x;
    var selectedLastZ = selected[selected.length - 1].rotation.z;
    for (var i = 0; i < selected.length - 1; i++) {
        api.resetOBJ(selected[i], selected[i].position, new THREE.Euler(selectedLastX, selected[i].rotation.y, selectedLastZ), selected[i].scale);
    }
};
//按Z轴平行
Navigation.parallelZ = function(){
    var selected = api.getSelctedList();
    if (selected.length <= 1) return;
    var selectedLastY = selected[selected.length - 1].rotation.y;
    var selectedLastX = selected[selected.length - 1].rotation.x;
    for (var i = 0; i < selected.length - 1; i++) {
        api.resetOBJ(selected[i], selected[i].position, new THREE.Euler(selectedLastX, selectedLastY, selected[i].rotation.z), selected[i].scale);
    }
};
//选框
Navigation.selectBox = function () {
    api.deselectAll();
    api.design.setMouseMode('selectBox');
    Navigation.boxselected = true;
    Navigation.boxFlag = 0;
};

//选择框拉取选择
Navigation.selectBoxControl = function (event) {
    //三维空间坐标转屏幕二维坐标
    var getObjectScreenPosition = function (worldPosition) {
        var projected = worldPosition.clone();
        projected.project(api.design.camera);
        return { x: (1 + projected.x) * api.design.container.offsetWidth / 2 + api.design.container.getBoundingClientRect().left,
            y: (1 - projected.y) * api.design.container.offsetHeight / 2 + api.design.container.getBoundingClientRect().top };
    };

    //终止点点击
    if (Navigation.boxFlag == 1&&Navigation.boxselected) {
//        Navigation.selectBoxDiv.remove();
        Navigation.selectBoxDiv.style.display="none";
        //判断每个物体映射到屏幕的位置是否在选择框内
        for (var i = 0; i < api.design.scene.children.length; i++) {
            var obj = api.design.scene.children[i];
            if(obj.userData.type!=null)
            if(obj.userData.type===api.design.ELEMENT_TYPE||obj.userData.type===api.design.COMBINATION_TYPE){
                if(obj.userData.type===api.design.COMBINATION_TYPE){
                    for(var j = 0 ; j < obj.children.length; j ++){
                        var temp_child = getObjectScreenPosition(obj.children[j].position);
                        if (temp_child.x >= Navigation.startPoint.x && temp_child.x <= event.clientX && temp_child.y >= Navigation.startPoint.y && temp_child.y <= event.clientY) {
                            api.select(obj,true,false);
                            break;
                        }
                    }
                }
                else{
                    if (obj.userData.frozen) continue;
                    var temp = getObjectScreenPosition(obj.position);
                    if (temp.x >= Navigation.startPoint.x && temp.x <= event.clientX && temp.y >= Navigation.startPoint.y && temp.y <= event.clientY) {
                        api.select(obj,true,false);
                    }
                }
            }

        }
        Navigation.boxFlag = -1;
        Navigation.boxselected = false;
        api.design.setMouseMode('select');
    }
    //初始点点击
    if (Navigation.boxFlag == 0&&Navigation.boxselected) {
        //确定选择框的左上角
        Navigation.selectBoxDiv = document.getElementById("select_box");
        Navigation.startPoint.x = event.clientX;
        Navigation.startPoint.y = event.clientY;
        Navigation.selectBoxDiv.style.left = event.clientX + "px";
        Navigation.selectBoxDiv.style.top = event.clientY + "px";
        Navigation.selectBoxDiv.style.display = "block";
        Navigation.selectBoxDiv.style.height="1px";
        Navigation.selectBoxDiv.style.width="1px";

        Navigation.boxFlag = 1;
        //当鼠标向左上角移动时也能改变
        Navigation.selectBoxDiv.addEventListener('mousemove', function (event) {
            if(Navigation.boxFlag==1&&Navigation.boxselected)
            {
                Navigation.selectBoxDiv.style.width = (event.clientX - Navigation.startPoint.x) + "px";
                Navigation.selectBoxDiv.style.height = (event.clientY - Navigation.startPoint.y) + "px";
            }
        }, false);
        Navigation.selectBoxDiv.addEventListener('mouseup', function (event) {
            if(Navigation.boxselected)
            {
                Navigation.selectBoxControl(event);
            }
        });
    }
};
//复制
Navigation.copy = function () {
    var objectFocus = api.design.cloneFocus();
    objectFocus.position.x = objectFocus.position.x + 100 * objectFocus.scale.x;
};
//删除
Navigation.delete = function () {
    api.delete();
};
//撤销
Navigation.back = function () {
    alert("撤销");
};
//重置位置
Navigation.resetPosition = function () {
    var selectedList = api.getSelctedList();
    for (var i = 0; i < selectedList.length; i++) {
        var selectedModel = api.findOBJbyId(parseInt(selectedList[i].id));
        if (selectedModel != null) {
//            if (selectedModel.mainstructure)
            api.resetOBJ(selectedModel, {x: 0, y: 0, z: 0}, null, null);
//            else selectedModel.refresh(design, {x: -200, y: 0, z: -200}, null, null);
            OperationPannel.showParam();
        }
    }
};
//重置姿态
Navigation.resetAttitude = function () {
    var selectedList = api.getSelctedList();
    for (var i = 0; i < selectedList.length; i++) {
        var selectedModel = api.findOBJbyId(parseInt(selectedList[i].id));
        if (selectedModel != null) {
            var rotation = new THREE.Euler(0,0,0,'XYZ');
            api.resetOBJ(selectedModel, null, rotation, null);
            OperationPannel.showParam();
        }
    }
};
//重置比例
Navigation.resetScale = function () {
    var selectedList = api.getSelctedList();
    for (var i = 0; i < selectedList.length; i++) {
        var selectedModel = api.findOBJbyId(parseInt(selectedList[i].id));
        if (selectedModel != null) {
            api.resetOBJ(selectedModel, null, null, {x: 1, y: 1, z: 1});
            OperationPannel.showParam();
        }
    }
};
//组件分类管理
Navigation.classifyManagement = function () {
    $('#classify_dialog').dialog({
        position: { my: "left+82 bottom", at: "left+82 bottom", of: window },
        resizable: false
    });
};

//统计
Navigation.statistic = function () {
    this.computeCenter();
    $('#statistic_dialog').dialog({
        position: { my: "center", at: "center", of: window }
    });
};

//计算包括质心在内的参数
Navigation.computeCenter=function(){
    $("#center_X")[0].value = 0;
    $("#center_Y")[0].value = 0;
    $("#center_Z")[0].value = 0;
    var mass = 0;
    var power = 0;
    var maxpower = 0;

    api.getSceneStructers();
    for (var i = 0; i < api.structures.length; i++) {
        var obj = api.structures[i];
        if (obj.userData.type===api.design.ELEMENT_TYPE) {
            mass += parseFloat(obj.userData.structParameter.mass);
            power += parseFloat(obj.userData.structParameter.averagePower);
            maxpower += parseFloat(obj.userData.structParameter.apexPower);
        }
    }

    for(var i=0; i<api.structures.length; i++){
        var obj = api.structures[i];
        var tem = obj.clone();
        var pos = tem.position.clone();
        if(obj.userData.type===api.design.ELEMENT_TYPE){
            pos.applyMatrix4(obj.parent.matrixWorld);
            $("#center_X")[0].value += parseFloat(pos.x) * parseFloat(obj.userData.structParameter.mass);
            $("#center_Y")[0].value += parseFloat(pos.y) * parseFloat(obj.userData.structParameter.mass);
            $("#center_Z")[0].value += parseFloat(pos.z) * parseFloat(obj.userData.structParameter.mass);
        }
    }

    if (mass != 0) {
        $("#center_X")[0].value /= mass;
        $("#center_Y")[0].value /= mass;
        $("#center_Z")[0].value /= mass;
    }
    $("#center_X")[0].innerHTML = $("#center_X")[0].value.toFixed(2);
    $("#center_Y")[0].innerHTML = $("#center_Y")[0].value.toFixed(2);
    $("#center_Z")[0].innerHTML = $("#center_Z")[0].value.toFixed(2);
    $("#massvalue")[0].innerHTML = mass.toFixed(2);
    $("#powervalue")[0].innerHTML = power.toFixed(2);
    $("#maxpowervalue")[0].innerHTML = maxpower.toFixed(2);
    var position = new THREE.Vector3($("#center_X")[0].value,$("#center_Y")[0].value,$("#center_Z")[0].value);
    var scale = new THREE.Vector3(4,4,4);
    //清除原有的质心并重绘
    for(var i = 0; i < api.structures.length;i++){
        if(api.structures[i].name=="质心"){
            api.removeCenter(api.structures[i]);
            break;
        }
    }
    api.loadCenter("Centeroid.obj", "Centeroid.mtl",position);
    api.structures=[];
};
//打开相机视场窗口
Navigation.setCameraView = function(){
    $('#camera_view_dialog').dialog({
        position: { my: "center", at: "center", of: window }
    });
    var selectList = api.getSelctedList();
    if(selectList.length == 1 && selectList[0].name == "Opticalcamera"){
        var select = selectList[0];
        $("#camera-view-height")[0].value = select.children[select.children.length - 1].userData.height;
        $("#camera-view-angle")[0].value = select.children[select.children.length - 1].userData.radiusBottom;
    }
};
//更新相机视场
Navigation.updateCameraView = function(){
    var selectList = api.getSelctedList();
    if(selectList.length == 1 && selectList[0].name == "Opticalcamera"){
        var select = selectList[0];
        var view = select.children[select.children.length - 1].clone();
        var radiusBottom = $("#camera-view-angle")[0].value;
        var height = $("#camera-view-height")[0].value;
        var viewGeometry = new THREE.CylinderGeometry(10, radiusBottom, height, 50, 1, false);
        var viewMaterial = new THREE.MeshBasicMaterial({opacity: 0.2, transparent: true, color: "#ffffff"});
        var viewMesh = new THREE.Mesh(viewGeometry, viewMaterial);
        viewMesh.position.x = view.position.x; viewMesh.position.y = view.position.y + 1 / 2 * (height - view.userData.height) * view.scale.y; viewMesh.position.z = view.position.z;
        viewMesh.scale.x = view.scale.x; viewMesh.scale.y = view.scale.y; viewMesh.scale.z = view.scale.z;
        viewMesh.quaternion.x = view.quaternion.x; viewMesh.quaternion.y = view.quaternion.y; viewMesh.quaternion.z = view.quaternion.z; viewMesh.quaternion.w = view.quaternion.w;
        viewMesh.userData.height = height;
        viewMesh.userData.radiusBottom = radiusBottom;
        select.remove(select.children[select.children.length - 1]);
        select.add(viewMesh);
    }
};
//隐藏显示相机视场
Navigation.showCameraView = function(){
    var selectList = api.getSelctedList();
    if(selectList.length == 1 && selectList[0].name == "Opticalcamera") {
        var select = selectList[0];
        var view = select.children[select.children.length - 1];
        if($("#camera_view_show")[0].innerText == "隐藏视场"){
            view.scale.x = 0; view.scale.y = 0; view.scale.z = 0;
            $("#camera_view_show")[0].innerText = "显示视场";
            disableCameraViewElement();
        }
        else{
            view.scale.x = 1; view.scale.y = 1; view.scale.z = 1;
            $("#camera_view_show")[0].innerText = "隐藏视场";
            enableCameraViewElement();
        }
    }
    function disableCameraViewElement(){
        $("#camera-view-angle")[0].disabled = true;
        $("#camera-view-height")[0].disabled = true;
        $("#camera_view_OK")[0].disabled = true;
    }
    function enableCameraViewElement(){
        $("#camera-view-angle")[0].disabled = false;
        $("#camera-view-height")[0].disabled = false;
        $("#camera_view_OK")[0].disabled = false;
    }
};
//修改组件颜色
Navigation.updateColor = function(){
    var color = $("#componentID")[0].value;
    if(api.design.selected[0] != undefined){
        api.setObjectColors(api.design.selected, color);
    }
};

//线框模式
Navigation.showFrame= function(){
    while(api.design.selected.length!=0){
        var obj = api.design.selected[0];
        for(var i = 0 ; i< obj.children.length; i++){
            var frame;
            var child = obj.children[i];
            if(child.type === "Group"){
                var frame = new THREE.EdgesHelper(obj.children[i].children[0], 0x00ff00);
                var child = obj.children[i];
                var temp = child.clone();
                temp.position.applyMatrix4(obj.matrixWorld);
                frame.position.copy(temp.position);
            }
            else{
                frame = new THREE.EdgesHelper(obj.children[i],0x00ff00);
                frame.position.copy(obj.position);
            }
            frame.matrixAutoUpdate = true;
            frame.name = "EdgesFrame";
            api.design.scene.add(frame);
        }
        api.design.hideOBJ(obj);
    }
}

//实体模式
Navigation.showEntity= function(){
    api.getSceneStructers();
    for (var i = 0; i < api.structures.length; i++) {
        var obj = api.structures[i];
        if (obj.userData.type!=null) {
                api.design.showOBJ(obj);
        }
    }

    for(var i=0; i<api.design.scene.children.length; i++){
        var meshobj = api.design.scene.children[i];
        if(meshobj.name === "EdgesFrame"){
            api.design.scene.remove(meshobj);
            i--;
        }

    }

}


//修改颜色控件的值
Navigation.updateInputColor = function(color){
    $("#componentID")[0].value = rgb2hex(color.getStyle());
    //将十进制数转成十六进制数
    function zero_fill_hex(num, digits) {
        var s = num.toString(16);
        while (s.length < digits)
            s = "0" + s;
        return s;
    }
    //将颜色rgb转成带#号的字符串
    function rgb2hex(rgb) {

        if (rgb.charAt(0) == '#')
            return rgb;

        var ds = rgb.split(/\D+/);
        var decimal = Number(ds[1]) * 65536 + Number(ds[2]) * 256 + Number(ds[3]);
        return "#" + zero_fill_hex(decimal, 6);
    }
};
//打开阵列
Navigation.shatterCrack = function(){
    $('#shatter_crack_dialog').dialog({
        position: { my: "right top+18", at: "right top+18", of: window },
        resizable: false
    });
};
//确定阵列
Navigation.crackOK = function(){
    var crackNum = $("#crackNum")[0].value;
    var crackAxis = $("#crackAxis")[0].value;
    var axis;
    switch(crackAxis){
        case "crackX": axis = new THREE.Vector3(1, 0, 0);break;
        case "crackY": axis = new THREE.Vector3(0, 1, 0);break;
        case "crackZ": axis = new THREE.Vector3(0, 0, 1);break;
    }
    api.design.arrayClone(crackNum - 1, null, axis);
    $('#shatter_crack_dialog').dialog("destroy");
};
//确定阵列的键盘事件
Navigation.crackKeydown = function(e){
    e = e||event;
    switch(e.keyCode){
        case 13: Navigation.crackOK();break;
    }
};