class @ThreeSD

  #约定self作为对象
  self = undefined
  record = undefined
  align = ""
  logs = []
  logLogs = []
  #TODO Config will determin the size of the balls
  sphere_start = new THREE.Mesh(new THREE.SphereGeometry(1,10,10), new THREE.MeshBasicMaterial(color:0xffff00))
  sphere_end   = new THREE.Mesh(new THREE.SphereGeometry(1,10,10), new THREE.MeshBasicMaterial(color:0xffff00))

  #常量
  SCENE_TYPE = "整个场景"
  ELEMENT_TYPE = "__Element_Type"
  ENTER_EVERYTHING = true
  ADHERE_COMBINE = true
  CONTROL_EVERYTHING = false
  DEBUG = false
  LOG_INTERVAL = 100 #ms
  MAX_LOG = 10000

  constructor: (divID)->
    #常值
    @ELEMENT_TYPE = ELEMENT_TYPE

    @container = document.getElementById(divID)

    #初始化相机
    @camera = new THREE.PerspectiveCamera(45, @container.offsetWidth / @container.offsetHeight, 1, 31000)
    @camera.position.set(0, 300, 600)
    @camera.lookAt(x:0,y:0,z:0)

    #初始化渲染器
    @renderer = new THREE.WebGLRenderer(antialias:true)                                             #抗锯齿
    @renderer.setSize(@container.offsetWidth, @container.offsetHeight)
    @renderer.setClearColor(0x000000, 1.0)                                                          #背景色黑色
    @container.appendChild(@renderer.domElement) #convas

    #初始化灯光
    @ambientlight = new THREE.AmbientLight(0x404040, 0.5)                                           #柔和的白光
    @light = new THREE.DirectionalLight(0xFFFFFF, 1.0)                                              #白光

    #初始化网格
    @gridHelper = new THREE.GridHelper(1000, 50)
    @gridHelper.setColors(0x0000ff, 0x808080)
    @gridHelper.position.copy(new THREE.Vector3(0, 0, 0))

    #监控器
    if DEBUG
      @stats = new Stats()
      @stats.domElement.style.position = 'absolute'
      @stats.domElement.style.top = '50px'
      @stats.domElement.style.right = '0px'
      @stats.domElement.style.zIndex = 2333
      @container.appendChild(@stats.domElement)

    #鼠标控制相机
    @cameraControl = new THREE.OrbitControls( @camera, @renderer.domElement )
    #@cameraControl.addEventListener( 'change', @render )  // add this only if there is no animation loop (requestAnimationFrame) 没事儿别瞎改
    @cameraControl.enableDamping = true
    @cameraControl.dampingFactor = 0.25
    @cameraControl.enableZoom = true
    @cameraControl.mouseButtons.PAN = undefined

    #鼠标指针（用于移动显示）
    @mouse = new THREE.Vector2()

    #鼠标模式
    @mouseMode = "select" #mode in [select, adhere]

    #初始化场景
    @scene = new THREE.Scene()
    @scene.name = SCENE_TYPE
    @scene.add(@light)
    @scene.add(@ambientlight)
    @scene.add(@gridHelper)

    #记录那些物体是选中状态，记录的是对象不是ID
    @selected = []
    #当选中状态改变后被调用的函数
    @onSelChange = undefined
    #当translate controller改变的时候调用的函数
    @onTransformChange = undefined

    #显示的包络盒
    @selectedBox = []

    #显示控制范围的包络盒
    @rootBox = new THREE.BoxHelper()
    @rootBox.material.color.set(0xffffff)
    @scene.add(@rootBox)

    #当前的控制焦点，约定为selected数组的第一个，只读
    @focus = null

    #节点树的根节点
    @root = @scene

    #TransFormControl 默认只有一个
    @transformControl = new THREE.TransformControls(@camera, @renderer.domElement)
    @scene.add(@transformControl)

    @container.addEventListener('mousedown', onMouseDown)
    @container.addEventListener('mousemove', onMouseMove)
    @container.addEventListener('dblclick',  onDBClick)
    @transformControl.addEventListener('objectChange', ()->
      logUpdate()
      fixAdhere()
      self.onSelChange and self.onSelChange()
    )
    #方便闭包传递
    self = @
    #渲染
    animate()

  ######################Manager#######################
  ###############Provide basic C|U|D##################
  ####################################################

  equals = (A, B)->
    return false if A.object isnt B.object
    return false if not A.position.equals(B.position)
    return false if not A.rotation.equals(B.rotation)
    return false if not A.scale.equals(B.scale)
    return false if A.parent isnt B.parent
    return false if JSON.stringify(A.userData) isnt JSON.stringify(B.userData)
    return true

  log = (object, type)->
    return if not object
    #return if logLock
    logLogs.splice(0, logLogs.length)
    now = new Date()
    if logs.length>0 and Math.abs(logs[logs.length-1].created_at-now)<LOG_INTERVAL
      logs[logs.length-1].created_at = now
      return
    logs.push(
      type : type
      parent : object.parent
      #matrix : object.matrix.clone()
      position : object.position.clone()
      rotation : object.rotation.clone()
      scale    : object.scale.clone()
      userData : JSON.parse(JSON.stringify(object.userData))
      object : object
      created_at : now
    )
    if logs.length > MAX_LOG
      logs.shift()

  logUpdate = (object = self.focus)->
    log(object, 'UPDATE')

  logCreate = (object = self.focus)->
    log(object, 'CREATE')

  logDelete = (object = self.focus)->
    log(object, 'DELETE')

  undo = ()->
    return if logs.length is 0
    backup = logs.pop()
    console.log logs.length if DEBUG
    switch backup.type
      when 'UPDATE', 'DELETE'
        #backup.object.matrixAutoUpdate = false
        setParent(backup.object, backup.parent) if backup.parent and backup.parent isnt backup.object
        #backup.object.matrix.copy(backup.matrix)
        backup.object.position.copy(backup.position)
        backup.object.rotation.copy(backup.rotation)
        backup.object.scale.copy(backup.scale)
        backup.object.userData = backup.userData
        multiSelect(backup.object)
      when 'CREATE'
        removeObject(backup.object)
        deselect(backup.object)
    logLogs.push(backup)

  redo = ()->
    return if logLogs.length is 0
    backup = logLogs.pop()
    console.log logLogs.length if DEBUG
    switch backup.type
      when 'UPDATE', 'CREATE'
        #backup.object.matrixAutoUpdate = false
        setParent(backup.object, backup.parent) if backup.parent and backup.parent isnt backup.object
        #backup.object.matrix.copy(backup.matrix)
        backup.object.position.copy(backup.position)
        backup.object.rotation.copy(backup.rotation)
        backup.object.scale.copy(backup.scale)
        backup.object.userData = backup.userData
        multiSelect(backup.object)
      when 'DELETE'
        removeObject(backup.object)
        deselect(backup.object)
    logs.push(backup)

  animate = ()->
    requestAnimationFrame(animate)
    render()
    return

  render = ()->
    #鼠标控制
    self.cameraControl.update()
    #监控更新
    self.stats.update() if DEBUG
    #更新平行光的方向，永远从镜头照向远点
    self.light.position.copy(self.camera.position)
    #控制器进行变换
    self.transformControl.update()
    #更新选中的物体的box
    updateSelBox()
    #更新控制区的box
    updateRootBox()
