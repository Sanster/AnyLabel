const fs = require('fs')
const xml2js = require('xml2js')
const pj = require('path').join
const VocAnno = require('../models/voc_anno')
const { runcb } = require('../libs/utils')
const Logger = require('../libs/logger')

class VocDb {
    constructor(vocDir) {
        this._parser = new xml2js.Parser()
        this._parser2 = new xml2js.Parser({ async: true })
        this.annos = new Map()
        this.imSets = new Map()
        this.totalIms = 0

        this.vocDir = vocDir
        this.annosDir = pj(vocDir, 'Annotations')
        this.imSetsDir = pj(vocDir, 'ImageSets', 'Main')
        this.imsDir = pj(vocDir, 'JPEGImages')
    }

    // load metadata from and Annotations, ImageSets
    async load(done) {
        await this._loadAnnos(this.annosDir)
        await this._loadImSets(this.imSetsDir)
        runcb(done)
    }

    getImSet(setName) {
        return this.imSets.get(setName)
    }

    getImPath(imName) {
        return pj(this.imsDir, imName + ".jpg")
    }

    getImPath(setName, index) {
        const imName = this.getImSet('trainval')[index]
        imPath = this.getImPath(imName)
        return imPath
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
                    Logger.debug(`VOC annos loaded: ${this.annos.size}`)
                    runcb(done)
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

    _loadImSets(imSetsDir, done) {
        fs.readdir(imSetsDir, (err, files) => {
            if (err) {
                console.error(err)
            } else {
                let count = 0
                files.forEach((fname, index, array) => {
                    const filepath = pj(imSetsDir, fname)
                    fs.readFile(filepath, 'utf-8', (err, data) => {
                        const setName = this._getBaseName(fname)
                        this.imSets.set(setName, [])
                        const lines = data.split('\n')
                        for (let line of lines) {
                            if (line != '') {
                                this.imSets.get(setName).push(line)
                            }
                        }

                        if (setName === 'trainval') {
                            this.totalIms = this.imSets.get(setName).length
                        }

                        count += 1
                        if (count === array.length) {
                            Logger.debug(`VOC imSets loaded: ${this.imSets.size} set`)
                            this.imSets.forEach((value, key, map) => {
                                Logger.debug(`Set name: ${key} Size: ${value.length}`)
                            })
                            runcb(done)
                        }
                    })
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
