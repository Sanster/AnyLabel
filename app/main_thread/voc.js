const fs = require('fs')
const xml2js = require('xml2js')
const VocAnno = require('../models/voc_anno')
const Logger = require('../libs/logger')

class Voc {
  constructor(vocDir) {
    this._parser = new xml2js.Parser()
  }

  loadAnnoXmlSync(xmlFile) {
    if (!fs.existsSync(xmlFile)) {
      return null
    }

    const data = fs.readFileSync(xmlFile)
    var ret = null
    this._parser.parseString(data, (err, result) => {
      if (err) {
        console.error(err)
      } else {
        ret = new VocAnno(result)
      }
    })
    return ret
  }

  loadAnnoXml(xmlFile, cb) {
    fs.readFile(xmlFile, (err, data) => {
      var parser = new xml2js.Parser({ async: true })
      parser.parseString(data, (err, result) => {
        cb(new VocAnno(result))
      })
    })
  }
}

module.exports = Voc
