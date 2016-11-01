/**
 * 操作板
 */

var OperationPannel = function(){};

//将选中零件的几何信息显示出来
OperationPannel.showParam=function() {
    var selectedList = api.getSelctedList();
    if (selectedList.length == 1) {
        var selectedModel = api.findOBJbyId(selectedList[0].id);
        if (selectedModel != null) {
            this.recoverParam();
            $("#PosX")[0].value = selectedModel.position.x.toFixed(2);
            $("#PosY")[0].value = selectedModel.position.y.toFixed(2);
            $("#PosZ")[0].value = selectedModel.position.z.toFixed(2);
            $("#AngleX")[0].value = (selectedModel.rotation._x*180/Math.PI).toFixed(2);
            $("#AngleY")[0].value = (selectedModel.rotation._y*180/Math.PI).toFixed(2);
            $("#AngleZ")[0].value = (selectedModel.rotation._z*180/Math.PI).toFixed(2);
            $("#ScaleX")[0].value = selectedModel.scale.x.toFixed(2);
            $("#ScaleY")[0].value = selectedModel.scale.y.toFixed(2);
            $("#ScaleZ")[0].value =selectedModel.scale.z.toFixed(2);
        }
    }
    else {
        this.clearParam();
        this.disableParam();
    }
}
//清空面板中的数据
OperationPannel.clearParam=function(){
    $("#PosX")[0].value = null;
    $("#PosY")[0].value = null;
    $("#PosZ")[0].value = null;
    $("#AngleX")[0].value = null;
    $("#AngleY")[0].value = null;
    $("#AngleZ")[0].value = null;
    $("#ScaleX")[0].value = null;
    $("#ScaleY")[0].value = null;
    $("#ScaleZ")[0].value = null;
}
//使面板不可编辑
OperationPannel.disableParam=function(){
    $("#PosX")[0].disabled = true;
    $("#PosY")[0].disabled = true;
    $("#PosZ")[0].disabled = true;
    $("#AngleX")[0].disabled = true;
    $("#AngleY")[0].disabled = true;
    $("#AngleZ")[0].disabled = true;
    $("#ScaleX")[0].disabled = true;
    $("#ScaleY")[0].disabled = true;
    $("#ScaleZ")[0].disabled = true;
}
//恢复面板的编辑功能
OperationPannel.recoverParam=function(){
    $("#PosX")[0].disabled = false;
    $("#PosY")[0].disabled = false;
    $("#PosZ")[0].disabled = false;
    $("#AngleX")[0].disabled = false;
    $("#AngleY")[0].disabled = false;
    $("#AngleZ")[0].disabled = false;
    $("#ScaleX")[0].disabled = false;
    $("#ScaleY")[0].disabled = false;
    $("#ScaleZ")[0].disabled = false;
}
//参数板中位置改变后，改变场景中零件的位置
OperationPannel.changePos=function() {
    var posx = parseFloat($("#PosX")[0].value);
    var posy = parseFloat($("#PosY")[0].value);
    var posz = parseFloat($("#PosZ")[0].value);
    var anglex = parseFloat($("#AngleX")[0].value)/180*Math.PI;;
    var angley = parseFloat($("#AngleY")[0].value)/180*Math.PI;
    var anglez = parseFloat($("#AngleZ")[0].value)/180*Math.PI;
    var scalex =parseFloat( $("#ScaleX")[0].value);
    var scaley =parseFloat( $("#ScaleY")[0].value);
    var scalez = parseFloat($("#ScaleZ")[0].value);

    var angle = new THREE.Euler(anglex,angley,anglez,'XYZ');
    var selectedList = api.getSelctedList();
    if (selectedList.length == 1) {
            api.update({x: posx, y: posy, z: posz}, angle, {x: scalex, y: scaley, z: scalez});
    }
}