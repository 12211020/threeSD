/**
 * Created by dell on 2016/1/22.
 */
var MessageBox = function(){

};
//是否保存——“是”的响应函数
MessageBox.yesSave = function(){
    $("#is_save_dialog").dialog("destroy");
    Navigation.saveStructureFileDialog();
    api.design.clear();
};
//是否保存——“否”的响应函数
MessageBox.noSave = function(){
    $("#is_save_dialog").dialog("destroy");
    api.design.clear();
};
//是否保存——“取消”的响应函数
MessageBox.isSaveCancel = function(){
    $("#is_save_dialog").dialog("destroy");
};
//保存文件——“确定”的响应函数
MessageBox.okSaveStructureFile = function(){
    $("#save_file_dialog").dialog("destroy");
    var fileName = $("#structure_file_name")[0].value;
    $("#structure_file_name")[0].value = "";
    var data = api.design.save();
    FileOperation.fileExport(data, fileName, "json");
//    FileOperation.save(api.structureFilePath, fileName, data);
};
//保存文件——“取消”的响应函数
MessageBox.cancelSaveStructureFile = function(){
    $("#save_file_dialog").dialog("destroy");
};
//打开文件列表——“打开”的响应函数
MessageBox.openStructureFile = function(){
    $("#open_file_list_dialog").dialog("destroy");
};
//打开文件列表——“取消”的响应函数
MessageBox.cancelOpenStructureFile = function(){
    $("#open_file_list_dialog").dialog("destroy");
};