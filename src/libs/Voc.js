import xml2js from 'xml2js'
import VocAnno from '../models/VocAnno'
import path from 'path'

// 用于操作 Voc 数据集的类
class Voc {
  constructor(vocDir) {
    this.parser = new xml2js.Parser()
    this.rootDir = vocDir

    this.annoDir = path.join(vocDir, 'Annotations')
    this.imgSetDir = path.join(vocDir, 'ImageSets', 'Main')
    this.imgDir = path.join(vocDir, 'JPEGImages')
  }
}

export default Voc
