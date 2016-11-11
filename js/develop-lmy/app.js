(function() {



  var UI_init, design, global, keyBoard, loadOBJMTL, onResize;

  global = this;

  design = void 0;
  //设置组件的颜色数组
    var structureColor = [];
    structureColor.push(new THREE.Color(0.11, 0.35, 0.69));
    structureColor.push(new THREE.Color(0.5, 0.25, 0));
    structureColor.push(new THREE.Color(1, 0, 0));
    structureColor.push(new THREE.Color(0, 1, 0));
    structureColor.push(new THREE.Color(1, 1, 0));
    structureColor.push(new THREE.Color(0, 0, 1));
    structureColor.push(new THREE.Color(0.5, 0, 0));
    structureColor.push(new THREE.Color(0.4, 0.47, 0.6));
    structureColor.push(new THREE.Color(0.87, 0.64, 0.84));
//用localStorage初始化模型库的质量
    var DEFAULT_MODEL_WEIGHT = 18.1;
    var initModelWeight = function(){
        var localStorage = window.localStorage;
        if(!localStorage){
            alert("该浏览器不支持localStorage，模型质量不能被初始化，请更换浏览器");
            return;
        }//localStorage.clear();
        if(!localStorage.getItem("modelWeight")){
            var modelWeight = {};
            //给基础模型赋值
            modelWeight["baseModel"] = {};
            modelWeight["baseModel"]["Cube"] = DEFAULT_MODEL_WEIGHT;
            modelWeight["baseModel"]["Cylinder"] = DEFAULT_MODEL_WEIGHT;
            modelWeight["baseModel"]["Panel"] = DEFAULT_MODEL_WEIGHT;
            modelWeight["baseModel"]["Sphere"] = DEFAULT_MODEL_WEIGHT;
            modelWeight["baseModel"]["Tube"] = DEFAULT_MODEL_WEIGHT;
            modelWeight["baseModel"]["Disk"] = DEFAULT_MODEL_WEIGHT;
            modelWeight["baseModel"]["Bar"] = DEFAULT_MODEL_WEIGHT;
            modelWeight["baseModel"]["Stick"] = DEFAULT_MODEL_WEIGHT;
            //给卫星平台赋值
            modelWeight["satePlatform"] = {};
            modelWeight["satePlatform"]["CircularPlatform"] = DEFAULT_MODEL_WEIGHT;
            modelWeight["satePlatform"]["CubePlatform"] = DEFAULT_MODEL_WEIGHT;
            modelWeight["satePlatform"]["Spinstabilized"] = DEFAULT_MODEL_WEIGHT;
            modelWeight["satePlatform"]["Threeaxisstabilizedsatellite"] = DEFAULT_MODEL_WEIGHT;
            modelWeight["satePlatform"]["DarkmatterPlatform"] = DEFAULT_MODEL_WEIGHT;
            //给内部组件赋值
            modelWeight["innerLoad"] = {};
            modelWeight["innerLoad"]["BatteryPack"] = DEFAULT_MODEL_WEIGHT;
            modelWeight["innerLoad"]["Distributionbox"] = DEFAULT_MODEL_WEIGHT;
            modelWeight["innerLoad"]["Magneticassemblylinebox"] = DEFAULT_MODEL_WEIGHT;
            modelWeight["innerLoad"]["MomentumWheel"] = DEFAULT_MODEL_WEIGHT;
            modelWeight["innerLoad"]["StarComputerServices"] = DEFAULT_MODEL_WEIGHT;
            modelWeight["innerLoad"]["DarkmatterInter"] = DEFAULT_MODEL_WEIGHT;
            //给外部组件赋值
            modelWeight["outerLoad"] = {};
            modelWeight["outerLoad"]["Coarsesunsensor"] = DEFAULT_MODEL_WEIGHT;
            modelWeight["outerLoad"]["Datatransmissiontransmitter"] = DEFAULT_MODEL_WEIGHT;
            modelWeight["outerLoad"]["GPSantenna"] = DEFAULT_MODEL_WEIGHT;
            modelWeight["outerLoad"]["Omnidirectionalantenna"] = DEFAULT_MODEL_WEIGHT;
            modelWeight["outerLoad"]["Opticalcamera"] = DEFAULT_MODEL_WEIGHT;
            modelWeight["outerLoad"]["Solarpanels"] = DEFAULT_MODEL_WEIGHT;
            modelWeight["outerLoad"]["Sailboard"] = DEFAULT_MODEL_WEIGHT;
            modelWeight["outerLoad"]["Fule"] = DEFAULT_MODEL_WEIGHT;
            modelWeight["outerLoad"]["DarkmatterSailboard"] = DEFAULT_MODEL_WEIGHT;
            modelWeight["outerLoad"]["DarkmatterSingleCylinder"] = DEFAULT_MODEL_WEIGHT;
            modelWeight["outerLoad"]["DarkmatterCube"] = DEFAULT_MODEL_WEIGHT;
            //给连接件赋值
            modelWeight["connector"] = {};
            modelWeight["connector"]["Cone"] = DEFAULT_MODEL_WEIGHT;
            modelWeight["connector"]["Subtainer"] = DEFAULT_MODEL_WEIGHT;
            modelWeight["connector"]["SolarConnector"] = DEFAULT_MODEL_WEIGHT;
            modelWeight["connector"]["CorkBase"] = DEFAULT_MODEL_WEIGHT;
            modelWeight["connector"]["Base"] = DEFAULT_MODEL_WEIGHT;
            modelWeight["connector"]["Bent"] = DEFAULT_MODEL_WEIGHT;
            //给箱体赋值
            modelWeight["box"] = {};
            modelWeight["box"]["Returncapsule"] = DEFAULT_MODEL_WEIGHT;
            modelWeight["box"]["MidBox"] = DEFAULT_MODEL_WEIGHT;
            modelWeight["box"]["CircularBox"] = DEFAULT_MODEL_WEIGHT;
            modelWeight["box"]["Cube"] = DEFAULT_MODEL_WEIGHT;
            var modelWeightStr = JSON.stringify(modelWeight);
            console.log("init model weight");
            localStorage.setItem("modelWeight", modelWeightStr);
        }
    };
    initModelWeight();
  UI_init = function() {
    //根据文件名称，读取json，并加载模型
    var jsonroot="../resource/data/Model.json";
      $.getJSON(jsonroot, function(data){
          console.log(data);
          design.load(JSON.stringify(data));
      });

    var height;
    if (!Detector.webgl) {
      Detector.addGetWebGLMessage();
    }
    height = $(window).height();
    $("#mainFrame").css("height", height);
    $("#WorkSpace").css("height", height - $("#MenuSpace").height() - 9);
    $("#ModelLibrary").css("height", $("#WorkSpace").height());
    $("#accordion").css("height", $("#ModelLibrary").height());
    $("#desiginScene").css("height", $("#WorkSpace").height());
    $("#accordion").accordion({
      active: 0,
      heightStyle: "content",
      icons: false
    });
    $("#menu").menu();
    if (design) {
      design.suit();
    } else {
      design = new ThreeSD('desiginScene');
    }
      design.onSelChange=function(){
          ListPannel.updateList();
          //选中物体时，将颜色控件中的颜色值改为所选中物体的颜色
          if(api.design.selected[0] != undefined){
              var select = api.design.selected[0];
              var color = new THREE.Color();
              selectColor(select);
              Navigation.updateInputColor(color);
              function selectColor(select){
                  if(select.userData.type === undefined){
                      color.r = select.material.color.r;
                      color.g = select.material.color.g;
                      color.b = select.material.color.b;
                  }
                  else{
                      for(var i = 0; i < select.children.length; i++){
                          selectColor(select.children[i]);
                      }
                  }
              }
          }
          OperationPannel.showParam();
          StructParameter.show();
      };
      design.onTransformChange = function(){
          OperationPannel.showParam();
      }
      design.container.addEventListener('mouseup',function(event){
          if(Navigation.boxselected)
          Navigation.selectBoxControl(event);
      });
      design.container.addEventListener('mousedown',function(event){
          if(Navigation.boxselected)
          Navigation.selectBoxControl(event);
      });
      design.container.addEventListener('mousemove',function(event){
          //控制选择框
          if (Navigation.boxFlag == 1&&Navigation.boxselected) {
              Navigation.selectBoxDiv = document.getElementById("select_box");
              Navigation.selectBoxDiv.style.width = (event.clientX - Navigation.startPoint.x) + "px";
              Navigation.selectBoxDiv.style.height = (event.clientY - Navigation.startPoint.y) + "px";
          }
      });
//

//      if(design.selectByMouse()!=null)
//          $('#desiginScene').contextPopup({
//              items: [
//                  {label:'平移',     icon:'../resource/icons/button_icons/translate.png', action:function() { api.setTransformMode('translate') } },
//                  {label:'旋转', icon:'../resource/icons/button_icons/rotate.png',    action:function() { api.setTransformMode('rotate') } },
//                  {label:'缩放',     icon:'../resource/icons/button_icons/scale.png',  action:function() { api.setTransformMode('scale') } },
//                  null, /* null can be used to add a separator to the menu items */
//                  {label:'组合',     icon:'../resource/icons/button_icons/combine.png', action:function() { api.combine() } },
//                  {label:'分离', icon:'../resource/icons/button_icons/separate.png',    action:function() { api.separate()} },
//                  {label:'吸附',     icon:'../resource/icons/button_icons/assembly.png',  action:function() { Navigation.assembly() } },
//                  null,
//                  {label:'复制',     icon:'../resource/icons/button_icons/copy.png', action:function() { Navigation.copy() } },
//                  {label:'设定视场',     icon:'../resource/icons/button_icons/reset.png',  action:function() { api.setTargetOnFocus()} },
//                  {label:'删除', icon:'../resource/icons/button_icons/delete.png',    action:function() { Navigation.delete()} }
//              ]});

      global.api = {
          addModel: function(filepath) {
              var path = require('path');
             //  console.log(filepath);
             //  return;
             //  var modelList;
             //  modelList = {};
             // modelList["baseMode_1"] = "Cube";
             //  modelList["baseMode_2"] = "Cylinder";
             //  modelList["baseMode_1"] = "Cube";
             //  modelList["baseMode_2"] = "Cylinder";
             //  modelList["baseMode_3"] = "Panel";
             //  modelList["baseMode_4"] = "Sphere";
             //  modelList["baseMode_5"] = "Tube";
             //  modelList["baseMode_6"] = "Disk";
             //  modelList["baseMode_7"] = "Bar";
             //  modelList["baseMode_8"] = "Stick";
             //  modelList["satePlatform_1"]="CircularPlatform";
             //  modelList["satePlatform_2"] = "CubePlatform";
             //  modelList["satePlatform_3"] = "Spinstabilized";
             //  modelList["satePlatform_4"] = "Threeaxisstabilizedsatellite";
             //  modelList["satePlatform_5"] = "DarkmatterPlatform";
             //  modelList["innerLoad_1"] = "BatteryPack";
             //  modelList["innerLoad_2"] = "Distributionbox";
             //  modelList["innerLoad_3"] = "Magneticassemblylinebox";
             //  modelList["innerLoad_4"] = "Face";
             //  modelList["innerLoad_5"] = "StarComputerServices";
             //  modelList["innerLoad_6"] = "DarkmatterInter";
             //  modelList["outerLoad_1"] = "Coarsesunsensor";
             //  modelList["outerLoad_2"] = "Datatransmissiontransmitter";
             //  modelList["outerLoad_3"] = "GPSantenna";
             //  modelList["outerLoad_4"] = "Omnidirectionalantenna";
             //  modelList["outerLoad_5"] = "Opticalcamera";
             //  modelList["outerLoad_6"] = "Solarpanels";
             //  modelList["outerLoad_7"] = "Sailboard";
             //  modelList["outerLoad_8"] = "FuleTank";
             //  modelList["outerLoad_9"] = "DarkmatterSailboard";
             //  modelList["outerLoad_10"] = "DarkmatterSingleCylinder";
             //  modelList["outerLoad_11"] = "DarkmatterCube";
             //  modelList["connector_1"] = "Cone";
             //  modelList["connector_2"] = "Subtainer";
             //  modelList["connector_3"] = "SorlarPanelConnector";
             //  modelList["connector_4"] = "CorkBase";
             //  modelList["connector_5"] = "Base";
             //  modelList["connector_6"] = "Bent";
             //  modelList["box_1"] = "ReturnCapsule";
             //  modelList["box_2"] = "MidBox";
             //  modelList["box_3"] = "CircularBox";
             //  modelList["box_4"] = "CubeBox";
             //  console.log(path.normalize(filepath));
              loadOBJMTL(filepath+".obj", filepath + '.mtl', path.basename(filepath), filepath.split('/')[filepath.split('/').length-2]); //todo: here the classify

              // if(modelList[model.id]==="Sailboard"||modelList[model.id]==="CubeBox"){
              //     $.getJSON("../resource/model/" +modelList[model.id]+".json", function(data){
              //     design.load(JSON.stringify(data));
              // });
              // }
              // else
              // loadOBJMTL( modelList[model.id] + ".obj", modelList[model.id] + ".mtl",modelList[model.id],model.id);

          },
          setTransformMode: function(mode) {
              design.setTransformMode(mode);
          },
          combine: function(name) {
              design.combineSelected(name);
          },
          separate: function() {
              design.separateFocus();
          },
          //模型文件存储路径
          structureFilePath: "data/model",
          design: design,
          structures: [],
          getSceneStructers: function(){
              for(var i = 0; i < design.scene.children.length; i++){
                  search(design.scene.children[i]);//将design.scene.children[i]中的组件push到structures中
              }
              function search(structure){
                  if(structure.userData.type === design.ELEMENT_TYPE){
                      api.structures.push(structure);
                      for(var j = 0; j < structure.children.length; j++){
                          search(structure.children[j]);
                      }
                  }
              }
          },
          //将场景中的模型数据转换成scene字符串
          getStructureScene: function(sceneData, meshDatas, meshFileNameNum, materialData){
              sceneData.fileName = "dongfanghong";materialData.fileName = "dongfanghong";
              sceneData.data += "<?xml version=\"1.0\" encoding=\"UTF-8\"?>";
              sceneData.data += "<scene formatVersion=\"1.0\" upAxis=\"y\" unitsPerMeter=\"100\" minOgreVersion=\"1.8\" ogreMaxVersion=\"2.5\" author=\"OgreMax Scene Exporter (www.ogremax.com)\" application=\"3DS Max\">";
              sceneData.data += "<environment>";
              sceneData.data += "<colourAmbient r=\"" + design.ambientlight.color.r + "\" g=\"" + design.ambientlight.color.g + "\" b=\"" + design.ambientlight.color.b + "\"/>";
              var background = design.renderer.getClearColor();
              sceneData.data += "<colourBackground r=\"" + background.r + "\" g=\"" + background.g + "\" b=\"" + background.b + "\"/>";
              sceneData.data += "<clipping near=\"" + design.camera.near + "\" far=\"" + design.camera.far + "\"/>";
              sceneData.data += "</environment>";
              sceneData.data += "<nodes>";
              for(var i = 0; i < design.scene.children.length; i++){
                  search(design.scene.children[i]);//将design.scene.children[i]中的组件push到structures中
              }
              function search(structure){
                  if(structure.userData.type === design.ELEMENT_TYPE){
                      var fileName = getMeshFilename(structure.name);
                      sceneData.data += "<node name=\"" + fileName + "\">";
                      sceneData.data += "<position x=\"" + structure.position.x + "\" y=\"" + structure.position.y + "\" z=\"" + structure.position.z + "\"/>";
                      var tmp = structure.clone();
                      structure.parent.updateMatrix();
                      structure.parent.updateMatrixWorld();
                      tmp.applyMatrix(structure.parent.matrixWorld);
                      sceneData.data += "<scale x=\"" + tmp.scale.x + "\" y=\"" + tmp.scale.y + "\" z=\"" + tmp.scale.z + "\"/>";
                      sceneData.data += "<rotation qx=\"" + structure.quaternion.x + "\" qy=\"" + structure.quaternion.y + "\" qz=\"" + structure.quaternion.z + "\" qw=\"" + structure.quaternion.w + "\"/>";
                      if(api.isStructureMesh(structure)){
                          api.getStructureMeshMaterial(structure, meshDatas, meshFileNameNum, materialData, fileName);
                          sceneData.data += "<entity name=\"" + fileName + "\" castShadows=\"true\" receiveShadows=\"true\" meshFile=\"" + fileName + ".mesh\">";
                          sceneData.data += "<subentities>";
                          sceneData.data += "<subentity index=\"0\" materialName=\"" + fileName + "/Material\"/>";
                          sceneData.data += "</subentities>";
                          sceneData.data += "</entity>";
                      }
                      for(var j = 0; j < structure.children.length; j++){
                          search(structure.children[j]);
                      }
                      sceneData.data += "</node>";
                  }
              }
              sceneData.data += "</nodes>";
              sceneData.data += "</scene>";
              //计算mesh文件名字
              function getMeshFilename(name){
                  if(meshFileNameNum[name] == undefined){
                      meshFileNameNum[name] = 0;
                  }
                  else{
                      meshFileNameNum[name] += 1;
                  }
                  return name + meshFileNameNum[name];
              }
          },
          //判断一个structure的children是否有mesh类型的元素（为了判断该<node>是否有是否是一个有geometry）
          isStructureMesh: function(structure){
              for(var i = 0; i < structure.children.length; i++){
                  if(structure.children[i].type == "Mesh"){
                      return true;
                  }
              }
              return false;
          },
          //获取指定模型的mesh字符串和material字符串
          getStructureMeshMaterial: function(structure, meshDatas, meshFileNameNum, materialData, fileName){
              var meshData = "<mesh>\n";
              meshData += "\t<submeshes>\n";
              structure.updateMatrixWorld();
              //获取faces
              for(var j = 0; j < structure.children.length && structure.children[j].userData.type === undefined; j++){
                  geometry = structure.children[j].geometry;
                  var faceNum = geometry.attributes.normal.array.length / 9;
                  if(faceNum > 0){
                      //导出material文件数据
                      materialData.data += "material " + fileName + "/Material\n";
                      materialData.data += "{\n";
                      materialData.data += "\treceive_shadows on\n";
                      materialData.data += "\ttechnique\n";
                      materialData.data += "\t{\n";
                      materialData.data += "\t\tpass\n";
                      materialData.data += "\t\t{\n";
                      var ambient = structure.children[j].material.color;
                      var diffuse = structure.children[j].material.color;
                      var specular = structure.children[j].material.specular;
                      materialData.data += "\t\t\tambient " + ambient.r + " " + ambient.g + " " + ambient.b + " 1\n";
                      materialData.data += "\t\t\tdiffuse " + diffuse.r + " " + diffuse.g + " " + diffuse.b + " 1\n";
                      materialData.data += "\t\t\tspecular " + specular.r + " " + specular.g + " " + specular.b + " 1 20\n";
                      materialData.data += "\t\t}\n";
                      materialData.data += "\t}\n";
                      materialData.data += "}\n";
                      //导出mesh.xml文件数据
                      meshData += "\t\t<submesh material=\"" + fileName + "/Material\" usesharedvertices=\"false\" use32bitindexes=\"false\" operationtype =\"trangle_list\">\n";
                      meshData += "\t\t\t<faces count=\"" + faceNum + "\">\n";
                      for(var k = 0, k1 = 0, k2 = 0; k < faceNum; k++, k1 += 9, k2 += 6){
                          var position1 = new THREE.Vector3(geometry.attributes.position.array[k1], geometry.attributes.position.array[k1 + 1], geometry.attributes.position.array[k1 + 2]);
                          var position2 = new THREE.Vector3(geometry.attributes.position.array[k1 + 3], geometry.attributes.position.array[k1 + 4], geometry.attributes.position.array[k1 + 5]);
                          var position3 = new THREE.Vector3(geometry.attributes.position.array[k1 + 6], geometry.attributes.position.array[k1 + 7], geometry.attributes.position.array[k1 + 8]);
                          var vertexNormals1 = new THREE.Vector3(geometry.attributes.normal.array[k1], geometry.attributes.normal.array[k1 + 1], geometry.attributes.normal.array[k1 + 2]);
                          var vertexNormals2 = new THREE.Vector3(geometry.attributes.normal.array[k1 + 3], geometry.attributes.normal.array[k1 + 4], geometry.attributes.normal.array[k1 + 5]);
                          var vertexNormals3 = new THREE.Vector3(geometry.attributes.normal.array[k1 + 6], geometry.attributes.normal.array[k1 + 7], geometry.attributes.normal.array[k1 + 8]);
                          var meshGeometry1 = null;
                          var meshGeometry2 = null;
                          var meshGeometry3 = null;
                          if(geometry.attributes.uv != undefined && geometry.attributes.uv.array.length > 0){
                              var faceVertexUvs1 = new THREE.Vector2(geometry.attributes.uv.array[k2], geometry.attributes.uv.array[k2 + 1]);
                              var faceVertexUvs2 = new THREE.Vector2(geometry.attributes.uv.array[k2 + 2], geometry.attributes.uv.array[k2 + 3]);
                              var faceVertexUvs3 = new THREE.Vector2(geometry.attributes.uv.array[k2 + 4], geometry.attributes.uv.array[k2 + 5]);
                              meshGeometry1 = new Mesh.Geometry(position1, vertexNormals1, faceVertexUvs1);
                              meshGeometry2 = new Mesh.Geometry(position2, vertexNormals2, faceVertexUvs2);
                              meshGeometry3 = new Mesh.Geometry(position3, vertexNormals3, faceVertexUvs3);
                          }
                          else{
                              meshGeometry1 = new Mesh.Geometry(position1, vertexNormals1);
                              meshGeometry2 = new Mesh.Geometry(position2, vertexNormals2);
                              meshGeometry3 = new Mesh.Geometry(position3, vertexNormals3);
                          }
                          var vetex1 = Mesh.Geometry.pushHashGeometry(meshGeometry1.toString());
                          var vetex2 = Mesh.Geometry.pushHashGeometry(meshGeometry2.toString());
                          var vetex3 = Mesh.Geometry.pushHashGeometry(meshGeometry3.toString());
                          meshData += "\t\t\t\t<face v1=\"" + vetex1 + "\" v2=\"" + vetex2 + "\" v3=\"" + vetex3 + "\" />\n";
                      }
                      meshData += "\t\t\t</faces>\n";
                      //获取点、法向量和UV
                      meshData += "\t\t\t<geometry vertexcount=\"" + Mesh.Geometry.geometry.length + "\">\n";
                      //获取点和法向量
                      meshData += "\t\t\t\t<vertexbuffer positions=\"true\" normals=\"true\">\n";
                      for(var k = 0; k < Mesh.Geometry.geometry.length; k++){
                          meshData += "\t\t\t\t\t<vertex>\n";
                          meshData += "\t\t\t\t\t\t<position x=\"" + Mesh.Geometry.geometry[k].position.x + "\" y=\"" + Mesh.Geometry.geometry[k].position.y + "\" z=\"" + Mesh.Geometry.geometry[k].position.z + "\" />\n";
                          meshData += "\t\t\t\t\t\t<normal x=\"" + Mesh.Geometry.geometry[k].normal.x + "\" y=\"" + Mesh.Geometry.geometry[k].normal.y + "\" z=\"" + Mesh.Geometry.geometry[k].normal.z + "\" />\n";
                          meshData += "\t\t\t\t\t</vertex>\n";
                      }
                      meshData += "\t\t\t\t</vertexbuffer>\n";
                      //获取顶点的UV
                      //如果该structure有UV则读取UV并写入mesh.xml
                      if(Mesh.Geometry.geometry.length > 0 && Mesh.Geometry.geometry[0].texcoord != undefined){
                          meshData += "\t\t\t\t<vertexbuffer texture_coord_dimensions_0=\"2\" texture_coords=\"1\">\n";
                          for(var k = 0; k < Mesh.Geometry.geometry.length; k++){
                              meshData += "\t\t\t\t\t<vertex>\n";
                              meshData += "\t\t\t\t\t\t<texcoord u=\"" + Mesh.Geometry.geometry[k].texcoord.x + "\" v=\"" + Mesh.Geometry.geometry[k].texcoord.y + "\" />\n";
                              meshData += "\t\t\t\t\t</vertex>\n";
                          }
                          meshData += "\t\t\t\t</vertexbuffer>\n";
                      }
                      meshData += "\t\t\t</geometry>\n";
                      meshData += "\t\t</submesh>\n";
                      Mesh.Geometry.clearHashGeometry();
                  }
              }
              meshData += "\t</submeshes>\n";
              meshData += "</mesh>";
              var n = meshDatas.length;
              meshDatas[n] = [];
              meshDatas[n]["fileName"] = fileName;
              meshDatas[n]["data"] = meshData;
          },

          //设置Object的颜色（用color类型)
          setObjectColor: function(obj, color){
              for(var i = 0; i < obj.children.length; i++){
                  obj.children[i].material.color.r = color.r;
                  obj.children[i].material.color.g = color.g;
                  obj.children[i].material.color.b = color.b;
              }
          },
          //设置Object的颜色（用style）
          setObjectColors: function(objs, color){
              for(var i = 0; i < objs.length; i++){
                  updateColor(objs[i]);
              }
              function updateColor(obj){
                  if(obj.userData.type === undefined){
                      obj.material.color.setStyle(color);
                  }
                  else{
                      for(var j = 0; j < obj.children.length; j++){
                          updateColor(obj.children[j]);
                      }
                  }
              }
          },
          //随机生成一个颜色值
          randomColor: function(){
              var color = structureColor.shift();
              structureColor.push(color);
              return color;
          },
          findOBJbyId: function(id){
              return design.findOBJById(id);
          },
          select:function(obj,x,y){
              design.select(obj,x,y);
//              ListPannel.selectModel(obj.id);
          },
          deselect:function(obj){
              design.select(obj,true,true);
//              ListPannel.unselectModel(obj.id)
          },
          deselectAll:function(){
              while(api.design.selected.length!=0){
                  for(var i = 0 ; i< api.design.selected.length; i++){
                      this.deselect(api.design.selected[i]);
                  }
              }
          },
          getSelctedList:function(){
              return design.selected;
          },
          hide:function(obj){
              design.hideOBJ(obj);
              ListPannel.hideModel(obj.id);
          },
          show:function(obj){
              design.showOBJ(obj);
              ListPannel.showModel(obj.id);
          },
          delete:function(){
              for(var i=0;i<design.selected.length; i++){
                  ListPannel.removeModelFromList(design.selected[i].id);
              }
              design.deleteSel();
          },
          update:function(position,rotation,scale){
              design.updateFocus(position,rotation,scale);
          },
          resetOBJ:function(obj,position,rotation,scale,name){
              design.updateOBJ(obj,position,rotation,scale,name);
          },
          removeCenter:function(obj){
              design.remove(obj);
          },
          loadCenter:function(obj_path, mtl_path,position){
////              var center=null;
              loader.load(obj_path, mtl_path, function(obj){
                  design.addOBJMTL(obj,"质心",position);
                  design.updateOBJ(obj,null,null,new THREE.Vector3(4,4,4));
                  obj.userData.structParameter = new StructParameter("无", 0, 0, 0);
//                  center = obj;
              });
////              return center;
//              loadOBJMTL(obj_path, mtl_path,"质心");
          },
          setTargetOnFocus:function(){
              design.setTargetOnFocus();
          },
          recoverFocus:function(){
              design.setTarget();
          },
          setAdhere:function(){
              //将选中零件设为不可吸附
              var selected = design.selected[0];
              selected.userData.canAdhere = false;
          },
          updateListPanel:function(){
              ListPannel.updateList();
          }
      };
  };

  $(document).ready(UI_init);

  onResize = function() {
    UI_init();
  };

    var onProgress = function ( xhr ) {
        if ( xhr.lengthComputable ) {
            var percentComplete = xhr.loaded / xhr.total * 100;
            console.log( Math.round(percentComplete, 2) + '% downloaded' );
        }
    };
    var onError = function ( xhr ) { };

    THREE.Loader.Handlers.add( /\.dds$/i, new THREE.DDSLoader() );
    loader = {}
    loader.load = function(obj_path, mtl_path, callback) {
        var mtlLoader = new THREE.MTLLoader();
        mtlLoader.baseUrl = '../resource/model/';
        mtlLoader.setPath( '../resource/model/' );
        mtlLoader.load( mtl_path, function( materials ) {
            materials.preload();
            var objLoader = new THREE.OBJLoader();
            objLoader.setMaterials( materials );
            objLoader.setPath( '../resource/model/' );
            objLoader.load( obj_path, callback, onProgress, onError );
        });
    };

  loadOBJMTL = function(obj_path, mtl_path, name, classifytype) {
      loader.load(obj_path, mtl_path, function (obj){
        obj.userData.classifyType = ClassifyPannel.classifyModel(classifytype);
        var type = ClassifyPannel.getModelType(obj.userData.classifyType);
        var weight = StructParameter.getLocalStorageModelWeight(type, name);
        obj.userData.structParameter = new StructParameter("无", weight, 1.0, 5.0);
        obj.userData.weight = obj.userData.structParameter.mass;
        //判断是否是基础组件，如果是，随机生成颜色，如果不是则不修改
        if(classifytype.substr(0, 8) == "baseMode"){
            api.setObjectColor(obj, api.randomColor());
        }

//        if(obj.userData.classifyType==1)
        design.addOBJMTL(obj,name);


//          edges = new THREE.EdgesHelper( obj.children[0], 0x00ff00);
//          edges.position.x = 100;
//          edges.matrixAutoUpdate = true;
//          design.scene.add(edges);
//          edges.visible = false;
//        else design.addOBJMTL(obj, name, new THREE.Vector3(200,0,200));

        //如果是相机添加视场
          if(name == "Opticalcamera"){
              var viewGeometry = new THREE.CylinderGeometry(10, 30, 50, 50, 1, false);
              var viewMaterial = new THREE.MeshBasicMaterial({opacity: 0.2, transparent: true, color: "#ffffff"});
              var view = new THREE.Mesh(viewGeometry, viewMaterial);
              view.userData.height = 50;
              view.userData.radiusBottom = 30;
              view.rotation.x += Math.PI;
              view.position.y += 60;
              obj.add(view);
          }
    } );
  };
  keyBoard = function(event) {
//    console.log(event.keyCode)
    switch (event.keyCode) {
      case 81: //q
        design.setTransformSpace();
        break;
      case 87: //w
        design.setTransformMode('translate');
        break;
      case 69: //e
        design.setTransformMode('rotate');
        break;
      case 82: //r
        design.setTransformMode('scale');
        break;
      case 46://Delete
        design.deleteSel();
        break;
      case 90: //z
        design.setMouseMode('select');
        break;
      case 88://x
          design.resetAlign();
        design.setMouseMode('adhere');
        break;
      case 67://c
        design.setMouseMode('selectBox');
        break;
      case 83: //s
        design.save();
        break;
      case 76: //l
        design.load();
        break;
      case 27://ESC
          design.setMouseMode('select');
        break;
        case 32: //space
//            design.arrayClone(7);
            $('#shatter_crack_dialog').dialog({
                position: { my: "right top+18", at: "right top+18", of: window },
                resizable: false
            });
            break;
        case 85: //u
            design.undo();
            break
    }
  };

  window.addEventListener('keydown', keyBoard);

  window.addEventListener('resize', onResize);

}).call(this);

