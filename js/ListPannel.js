/**
 * 列表板
 */

var ListPannel={
    modelVisiblable : true
};

//当没有零件选中时，列表板为不可操作状态
ListPannel.disableListPanel=function(modeltype){
    for(var i=0; i< $("#modelList")[0].children.length; i++)
    {
        var modelType;
        var modelid = $("#modelList")[0].children[i].id;
        var model = api.findOBJbyId(parseInt(modelid));
        if(model!=null){
            modelType = model.userData.classifyType;
            if(modelType==modeltype){
                $("#modelList")[0].children[i].children[0].disabled=true;
                $("#modelList")[0].children[i].children[2].style.display="none";
            }
        }
    }
}

//将列表板从不可操作状态恢复
ListPannel.recoverListPanel=function(modeltype){
    for(var i=0; i< $("#modelList")[0].children.length; i++)
    {
        var modelType;
        var modelid = $("#modelList")[0].children[i].id;
        var model = api.findOBJbyId(parseInt(modelid));
        if(model!=null){
            modelType = model.userData.classifyType;
            if(modelType==modeltype){
                $("#modelList")[0].children[i].children[0].disabled=false;
                $("#modelList")[0].children[i].children[2].style.display="block";
            }
        }
    }
}

//将场景中的模型添加到列表板中
ListPannel.addModelToList = function (ModelName, newStru) {
    //在列表板中添加一条div
    var div = document.getElementById("list_template").cloneNode(true);
    div.style.display = "block";
    div.id = newStru.id;
    $("#modelList")[0].appendChild(div);
    var len = $(".modelChecked").length - 2;
    div.children[1].value = ModelName;
    div.children[0].id=newStru.id+"_check"+len;
    div.children[1].id=newStru.id+"_name"+len;
    div.children[2].id=newStru.id+"_visible"+len;
}

//设置列表板中所有零件的选中状态
ListPannel.setModelChecked=function(){
    for(var i=0; i<$(".modelChecked").length; i++){
        $(".modelChecked")[i].checked=false;
    }
    for(var j=0; j< api.design.selected.length;j++){
        for(var i=0; i<$(".modelChecked").length; i++){
            if($(".modelChecked")[i].id.split("_")[0]==parseInt(api.design.selected[j].id)){
                $(".modelChecked")[i].checked=true;
                break;
            }
        }
    }
}
//设置列表板中所有零件的可见状态
ListPannel.setModelVisible=function(){
    for(var i=0; i<$(".modelVisible").length; i++){
        var modelid = $(".modelChecked")[i].id.split("_")[0];
        var modelstru = api.findOBJbyId(parseInt(modelid));
        if(modelstru!=null){
            if(modelstru.visible){
                this.modelVisiblable = true;
                this.showModel(modelid);
            }
            else{
                this.modelVisiblable=false;
                this.hideModel(modelid);
            }
        }
    }
}


//清空给定节点的子节点
ListPannel.clearChildren=function(pnode){
    var children = pnode.childNodes;
    for(var i = children.length-1; i>=0; i--){
        pnode.removeChild(children.item(i));
    }
}
//点击组合或分离时，重新绘制列表板
ListPannel.updateList=function(){
    this.clearChildren($("#modelList")[0]);
    for(var i=0; i<api.design.root.children.length; i++){
        var obj = api.design.root.children[i];
        if(obj.userData.type!=null)
        if(obj.type==="Group"||obj.userData.type===api.design.COMBINATION_TYPE||obj.userData.type===api.design.ELEMENT_TYPE){
            this.addModelToList(obj.name,obj);
            if(obj.userData.type===api.design.COMBINATION_TYPE) {
                for(var j=0; j< obj.children.length; j++){
                    var div = document.getElementById("list_secondary_template").cloneNode(true);
                    div.style.display = "block";
                    div.id = obj.children[j].id;
                    div.value = obj.children[j].name;
                    var pdiv = document.getElementById(obj.id);
                    pdiv.appendChild(div);
                }
            }
            if(obj.type==="Group"){
                for(var k=0; k< obj.children.length; k++){
                    var child = obj.children[k];
                    if(child.userData.type!=null)
                    if(child.userData.type===api.design.COMBINATION_TYPE||child.userData.type===api.design.ELEMENT_TYPE){
                        var div = document.getElementById("list_secondary_template").cloneNode(true);
                        div.style.display = "block";
                        div.id = obj.children[k].id;
                        div.value = obj.children[k].name;
                        var pdiv = document.getElementById(obj.id);
                        pdiv.appendChild(div);
                    }
                }
            }
        }
    }
    this.setModelChecked();
    this.setModelVisible();
}

//将零件从场景中删除时，同时将该零件从列表板中清除
ListPannel.removeModelFromList = function (id) {
    var model = document.getElementById(id);
    model.remove();
}

//通过列表板中的复选框操作模型
ListPannel.chooseModel=function(model){
    var id=model.id.split("_")[0];
    var newStru = api.findOBJbyId(parseInt(id));
    if (model.checked) {
        api.select(newStru,true,false);
    }
    else {
       api.deselect(newStru);
    }
}

//改变列表板中零件的名称
ListPannel.changeName=function(model){
    var id = model.id.split("_")[0];
    var newStru = api.findOBJbyId(parseInt(id));
    api.resetOBJ(newStru,null,null,null,model.value);
}
//通过列表板中的眼睛操作模型
ListPannel.visibleModel=function(model){
    var id=model.id.split("_")[0];
    var newStru = api.findOBJbyId(parseInt(id));
    if (this.modelVisiblable) {
        this.modelVisiblable = false;
        model.src = "../resource/icons/button_icons/invisible.png";
        api.deselect(newStru);
        api.hide(newStru);
    }
    else {
        this.modelVisiblable = true;
        model.src = "../resource/icons/button_icons/visible.png";
        api.show(newStru);
    }
}

//当场景中零件可见时，列表中该零件对应的眼睛为可见状态
ListPannel.showModel=function(id){
    this.modelVisiblable = true;
    var model = document.getElementById(id);
    model.children[2].src ="../resource/icons/button_icons/visible.png";
}
//当场景中零件被隐藏时，列表中零件对应的眼睛为隐藏状态；
ListPannel.hideModel=function(id){
    this.modelVisiblable=false;
    var model = document.getElementById(id);
    model.children[2].src ="../resource/icons/button_icons/invisible.png";
}