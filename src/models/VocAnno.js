import Size from './Size'
import VocObj from './VocObject'
import Rect from './Rect'

class VocAnno {
  constructor(xmlJson) {
    // 保存 xml2js 原始解析结果
    this.xmlJson = xmlJson

    this.parseXmlJson()
  }

  _init() {
    this.objs = new Map()
    // Image size
    this.size = null
    this.filename = ''
    this.deleteObjIds = []
  }

  deleteObj(objKey) {
    this.deleteObjIds.push(objKey)
  }

  unDeleteObj() {
    this.deleteObjIds.pop()
  }

  // 根据 deleteObjKeys 操作原始数据
  getXmlJson() {
    const filteredObjs = this.xmlJson.annotation.object.filter(
      (obj, index) => !this.deleteObjIds.includes(index)
    )
    this.xmlJson.annotation.object = filteredObjs
    return this.xmlJson
  }

  // 根据 deleteObjKeys 返回 objs
  getObjs() {
    const res = []
    this.objs.forEach((obj, id) => {
      if (!this.deleteObjIds.includes(obj.id)) {
        res.push(obj)
      }
    })
    return res
  }

  getNextObjId(objId) {
    let objs = this.getObjs()
    objs.sort((x, y) => x.id - y.id)

    for (let i = 0; i < objs.length; i++) {
      if (objs[i].id > objId) {
        return objs[i].id
      }
    }

    return objs[objs.length - 1].id
  }

  getDeletedObjCount() {
    return this.deleteObjIds.length
  }

  // 每次解析 xmlJson，相当于初始化
  parseXmlJson() {
    this._init()

    const annotation = this.xmlJson.annotation
    const annSize = annotation.size[0]
    this.size = new Size(annSize.width[0], annSize.height[0], annSize.depth[0])
    this.filename = annotation.filename[0]

    annotation.object.forEach((obj, index) => {
      const box = obj.bndbox[0]
      const truncated = obj.truncated[0] === 1 ? true : false
      const rect = new Rect(box.xmin[0], box.ymin[0], box.xmax[0], box.ymax[0])
      this.objs.set(index, new VocObj(obj.name[0], truncated, rect, index))
    })
  }
}

export default VocAnno
