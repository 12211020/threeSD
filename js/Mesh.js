/**
 * Created by dell on 2016/1/13.
 */
//Mesh格式文件的相关类
var Mesh = function(){

};
//获取object3D的点
Mesh.getVertices = function(object, matrixWorld){
    var geometry = object.children[object.children.length - 1].geometry;
    var vertexs = [];
    for(var j = 0; j < geometry.vertices.length; j++){
        var vertex = new THREE.Vector3(geometry.vertices[j].x, geometry.vertices[j].y, geometry.vertices[j].z);
        vertex.applyMatrix4(matrixWorld);
        vertexs.push(vertex);
    }
    return vertexs;
};
//获取object面的数量
Mesh.getFaceNum = function(object){
    var length = 0;
    for(var j = 0; j < object.children.length; j++){
        var geometry = object.children[j].geometry;
        for(var k = 0; k < geometry.faces.length; k++){
            length++;
        }
    }
    return length;
};
Mesh.Geometry = function(position, normal, texcoord){
    this.position = new THREE.Vector3(position.x, position.y, position.z);
    this.normal = new THREE.Vector3(normal.x, normal.y, normal.z);
    if(texcoord != undefined){
        this.texcoord = new THREE.Vector2(texcoord.x, texcoord.y);
    }
};
//将Geometry转成字符串
Mesh.Geometry.prototype.toString = function(){
    var str = this.position.x.toString() + " " + this.position.y.toString() + " " + this.position.z.toString();
    str += " " + this.normal.x.toString() + " " + this.normal.y.toString() + " " + this.normal.z.toString();
    if(this.texcoord != undefined){
        str += " " + this.texcoord.x.toString() + " " + this.texcoord.y.toString();
    }
    return str;
};
//将字符串转成Geometry
Mesh.Geometry.toGeometry = function(sGeometry){
    var array = sGeometry.split(" ");
    var position = new THREE.Vector3(array[0], array[1], array[2]);
    var normal = new THREE.Vector3(array[3], array[4], array[5]);
    var texcoord = null;
    var geometry = null;
    if(array.length > 6){
        texcoord = new THREE.Vector2(array[6], array[7]);
        geometry = new Mesh.Geometry(position, normal, texcoord);
    }
    else{
        geometry = new Mesh.Geometry(position, normal);
    }
    return geometry;
};
//存储Mesh文件中Geometry中的position、normal和texcoord组成的字符串数组
Mesh.Geometry.hash = [];
//存储Mesh文件中Geometry中的position、normal和texcoord组成Mesh.Geometry类型的数组
Mesh.Geometry.geometry = [];
//将字符串push到Mesh.Geometry.hash中
Mesh.Geometry.pushHashGeometry = function(key){
    if(Mesh.Geometry.hash[key] == undefined){
        var index = Mesh.Geometry.hash.length++;
        Mesh.Geometry.hash[key] = index;
        Mesh.Geometry.geometry[index] = Mesh.Geometry.toGeometry(key);
        return index;
    }
    else{
        return Mesh.Geometry.hash[key];
    }
};

//清空Mesh.Geometry.hash和Mesh.Geometry.geometry
Mesh.Geometry.clearHashGeometry = function(){
    Mesh.Geometry.hash = [];
    Mesh.Geometry.geometry = [];
};