import Size from './Size'
import VocObj from './VocObject'
import Rect from './Rect'

class VocAnno {
  constructor(xmlResult) {
    this.objs = []

    const annotation = xmlResult.annotation
    const annSize = annotation.size[0]

    this.size = new Size(annSize.width[0], annSize.height[0], annSize.depth[0])
    this.filename = annotation.filename[0]
    annotation.object.forEach(obj => {
      const box = obj.bndbox[0]
      const truncated = obj.truncated[0] == 1 ? true : false
      const rect = new Rect(box.xmin[0], box.ymin[0], box.xmax[0], box.ymax[0])
      this.objs.push(new VocObj(obj.name[0], truncated, rect))
    })
  }
}

export default VocAnno
