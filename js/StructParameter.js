/**
 * Created by dell on 2015/12/31.
 * 组件参数面板（非几何属性）
 */
var StructParameter = function (exploreTarget, mass, averagePoser, apexPower, nodeName) {
    this.exploreTarget = exploreTarget;
    this.mass = mass;
    this.averagePower = averagePoser;
    this.apexPower = apexPower;
//    this.nodeName = nodeName;
};
//在面板中显示组件参数
StructParameter.show = function () {
    var selectedList = api.getSelctedList();
    if (selectedList.length == 1 && selectedList[0].userData.type === api.design.ELEMENT_TYPE) {
        StructParameter.enable();
        var struct = api.findOBJbyId(parseInt(selectedList[0].id));
        var structType = ClassifyPannel.structType[struct.userData.classifyType];
        if (struct != null && structType != undefined) {
            if(struct.userData.classifyType == 0){
                $('#model-name')[0].value = struct.name;
                $('#model-type')[0].value = structType;
                $('#div_explore_target').css("display", "none");
                $('#model-mass')[0].value = struct.userData.structParameter.mass;
                $('#div_model_average_power').css("display", "none");
                $('#div_model_apex_power').css("display", "none");
            }
            else{
                $('#div_explore_target').css("display", "block");
                $('#div_model_average_power').css("display", "block");
                $('#div_model_apex_power').css("display", "block");
                $('#model-name')[0].value = struct.name;
                $('#model-type')[0].value = structType;
                $('#explore-target')[0].value = struct.userData.structParameter.exploreTarget;
                $('#model-mass')[0].value = struct.userData.structParameter.mass;
                $('#model-average-power')[0].value = struct.userData.structParameter.averagePower;
                $('#model-apex-power')[0].value = struct.userData.structParameter.apexPower;
//            $('#model-node-name')[0].value = struct.data.nodeName;
            }
        }
    }
    else {
        StructParameter.clear();
        StructParameter.disable();
    }
};
//清空面板中的属性值
StructParameter.clear = function () {
    $('#model-name')[0].value = null;
    $('#model-type')[0].value = null;
    $('#explore-target')[0].value = null;
    $('#model-mass')[0].value = null;
    $('#model-average-power')[0].value = null;
    $('#model-apex-power')[0].value = null;
//    $('#model-node-name')[0].value = null;
};
//禁用面板中的组件
StructParameter.disable = function () {
    $('#model-name')[0].disabled = true;
    $('#model-type')[0].disabled = true;
    $('#explore-target')[0].disabled = true;
    $('#model-mass')[0].disabled = true;
    $('#model-average-power')[0].disabled = true;
    $('#model-apex-power')[0].disabled = true;
//    $('#model-node-name')[0].disabled = true;
    $('#model_save_parameter')[0].disabled = true;
};
//接触禁用面板中的组件
StructParameter.enable = function () {
    $('#model-name')[0].disabled = false;
    $('#model-type')[0].disabled = false;
    $('#explore-target')[0].disabled = false;
    $('#model-mass')[0].disabled = false;
    $('#model-average-power')[0].disabled = false;
    $('#model-apex-power')[0].disabled = false;
//    $('#model-node-name')[0].disabled = false;
    $('#model_save_parameter')[0].disabled = false;
};
//从xml文件中读取参数
StructParameter.read = function (name) {
//    var xml = XMLAnalysis.loadXML("../data/model-parameter.xml");
//    var name = xml.getElementsByTagName("组件名称");
//    console.log(name);
      //JQuery向后台发送请求
    $.ajax({
        type: "get",
        url: TSD.THREESD_SERVICE_URL_PREFIX + "StructFileManage/getFileByString.json?path=data/model/model-parameter",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
//        data: JSON.stringify(
//            {
//                userId: "data/model",
//                fileName: "modelss.json",
//                data: "{\"name\":\"cube\"}"
//            }
//        ),
        success: function(data, textStatus){
            console.log(data);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown){

        }
    });
};
//保存参数
StructParameter.save = function () {
    var selectedList = api.getSelctedList();
    if(selectedList.length == 1){
        var selected = selectedList[0];
        var weight = Number($("#model-mass")[0].value);
        selected.userData.weight = weight;
        selected.userData.structParameter.mass = weight;
        var type = ClassifyPannel.getModelType(selected.userData.classifyType);
        var name = selected.name;//修改成userData中获取????????
        //修改localStorage中的模型质量
        StructParameter.updateLocalStorageModelWeight(type, name, weight);
//        alert("保存成功");
    }
};
//修改localStorage中的模型质量
StructParameter.updateLocalStorageModelWeight = function(type, name, weight){
    if(window.localStorage){
        if(localStorage.getItem("modelWeight")){
            var modelWeight = JSON.parse(localStorage.getItem("modelWeight"));
            modelWeight[type][name] = weight;
            localStorage.setItem("modelWeight", JSON.stringify(modelWeight));
        }
    }
    else{
        alert("该浏览器不支持localStorage，localStorage中未存储模型质量，请更换浏览器");
    }
};
//获取localStorage中模型质量
StructParameter.getLocalStorageModelWeight = function(type, name){
    if(window.localStorage){
        if(localStorage.getItem("modelWeight")){
            var modelWeight = JSON.parse(localStorage.getItem("modelWeight"));
            return modelWeight[type][name];
        }
        else{
            return null;
        }
    }
    else{
        alert("该浏览器不支持localStorage，localStorage中未存储模型质量，请更换浏览器");
        return null;
    }
};