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
//给定数据和路径保存文件
FileOperation.fileSave = function(data, path, fileName){
    const fs = require("fs");
    fs.writeFileSync(path + fileName, data);
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
