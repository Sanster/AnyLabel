import Size from './Size'
import VocObj from './VocObject'
import Rect from './Rect'

class VocAnno {
  constructor(xmlJson) {
    // 保存 xml2js 原始解析结果
    this.xmlJson = xmlJson

    this._parseXmlJson()
  }

  _init() {
    this.objs = []
    // Image size
    this.size = null
    this.filename = ''
    this.deleteObjKeys = []
  }

  deleteObj(objKey) {
    this.deleteObjKeys.push(objKey)
  }

  unDeleteObj() {
    this.deleteObjKeys.pop()
  }

  // 根据 deleteObjKeys 操作原始数据
  getXmlJson() {
    const filteredObjs = this.xmlJson.annotation.object.filter(
      (obj, index) => !this.deleteObjKeys.includes(index)
    )
    this.xmlJson.annotation.object = filteredObjs
    return this.xmlJson
  }

  // 根据 deleteObjKeys 返回 objs
  getObjs() {
    return this.objs.filter(obj => !this.deleteObjKeys.includes(obj.key))
  }

  getDeletedObjCount() {
    return this.deleteObjKeys.length
  }

  // 每次解析 xmlJson，相当于初始化
  _parseXmlJson() {
    this._init()

    const annotation = this.xmlJson.annotation
    const annSize = annotation.size[0]
    this.size = new Size(annSize.width[0], annSize.height[0], annSize.depth[0])
    this.filename = annotation.filename[0]

    annotation.object.forEach((obj, index) => {
      const box = obj.bndbox[0]
      const truncated = obj.truncated[0] === 1 ? true : false
      const rect = new Rect(box.xmin[0], box.ymin[0], box.xmax[0], box.ymax[0])
      this.objs.push(new VocObj(obj.name[0], truncated, rect, index))
    })
  }
}

export default VocAnno
