/**
 * Created by dell on 2016/1/12.
 */
//用于文件操作的类
var FileOperation = function(){
};

//给定数据和文件名导出文件
FileOperation.fileExport = function (data, fileName, extension){
    var aLink = document.createElement("a");
    var blob = new Blob([data]);
    var evt = document.createEvent("MouseEvents");
    evt.initEvent("click", false, false);
    aLink.download = fileName + "." + extension;
    aLink.href = URL.createObjectURL(blob);
    aLink.dispatchEvent(evt);
};
//导出scene文件
FileOperation.exportSceneFile = function(){
    //获取场景中模型的scene、mesh和material内容
    var sceneData = {data: "", fileName: ""}, meshDatas = [], meshFileNameNum = [], materialData = {data: "", fileName: ""};
    api.getStructureScene(sceneData, meshDatas, meshFileNameNum, materialData);
    //判断场景中是否有模型
    if(meshDatas.length > 0){
        //将scene文件下载到本地
        FileOperation.fileExport(sceneData.data, sceneData.fileName, "scene");
        //将material文件下载到本地
        FileOperation.fileExport(materialData.data, materialData.fileName, "material");
        //将mesh文件下载到本地
        for(var i = 0; i < meshDatas.length; i++){
            FileOperation.fileExport(meshDatas[i]["data"], meshDatas[i]["fileName"], "mesh.xml");
        }
    }
};
//保存文件到服务器
FileOperation.save = function(path, fileName, data){
    $.ajax({
        type: "post",
        url: TSD.THREESD_SERVICE_URL_PREFIX + "StructFileManage/createFile.json",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify(
            {
                userId: path,
                fileName: fileName + ".json",
                data: data
            }
        ),
        success: function(data, textStatus){
            alert("保存成功");
        },
        error: function(XMLHttpRequest, textStatus, errorThrown){
            alert("保存失败");
        }
    });
};

//读取文件内容(从本地)
FileOperation.openFile = function(file){
    var reader = new FileReader();
    reader.addEventListener( 'load', function ( event ) {
        var contents = event.target.result;
        try{
            api.design.load(contents);
        }
        catch(e){
            alert("文件格式错误");
        }
    }, false );
    reader.readAsText( file );
};
//读取文件内容(从服务器)
//FileOperation.openFile = function(path){
//    var fileContent = null;
//    $.ajax({
//        type: "get",
//        url: TSD.THREESD_SERVICE_URL_PREFIX + "StructFileManage/getFileByString.json?path=" + path,
//        async: false,
//        contentType: "application/json; charset=utf-8",
//        dataType: "json",
//        success: function(data, textStatus){
//            fileContent = data;
//        },
//        error: function(XMLHttpRequest, textStatus, errorThrown){
//            alert("获取文件内容失败");
//        }
//    });
//    return fileContent;
//};
//打开文件列表
FileOperation.openFileList = function(path){
    var fileList = null;
    $.ajax({
        type: "get",
        url: TSD.THREESD_SERVICE_URL_PREFIX + "StructFileManage/getSaveList.json?userId=" + path,
        async: false,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function(data, textStatus){
            fileList = data;
        },
        error: function(XMLHttpRequest, textStatus, errorThrown){
            alert("获取文件列表失败");
        }
    });
    return fileList;
};