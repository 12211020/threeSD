现有api接口
====
-------------------

[TOC]


#公共类

##ThreeSD

- 描述：主要的类
- 成员变量
  - 构造函数 constructor(dom_id) 自动寻找dom树中id为参数的元素进行render部署
  - focus | {THREE.Object3D} 当前控制焦点对象，必须是root的直接儿子
  - root | {THREE.Object3D} 当前控制域
  - selected | {Array | THREE.Object3D} 当前选中的元件个数，保证为root的直接儿子
  - scene | {THREE.Scene} 场景对象
  - onSelChange | {Function} 当选中状态改变后调用的函数
  - onTransformChange | {Function} 当有东西被拖动的时候调用的函数，**当被加入事件监听后会被清空为undefined**
  - mouseMode | {Enum: select, adhere} 鼠标模式

- 成员函数
  - 请参考接下来的公共接口
  

#公共接口

##UserData
 
- 描述：为了满足一些功能而在object3D对象中添加的功能
- 组成
  - type:类型，包括
    - COMBINATION_TYPE = "\_\_Combination_Type" 组合体类型
    - ELEMENT\_TYPE = "\_\_Element_Type"         元件类型
  - classifyType：物件类型，比如平台，帆板等 
  - created\_at：创造时间
  - frozen：是否被冻结 默认为false
  - weight：重量 默认为1
  - canAdhere：是否可以吸附 默认为true

##自适应

- 描述：当窗口大小改变时进行大小适应
- 函数名：suit
- 类型：同步
- 参数：无
- 返回值：无
- 函数签名： suit()

##添加对象

- 描述：将一个Object3D对象加入场景
- 函数名：addOBJMTL
- 类型：同步
- 参数：
  - object | {THREE.Object3D} 要添加的对象，需要必须是Object3D对象
  - name | {String} 添加的对象的名称，默认为“没名儿”
  - position | {THREE.Vector3} 添加的对象所处位置，默认为(0,0,0)
- 返回值：
  - res | {THREE.Object3D} 添加的Object3D对象
- 函数签名：addOBJMTL(object,name="没名儿",position = new THREE.Vector3(0,0,0))

##选中

- 描述：将一个Object3D对象设定为选中状态
- 函数名: select
- 类型： 同步
- 参数：
  - object | {THREE.Object3D} 要选择的对象
  - multiple | {Bool} 表示是否是多选
  - exclusive | {Bool} 表示是否为点反选
- 返回值：object
- 函数签名：select(object, multiple, exclusive)

##进入

- 描述：进入一个组合体内部进行修改
- 函数名：enter
- 类型：同步
- 参数：
  - object | {THREE.Object3D} 要进入的对象
- 返回值：object
- 函数签名：enter(object)


##选中（鼠标）

- 描述：选中屏幕上的物体
- 函数名：selectByMouse
- 参数：
  - mouse | {THREE.Vector2} 鼠标，描述的地点应当是相对于场景的地点不是屏幕上的坐标
  - multiple | {Bool} 表示是否是多选，即是否按下了Ctrl
  - exclusive | {Bool} 表示是否为点反选，即是否按下了Shift
- 返回值:如果有选中的对象则返回选择的对象，否则返回null
- 函数签名: selectByMouse(mouse, multiple, exclusive)

##进入组合体（鼠标）

- 描述：进入一个组合体内部进行修改
- 函数名：enterByMouse
- 类型：同步
- 参数：
  - mouse | {THREE.Vector2} 鼠标，描述的地点应当是相对于场景的地点不是屏幕上的坐标
- 返回值：无
- 函数签名：enter(mouse)

##设定控制模式

- 描述：选择控制模式，可选缩放，平移，旋转
- 函数名：setTransformMode
- 类型：同步
- 参数：
  - mode | {Enum | "translate", "rotate", "scale"} 模式，平移，旋转，缩放
- 返回值：无
- 函数签名：setTransformMode(mode)


##将选中的物体组合

- 描述：将选中的组合体或者零件进行组合，产生新的组合体
- 函数名：combineSelected
- 类型：同步
- 参数：
  - name | {String} 添加的对象的名称，默认为"untitiled combination"
  - position | {THREE.Vector3} 添加的组合体所处位置，默认为所有孩子的几何中心
- 返回值：
  - combination | {THREE.Object3D} 添加的组合体对象
- 函数签名：combineSelected(name="untitiled combination",position=`几何中心`)

##将焦点分离

- 描述：将一个组合体进行分离，相当于组合的反向操作
- 函数名：separateFocus
- 类型：同步
- 参数：无
- 返回值：无
- 函数签名： separateFocus()


##删除

- 描述：将状态为选中的零件删除
- 函数名：deleteSel
- 类型：同步
- 参数：无

- 返回值：无
- 函数签名： deleteSel()

##隐藏零件

- 描述：将零件状态设为不可见
- 函数名：hideOBJ
- 类型：同步
- 参数：
  - object | {THREE.Object3D} 待隐藏零件

- 返回值：该object
- 函数签名： hideOBJ(object)

##显示零件

- 描述：将零件状态设为可见
- 函数名：showOBJ
- 类型：同步
- 参数：
  - object | {THREE.Object3D} 待显示零件

- 返回值：该object
- 函数签名： showOBJ(object)

##更新焦点几何属性

- 描述：更新控制焦点的位置，比例，旋转等几何属性
- 函数名：updateFocus
- 类型：同步
- 参数：
  - position | {Vector3} 待更新零件的坐标
  - scale | {Vector3} 待更新零件的比例
  - rotation | {Euler} 待更新零件的旋转角度

- 返回值：该object
- 函数签名： updateFocus(position, scale, rotation)

##更新几何体几何属性

- 描述：更新几何体的位置，比例，旋转等几何属性
- 函数名：updateObject
- 类型：同步
- 参数：
  - object | {THREE.Object3D} 要更新的对象
  - position | {Vector3} 待更新零件的坐标
  - scale | {Vector3} 待更新零件的比例
  - rotation | {Euler} 待更新零件的旋转角度

- 返回值：该object
- 函数签名： updateObject(object, position, scale, rotation)

##按零件的id查找该零件

- 描述：给定零件的id，返回零件对象，现在只能得到场景直接对象
- 函数名：findOBJById
- 类型：同步
- 参数：
  - id | {Number} 待查找零件的id

- 返回值：obj | {Object3D}
- 函数签名： findOBJById(id)

##清空场景

- 描述：清空场景
- 函数名：clear
- 类型：同步
- 参数：无
- 返回值：无
- 函数签名：clear()

##删除对象

- 描述：删除指定对象
- 函数名：remove
- 类型：同步
- 参数：
  - object: 要删除的object
- 返回值：无
- 函数签名: remove(object)

##保存JSON

- 描述：将场景中所有东西保存为json
- 函数名：save
- 类型：同步
- 参数：无
- 返回值：JSON对象的字符串

##加载JSON

- 描述：如果是场景将替换场景，否则加入到场景中
- 函数名：load
- 类型：同步
- 参数
  - save：之前保存的JSON**字符串**
- 返回值：无 

##设置相机焦点

- 描述：设置相机焦点为控制焦点
- 函数名：setTargetOnFocus
- 参数：无
- 返回值：无
- *目前快捷键为N*

##保存焦点

- 描述：将焦点物体保存为json对象
- 函数名：saveFocus
- 参数：无
- 返回值：JSON对象的字符串

##拷贝

- 描述：将焦点拷贝添加到root的children里面
- 函数名：cloneFocus
- 参数：无
- 返回值：焦点的拷贝，可以对其进行后续操作

