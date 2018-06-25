import xml2js from 'xml2js'
import VocAnno from '../models/VocAnno'
import path from 'path'
import io from './io'

class ImageSets {
  constructor(name, imgNames) {
    this.name = name
    this.imgNames = imgNames
  }
}

// 用于操作 Voc 数据集的类
class Voc {
  constructor(vocDir) {
    this.parser = new xml2js.Parser()
    this.rootDir = vocDir

    this.annoDir = path.join(vocDir, 'Annotations')
    this.imgSetDir = path.join(vocDir, 'ImageSets', 'Main')
    this.imgDir = path.join(vocDir, 'JPEGImages')

    this.imgSets = {}
    this._loadImageSets()
  }

  _loadImageSets() {
    const names = io.listDir(this.imgSetDir)
    names.forEach(x => {
      const setPath = path.join(this.imgSetDir, x)
      const lines = io.readLines(setPath)
      const name = x.substring(0, x.length - 4)
      this.imgSets[name] = new ImageSets(name, lines)
    })
    console.log(names)
  }

  // 通过 image sets 的索引来获得图片路径
  getImgPathByIndex(imgSetName, index, suffix = '.jpg') {
    const imgName = this.imgSets[imgSetName].imgNames[index]
    return path.join(this.imgDir, `${imgName}${suffix}`)
  }

  getVocAnnoByIndex(imgSetName, index) {
    const imgName = this.imgSets[imgSetName].imgNames[index]
    console.log(imgName)
    const annoXmlPath = path.join(this.annoDir, `${imgName}.xml`)
    const data = io.readFileSync(annoXmlPath)

    let anno = null
    this.parser.parseString(data, (err, result) => {
      if (err) {
        console.error(err)
      } else {
        anno = new VocAnno(result)
      }
    })
    return anno
  }
}

export default Voc
