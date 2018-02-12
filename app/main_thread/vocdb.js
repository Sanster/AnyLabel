const fs = require('fs')
const xml2js = require('xml2js')
const pj = require('path').join
const VocAnno = require('../models/voc_anno')
const { runcb } = require('../libs/utils')
const Logger = require('../libs/logger')
const util = require('util')

class VocDb {
    constructor(vocDir) {
        this._parser = new xml2js.Parser()
        this._init()

        this.vocDir = vocDir
        this.annosDir = pj(vocDir, 'Annotations')
        this.imSetsDir = pj(vocDir, 'ImageSets', 'Main')
        this.imsDir = pj(vocDir, 'JPEGImages')
    }

    _init() {
        if (this.annos != null) {
            this.annos.clear()
        } else {
            this.annos = new Map()
        }

        if (this.imSets != null) {
            this.imSets.clear()
        } else {
            this.imSets = new Map()
        }

        this.annosLoaded = false
        this.imSetsLoaded = false
        this.totalIms = 0
    }

    // Load file in ImageSets/Main to get image name
    load(done) {
        this._loadImSets(this.imSetsDir, done)
    }

    getImSet(setName) {
        if (this.imSets.has(setName)) {
            return this.imSets.get(setName)
        }
    }

    getImSetCount(setName) {
        if (this.imSets.has(setName)) {
            return this.imSets.get(setName).length
        }
    }

    getImPath(setName, index) {
        const imName = this.getImSet(setName)[index]
        return pj(this.imsDir, imName + ".jpg")
    }

    getAnno(setName, index) {
        const imName = this.getImSet(setName)[index]
        const fpath = pj(this.annosDir, imName + '.xml')
        return this._loadAnnoXmlSync(fpath)
    }

    _getBaseName(filename) {
        return filename.substring(0, filename.length - 4)
    }

    _loadAnnos(annosDir, done) {
        fs.readdir(annosDir, (err, files) => {
            var count = 0
            files.forEach((fname, index, array) => {
                const fpath = pj(annosDir, fname)
                this._loadAnnoXml(fpath, anno => {
                    const imName = this._getBaseName(fname)
                    this.annos.set(imName, anno)
                    count += 1
                    if (count === array.length) {
                        this.annosLoaded = true
                        Logger.debug(`annosLoaded, imSetsLoaded = ${this.imSetsLoaded}`)
                        Logger.debug(`VOC annos loaded: ${this.annos.size}`)
                        if (this.imSetsLoaded) {
                            runcb(done)
                        }
                    }
                })
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
        fs.readFile(xmlFile, (err, data) => {
            var parser = new xml2js.Parser({ async: true })
            parser.parseString(data, (err, result) => {
                cb(new VocAnno(result))
            })
        })
    }
}

module.exports = VocDb
