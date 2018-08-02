import xml2js from 'xml2js'
import VocAnno from '../models/VocAnno'
import path from 'path'
import io from './io'
import _ from 'lodash'

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
    this.builder = new xml2js.Builder()
    this.rootDir = vocDir

    this.annoDir = path.join(vocDir, 'Annotations')
    this.imgSetDir = path.join(vocDir, 'ImageSets', 'Main')
    this.imgDir = path.join(vocDir, 'JPEGImages')

    this.imgSets = {}
    this._loadImageSets()

    this.curImgSetName = ''
    this.curImgIndex = 0
    this.curAnno = null
  }

  getImgSetNames() {
    return Object.keys(this.imgSets)
  }

  getImgNames(imgSet) {
    return this.imgSets[imgSet].imgNames
  }

  _loadImageSets() {
    const names = io.listDir(this.imgSetDir)
    names.forEach(x => {
      const setPath = path.join(this.imgSetDir, x)
      const lines = io.readLines(setPath)
      const name = x.substring(0, x.length - 4)
      this.imgSets[name] = new ImageSets(name, lines)
    })
    // console.log(names)
  }

  // 通过 image sets 的索引来获得图片路径
  getImgPathByIndex(imgSetName, index, suffix = '.jpg') {
    const imgName = this.imgSets[imgSetName].imgNames[index]
    return path.join(this.imgDir, `${imgName}${suffix}`)
  }

  getVocAnnoByIndex(imgSetName, imgIndex) {
    if (this.curImgSetName != imgSetName || this.curImgIndex != imgIndex) {
      if (this.curImgSetName != imgSetName) {
        this.curImgSetName = imgSetName
      }

      if (this.curImgIndex != imgIndex) {
        this.curImgIndex = imgIndex
      }

      const annoXmlPath = this._getAnnoXmlPath()
      const data = io.readFileSync(annoXmlPath)

      let anno = null
      this.parser.parseString(data, (err, xmlJson) => {
        if (err) {
          console.error(err)
        } else {
          console.log(xmlJson)
          anno = new VocAnno(xmlJson)
          this.curAnno = anno
        }
      })
      return anno
    }

    return this.curAnno
  }

  deleteVocAnnoObjById(objId) {
    this.curAnno.deleteObj(objId)
  }

  saveVocAnno() {
    var xml = this.builder.buildObject(this.curAnno.getXmlJson())
    io.writeFileSync(this._getAnnoXmlPath(), xml)
    // 每次读取保存完成后重新读取，清空状态
    this.curAnno.parseXmlJson()
  }

  _getAnnoXmlPath() {
    const imgName = this.imgSets[this.curImgSetName].imgNames[this.curImgIndex]
    return path.join(this.annoDir, `${imgName}.xml`)
  }
}

export default Voc
