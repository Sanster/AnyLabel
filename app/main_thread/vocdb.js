const fs = require('fs')
const xml2js = require('xml2js')
const pj = require('path').join
const VocAnno = require('../models/voc_anno')

class VocDb {
    constructor(vocDir) {
        this._parser = new xml2js.Parser()
        this._parser2 = new xml2js.Parser({ async: true })
        this.annos = new Map()
        this.imSets = new Map()

        this.vocDir = vocDir
        this.annosDir = pj(vocDir, 'Annotations')
        this.imSetsDir = pj(vocDir, 'ImageSets', 'Main')
        this.imsDir = pj(vocDir, 'JPEGImages')
    }

    // load metadata from and Annotations, ImageSets
    load() {
        this._loadAnnos(this.annosDir)
        this._loadImSets(this.imSetsDir)
    }

    getImPath(imName) {
        return pj(this.imsDir, imName + ".jpg")
    }

    _getBaseName(filename) {
        return filename.substring(0, filename.length - 4)
    }

    _loadAnnos(annosDir, done) {
        fs.readdir(annosDir, (err, files) => {
            var count = 0
            files.forEach(async (fname, index, array) => {
                const fpath = pj(annosDir, fname)
                const anno = await this._loadAnnoXml(fpath)

                const imName = this._getBaseName(fname)
                this.annos.set(imName, anno)
                count += 1
                if (count === array.length) {
                    done()
                }
            })
        })
    }

    _loadAnnosSync(annosDir) {
        const files = fs.readdirSync(annosDir)
        files.forEach(fname => {
            const fpath = pj(annosDir, fname)
            this.annos.set(fname, this._loadAnnoXmlSync(fpath))
        })
    }

    _loadImSets(imSetsDir) {
        fs.readdir(imSetsDir, (err, files) => {
            if (err) {
                console.error(err)
            } else {
                files.forEach(fname => {
                    const filepath = pj(imSetsDir, fname)
                    const data = fs.readFileSync(filepath, 'utf-8')

                    const setName = this._getBaseName(fname)
                    this.imSets[setName] = []
                    const lines = data.split('\n')
                    for (let line of lines) {
                        this.imSets[setName].push(line)
                    }
                })
            }
        })
    }

    _loadAnnoXmlSync(xmlFile) {
        const data = fs.readFileSync(xmlFile)
        var ret
        this._parser.parseString(data, (err, result) => {
            ret = new VocAnno(result)
        })
        return ret
    }

    _loadAnnoXml(xmlFile, cb) {
        const data = fs.readFileSync(xmlFile)
        this._parser2.parseString(data, (err, result) => {
            cb(new VocAnno(result))
        })
    }
}

module.exports = VocDb