#    #更新添加的事件
#    addEventListener()
    self.renderer.render(self.scene, self.camera)
    return

  updateOBJ = (object, position, rotation, scale, name)->
    throw new Error("不知道要更新谁") if not object
    object.position.copy(position) if position
    object.rotation.copy(rotation) if rotation
    object.scale.copy(scale) if scale
    object.name = name if name
    object.updateMatrix()
    object.updateMatrixWorld()
    return object

  updatePosition = (position, object = self.focus)->
    updateOBJ(object, position)
  
  updateRotation = (rotation, object = self.focus)->
    updateOBJ(object, undefined, rotation)

  updateScale = (scale, object = self.focus)->
    updateOBJ(object, undefined, undefined, scale)

  updateName = (name, object = self.focus)->
    updateOBJ(object, undefined, undefined, undefined, name)

  setRoot = (object)->
    throw new Error("无法更新控制域") if not object
    fixCombinationPosition(self.root)
    self.root = object

  setFocus = (object)->
    console.log "没有焦点了哦" if not object
    self.focus = object

  setParent = (son = self.focus, father = self.root)->
    throw new Error("找不到对象") if not son
    throw new Error("找不到对象") if not father
    throw new Error("无效操作") if son is father
    updateOBJ(son)
    updateOBJ(father)
    exFather = son.parent
    return if exFather is father
    if exFather
      updateOBJ(exFather)
      son.applyMatrix(exFather.matrixWorld)
      inverseMatrix = (new THREE.Matrix4()).getInverse(father.matrixWorld)
      son.applyMatrix(inverseMatrix)
    father.add(son)
    return son

  #当大小改变之后自动适应
  suit: ()->
    height = self.container.offsetHeight
    width = self.container.offsetWidth
    self.renderer.setSize(width, height)
    self.camera.aspect = width / height
    self.camera.updateProjectionMatrix()
    return

  addAdhereBall = (mouse)->
    mouse ?= self.mouse
    raycaster = new THREE.Raycaster()
    raycaster.setFromCamera(mouse, self.camera)
    intersects = raycaster.intersectObjects(self.root.children, true)
    for intersect in intersects
      object = intersect.object
      while object.parent and object.parent isnt self.scene
        object = object.parent

      if not object.parent
        continue
      if object.visible is false
        continue
      if object.userData.frozen is true
        return null
      if object.userData.type in [ELEMENT_TYPE]
        self.showOBJ(sphere_end)
        sphere_end.position.copy(intersect.point)
        return sphere_end
      else
        continue
    self.hideOBJ(sphere_end)
    return

  onMouseDown = (event)->
    mouse = new THREE.Vector2()
    mouse.set((event.clientX - self.container.getBoundingClientRect().left) / self.container.clientWidth  * 2 - 1,
      -(event.clientY - self.container.getBoundingClientRect().top) / self.container.clientHeight  * 2 + 1)
    self.selectByMouse(mouse, event.ctrlKey, event.shiftKey) if self.mouseMode in ['select']
    self.adhere(mouse) if self.mouseMode in ['adhere']
    return

  onMouseMove = (event)->
    self.mouse.set((event.clientX - self.container.getBoundingClientRect().left) / self.container.clientWidth  * 2 - 1,
      -(event.clientY - self.container.getBoundingClientRect().top) / self.container.clientHeight  * 2 + 1)
    addAdhereBall() if self.mouseMode in ['adhere'] and record
    return

  onDBClick = (event)->
    mouse = new THREE.Vector2()
    mouse.set((event.clientX - self.container.getBoundingClientRect().left) / self.container.clientWidth  * 2 - 1,
      -(event.clientY - self.container.getBoundingClientRect().top) / self.container.clientHeight  * 2 + 1)
    self.enterByMouse(mouse) if self.mouseMode in ['select']
    return

  updateSelBox = ()-> #这个函数会大幅度降低性能并产生很多内存垃圾
    for box in self.selectedBox
      self.scene.remove(box)
    for s,i in self.selected
      self.selectedBox[i] ?= new THREE.BoxHelper(s)
      self.selectedBox[i].update(s)
      self.scene.add(self.selectedBox[i])

  updateRootBox = ()-> #这个函数也会大幅度降低性能
    if self.root isnt self.scene
      self.rootBox.update(self.root)
      self.showOBJ(self.rootBox)
    else
      self.hideOBJ(self.rootBox)


  selSplice = (index, delCnt, object)->
    if object
      self.selected.splice(index, delCnt, object)
    else
      self.selected.splice(index, delCnt)
    #焦点
    self.focus = self.selected[0] #约定焦点总是选择数组的第一个
    #控制器
    if self.focus and self.selected.length is 1
      self.transformControl.attach(self.focus)
      self.showOBJ(self.transformControl)
    else
      self.transformControl.detach()
      self.hideOBJ(self.transformControl)
    #调用修改函数
    self.onSelChange and self.onSelChange(self.selected)
    return

  select = (object, multiple = false, exclusive = false)->
    if multiple and exclusive
      deselect(object)
    else if multiple
      multiSelect(object)
    else if exclusive
      exSelect(object)
    else
      console.log object if DEBUG
      selSplice(0, self.selected.length, object)
    return object

  multiSelect = (object)->
    selSplice(0, 0, object) if object not in self.selected

  deselect = (object)->
    index = self.selected.indexOf(object)
    selSplice(index, 1) if index >= 0

  exSelect = (object)->
    index = self.selected.indexOf(object)
    if index >= 0
      selSplice(index, 1)
    else
      selSplice(0, 0, object)

  clearSelect = (object)->
    selSplice(0, self.selected.length, object)

  getSelSize = ()->
    return self.selected.length

  findParentUnderRoot = (object)->
    while object.parent and object.parent isnt self.root
      object = object.parent
    return object

  canSelect = (object)->
    return false if not object instanceof THREE.Object3D
    return false if object instanceof THREE.TransformControls
    return false if object instanceof THREE.GridHelper
    return false if object instanceof THREE.BoxHelper
    return true if object.userData.type in [ELEMENT_TYPE] and object.visible and not object.userData.frozen
    return true if CONTROL_EVERYTHING
    return false

  fixCombinationPosition = (combination)->
    return if combination.userData.type isnt ELEMENT_TYPE
    return if not combination.parent
    updateOBJ(combination)
    center = new THREE.Vector3(0, 0, 0)
    weight = 0
    for child in combination.children
      if child.userData.type is ELEMENT_TYPE
        combination.localToWorld(child.position)
        if child.userData.adhered
          continue
        center.x += child.position.x * child.userData.weight
        center.y += child.position.y * child.userData.weight
        center.z += child.position.z * child.userData.weight
        weight += child.userData.weight
    if weight is 0
      for child in combination.children
        if child.userData.type is ELEMENT_TYPE
          combination.worldToLocal(child.position)
      return
    center.x /= weight
    center.y /= weight
    center.z /= weight
    parent = combination.parent
    updateOBJ(parent)
    parent.worldToLocal(center)
    updatePosition(center, combination)
    for child in combination.children
      combination.worldToLocal(child.position)
    fixCombinationPosition(parent)

  #添加OBJMTL的对象到场景中，这个应该有撤消记录
  addObject = (object, name = "没名儿", position = new THREE.Vector3(0,0,0), root = self.root)->

    object.position.copy(position) if position
    object.name = name
    #alert "添加了名为#{name}的在{x:#{position.x},y:#{position.y},z:#{position.z}}的对象"
    object.userData.type ?= ELEMENT_TYPE
    object.userData.classifyType ?= "不知名类型"
    object.userData.created_at ?= new Date()
    object.userData.frozen ?= false
    object.userData.weight ?= 1
    object.userData.canAdhere ?= true
    updateUserData(object.userData, object)
    setParent(object, root)
    return object

  removeObject = (object)->
    console.log "无效操作" if object is self.scene
    parent = object.parent
    parent.remove(object)
    return parent

  #两个向量需要在同一个坐标系下，算出向量1到向量2所转的轴和角度
  getAxisAndAngle = (normal1, normal2)->
    normal1.normalize()
    normal2.normalize()
    axis = new THREE.Vector3().crossVectors(normal1, normal2)
    if axis.length() is 0
      angle = Math.PI
      angle = 0 if normal1.equals(normal2) #两个向量相等
      axis = new THREE.Vector3(normal1.z, 0, -normal1.x)
      axis = new THREE.Vector3(1, 0, 0) if axis.length() is 0  #"真巧，这个向量没有xOz的投影"
    else
      angle = normal1.angleTo(normal2)
      axis = new THREE.Vector3().crossVectors(normal1, normal2)

    axis.normalize()
    return {
      axis: axis   #轴在两个向量的坐标系下
      angle: angle
    }
  #return the vector with target and point
  project = (point, panel_point, panel_normal)->
    t = panel_point.clone()
    t.sub(point)
    panel_normal.normalize()
    k = t.dot(panel_normal)
    factor = new THREE.Matrix3()
    factor.identity()
    factor.multiplyScalar(k)
    return panel_normal.clone().applyMatrix3(factor)

  canAdhere = (object)->
    while object isnt self.root
      if object.userData.canAdhere is true
        return true
      object = object.parent
    return false

  #用于维护吸附效果
  ###
  使用face + object 计算目前吸附面在被吸附物体(father)坐标系下的方向 ->face,object
  记录在father坐标系下应当的向量方向->normal
  根据上面的计算进行方向调整

  记录在本体(son)坐标系下吸附的点位(destination) -> point(son)
  记录在father坐标系下吸附的点位(destination)   -> origin(father)
  根据这个来计算修正向量

  ###
  fixAdhere = (son = self.focus)->
    return if son?.userData?.adhered is undefined
    _tmp = son.matrixAutoUpdate 
    son.matrixAutoUpdate = false
    updateOBJ(son)
    normal = new THREE.Vector3( son.userData.adhered.normal.x, son.userData.adhered.normal.y, son.userData.adhered.normal.z)
    #normal.applyEuler(new THREE.Euler().setFromRotationMatrix(son.matrix))
    father = son.parent
    updateOBJ(father)
    point = new THREE.Vector3( son.userData.adhered.point.x, son.userData.adhered.point.y, son.userData.adhered.point.z)
    son.localToWorld(point)
    father.worldToLocal(point)
    origin = new THREE.Vector3( son.userData.adhered.origin.x, son.userData.adhered.origin.y, son.userData.adhered.origin.z)

    vector = project(point, origin, normal)
    son.position.add(vector)
    updateOBJ(son)
    son.matrixAutoUpdate = _tmp
    return

  updateUserData = (userData, object = self.focus)->
    for key of userData
      if userData[key] is undefined
        delete object.userData[key]
      else
        object.userData[key] = userData[key]

  getUserData = (object = self.focus)->
    return object.userData
  #####################
  ##    公有函数     ##
  #####################
  updateOBJ : updateOBJ

  updatePosition : updatePosition

  updateRotation : updateRotation

  updateScale : updateScale

  updateName : updateName

  setRoot : setRoot

  setFocus : setFocus

  setParent : setParent

  updateUserData : updateUserData

  getUserData : getUserData

  undo : undo

  redo : redo

  addOBJMTL : (object, name = "没名儿", position = new THREE.Vector3(0,0,0), root = self.root)->
    addObject(object, name, position, root)
    logCreate(object)
    clearSelect(object)

  findOBJById  : (id, object = self.root)->
    return object.getObjectById(id) #只能找一层
  
  ##################
  #  mouse control #
  ##################

  enter: (object)->
    setRoot(object)
    clearSelect()
    for child in object.children
      multiSelect(child)
    return object

  enterByMouse: (mouse, ctrl, shift)->
    return if ctrl or shift  #没有这样的双击点选
    raycaster = new THREE.Raycaster()
    raycaster.setFromCamera(mouse, self.camera)
    intersects = raycaster.intersectObjects(self.selected, true)
    if intersects.length is 0
      setRoot(self.scene)
      clearSelect()
      return
    for intersect in intersects
      object = findParentUnderRoot(intersect.object)
      continue if not canSelect(object)
      exist = ()->
        for child in object.children
          if child.userData.type in [ELEMENT_TYPE]
            return true
      if not exist()
        console.log "你点的物体里面没有可以修改的东西"
        break
      return self.enter(object)

  select: select

  multiSelect: multiSelect

  deselect : deselect

  exSelect : exSelect

  clearSelect : clearSelect

  selectByMouse: (mouse, ctrl, shift)->
    mouse ?= self.mouse
    raycaster = new THREE.Raycaster()
    raycaster.setFromCamera(mouse, self.camera)
    intersects = raycaster.intersectObjects(self.root.children, true)
    return null if intersects.length is 0
    for intersect in intersects
      object = findParentUnderRoot(intersect.object)
      continue if not canSelect(object)
      return self.select(object, ctrl, shift)
    return null
  #mode in ["translate", "rotate", "scale"]
  setTransformMode: (mode)->
    throw new Error("没有这种操控模式") if mode not in ["translate", "rotate", "scale"]
    self.transformControl.setMode(mode)
    self.transformControl.setSpace('world') if mode isnt 'scale'
    return

  setTransformSpace: (space)->
    if self.transformControl.space is 'local'
      space ?= 'world'
    else
      space ?= 'local'
    space = 'local' if self.transformControl.getMode() is 'scale'
    self.transformControl.setSpace(space)
    return


  ################################################################
  #####   Operation which will update the property of objects  ###
  ################################################################

  # 将数组中的元素组合并放在root下
  combine: (array = [], root = self.root, _position)-> #注意不要传递会在更新中改变的数组，数组中的元素需要是root的孩子
    throw new Error("你不能把少于两个的元素组合在一起") if array.length <= 1
    combination = new THREE.Object3D()
    addObject(combination)
    logCreate(combination)
    weight = 0
    position = new THREE.Vector3(0, 0, 0)
    for child in array
      position.x += child.position.x * child.userData.weight
      position.y += child.position.y * child.userData.weight
      position.z += child.position.z * child.userData.weight
      weight += child.userData.weight
    updateUserData(weight: weight, combination)
    if _position
      updatePosition(_position, combination)
    else
      updatePosition(new THREE.Vector3(position.x / combination.userData.weight, position.y / combination.userData.weight, position.z / combination.userData.weight), combination)
    updateOBJ(combination)
    for child in array
      logUpdate(child)
      setParent(child, combination)
    return combination

  # 将所有selected里面的东西进行组合并放在root下
  combineSelected: (name = "untitiled combination", position)->
    combination = self.combine(self.selected, self.root, position)
    updateName(name, combination)
    clearSelect(combination)
    return combination


  separateFocus: ()->
    throw new Error("找不到焦点") if not self.focus
    return self.separate(self.focus, self.root)

  #分离，把孩子都放到root下
  separate: (combination, root = self.root)->
    throw new Error("选中物体不能分离") if combination.userData.type not in [ELEMENT_TYPE]
    throw new Error("非法操作") if combination.parent isnt root
    clearSelect()
    base = combination.children.length-1
    while base >= 0
      child = combination.children[base]
      if child.userData.type in [ELEMENT_TYPE]
        logUpdate(child)
        setParent(child, root)
        multiSelect(child)
        if child.userData.adhered
          logUpdate(child)
          updateUserData(adhered: undefined, child)
          break
      --base
    if combination.children.length is 0
      self.remove(combination)
      return
    multiSelect(combination)
    return

  deleteSel: (root = self.root)->
    for s in self.selected
      self.remove(s)
    while root.userData.type in [ELEMENT_TYPE] and root.children.length is 0
      setRoot(self.remove(root))
    selSplice(0, self.selected.length)
    return

  showOBJ: (object)->
    throw new Error("找不到对象") if not object
    object.visible = true
    return object

  hideOBJ: (object)->
    throw new Error("找不到对象") if not object
    object.visible = false
    self.deselect(object)
    return object

  updateFocus: (position, rotation, scale)->
    return self.updateOBJ(self.focus, position, rotation, scale)

  clear: ()->
    clearSelect()
    tmp = (child for child in self.scene.children when child.userData.type in [ELEMENT_TYPE])
    for r in tmp
      self.remove(r)
    return

  remove: (object)->
    logDelete(object)
    parent = removeObject(object)
    while parent.userData.type in [ELEMENT_TYPE] and parent.children.length is 0
      parent = removeObject(parent)
    return

  adjust: (intersect1, intersect2)->
    #得到两个root坐标系下的两个向量算出平面法向量和旋转角度
    normal1 = intersect1.face.normal.clone()
    intersect1.object.updateMatrixWorld()
    normal1.applyEuler(new THREE.Euler().setFromRotationMatrix(intersect1.object.matrixWorld))

    normal2 = intersect2.face.normal.clone()
    #normal2.set(-intersect2.face.normal.x, -intersect2.face.normal.y, -intersect2.face.normal.z)
    intersect2.object.updateMatrixWorld()
    normal2.applyEuler(new THREE.Euler().setFromRotationMatrix(intersect2.object.matrixWorld))

    axisAndAngle = getAxisAndAngle(normal1, normal2)
    #找到待旋转的物体并旋转
    object = findParentUnderRoot(intersect1.object)
    _tmp = object.matrixAutoUpdate
    object.matrixAutoUpdate = false
    axis = axisAndAngle.axis
    angle = axisAndAngle.angle
    if not object.parent
      throw new Error("奇怪？")
    position = intersect1.point
    updateOBJ(object)
    object.worldToLocal(position)
    axis.applyEuler(new THREE.Euler().setFromRotationMatrix(new THREE.Matrix4().getInverse(object.matrixWorld)))
    object.rotateOnAxis(axis, angle + Math.PI) #转到相对的位置
    #取得之前的点击现在在root下的坐标
    updateOBJ(object)
    object.localToWorld(position)
    destination = intersect2.point
    #计算出在root坐标系下的目的坐标哈
    self.root.updateMatrixWorld()
    self.root.worldToLocal(position)
    self.root.worldToLocal(destination)
    #移动这个物体
    object.position.add(destination.clone().sub(position))
    self.root.localToWorld(destination)
    intersect1.normal = normal1
    intersect2.normal = normal2
    updateOBJ(object)
    object.matrixAutoUpdate = _tmp
    return


  adhere: (mouse)->
    mouse ?= self.mouse
    raycaster = new THREE.Raycaster()
    raycaster.setFromCamera(mouse, self.camera)
    intersects = raycaster.intersectObjects(self.root.children, true)
    return if intersects.length is 0
    for intersect in intersects
      object = findParentUnderRoot(intersect.object)
      continue if not canSelect(object)
      continue if not canAdhere(intersect.object)
      if not record
        record = intersect
        sphere_start.position.copy(intersect.point)
        self.showOBJ(sphere_start)
        self.scene.add(sphere_start)
        self.scene.add(sphere_end)
        self.hideOBJ(sphere_end)
      else
        return if findParentUnderRoot(record.object) is findParentUnderRoot(intersect.object)
        father = findParentUnderRoot(intersect.object)
        son = findParentUnderRoot(record.object)
        logUpdate(father)
        logUpdate(son)
        self.adjust(record, intersect)
        father.updateMatrixWorld()
        son.updateMatrixWorld()
        self.root.updateMatrixWorld()
        if ADHERE_COMBINE
          setParent(son, father)
          clearSelect(father)
        if align in ['x', 'y', 'z']
          tmp = new THREE.Vector3(0, 0, 0)
          tmp[align] = son.position[align]
          updatePosition(tmp, son)

        point = intersect.point.clone()
        origin = intersect.point.clone()

        son.worldToLocal(point)
        father.worldToLocal(origin)

        vector = intersect.normal.clone()
        vector.applyEuler(new THREE.Euler().setFromRotationMatrix(new THREE.Matrix4().getInverse(son.matrixWorld)))

        normal = intersect.normal.clone()
        normal.applyEuler(new THREE.Euler().setFromRotationMatrix(new THREE.Matrix4().getInverse(father.matrixWorld)))

        adhered = {
          point :
            x : point.x
            y : point.y
            z : point.z
          origin :
            x : origin.x
            y : origin.y
            z : origin.z
          vector :
            x : vector.x
            y : vector.y
            z : vector.z
          normal :
            x : normal.x
            y : normal.y
            z : normal.z
        }
        updateUserData(adhered: adhered, son)
        self.setMouseMode('select')
      break
    return


  setMouseMode: (mode)->
    throw new Error("没有这种Mode") if mode not in ['select', 'adhere', 'selectBox']
    self.mouseMode = mode
    console.log "已经切换到#{mode}模式"
    if mode is 'selectBox'
      self.lockCamera()
    else
      self.unlockCamera()
    if mode isnt 'select'
      self.transformControl.detach()
      self.hideOBJ(self.transformControl)
    if mode isnt 'adhere'
      record = undefined
      self.hideOBJ(sphere_start)
      self.hideOBJ(sphere_end)
    return mode

  lockCamera: ()->
    self.cameraControl.enabled = false
    return

  unlockCamera: ()->
    self.cameraControl.enabled = true
    return

  save: ()->
    output = ""
    self.scene.remove(self.transformControl)
    self.scene.remove(self.gridHelper)
    self.scene.remove(self.rootBox)
    for box in self.selectedBox
      self.scene.remove(box)
    try
      output = JSON.stringify(self.scene.toJSON())
      output = output.replace(/[\n\t]+([\d\.e\-\[\]]+)/g, '$1')
    catch e
      output = JSON.stringify(self.scene.toJSON())

    #localStorage.save = output
    self.scene.add(self.transformControl)
    self.scene.add(self.gridHelper)
    self.scene.add(self.rootBox)
    updateSelBox()
    updateRootBox()
    return output

  saveFocus: ()->
    return if not self.focus
    output = undefined
    try
      output = JSON.stringify(self.focus.toJSON())
      output = output.replace(/[\n\t]+([\d\.e\-\[\]]+)/g, '$1')
    catch e
      console.log e.message
    return output

  load: (save)->
    loader = new THREE.ObjectLoader()
    obj = loader.parse(JSON.parse(save))
    if obj instanceof THREE.Scene
      clearSelect()
      self.scene.remove(self.transformControl)
      self.scene.remove(self.gridHelper)
      self.scene.remove(self.rootBox)
      for box in self.selectedBox
        self.scene.remove(box)
      self.scene = obj
      self.root = self.scene
      self.scene.add(self.transformControl)
      self.scene.add(self.gridHelper)
      self.scene.add(self.rootBox)
      updateSelBox()
      updateRootBox()
    else
      self.addOBJMTL(obj)
    return obj


  setTarget: (target = new THREE.Vector3(0, 0, 0))->
    self.cameraControl.target.copy(target)
    return self.cameraControl

  setTargetOnFocus: ()->
    throw new Error("找不到焦点") if not self.focus
    self.root.updateMatrixWorld()
    self.cameraControl.target.copy(self.focus.position)
    self.root.localToWorld(self.cameraControl.target)
    return self.cameraControl

  cloneFocus: ()->
    return if not self.focus
    res = self.focus.clone()
    setParent(res)
    return res

  arrayClone: (count = 1, obj = self.focus , axis = new THREE.Vector3(0,1,0))->
    return if obj?.userData?.adhered is undefined
    vector = obj.position.clone()
    angle = Math.PI*2/(count+1)
    _normal = obj.userData.adhered.normal
    _normal = new THREE.Vector3(_normal.x,_normal.y,_normal.z)
    _origin = obj.userData.adhered.origin
    _origin = new THREE.Vector3(_origin.x, _origin.y, _origin.z)
    for i in [1..count]
      vector.applyAxisAngle(axis, angle)
      _origin.applyAxisAngle(axis, angle)
      _normal.applyAxisAngle(axis, angle)
      copy = obj.clone()
      updatePosition(vector, copy)
      setParent(copy)
      up = axis.clone()
      up.applyEuler(new THREE.Euler().setFromRotationMatrix(new THREE.Matrix4().getInverse(copy.matrix)))
      copy.rotateOnAxis(up, i*angle)
      copy.userData.adhered.normal = {
        x : _normal.x
        y : _normal.y
        z : _normal.z
      }
      copy.userData.adhered.origin = {
        x : _origin.x
        y : _origin.y
        z : _origin.z
      }
      logCreate(copy)
    return

  setAlign: (_align = '')->
    align = _align

  resetAlign: ()->
    self.setAlign()


