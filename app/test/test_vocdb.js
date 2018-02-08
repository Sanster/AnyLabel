const assert = require('assert')
const pj = require('path').join
const Timer = require('../libs/timer')
const VocDb = require('../main_thread/vocdb')
const VocAnno = require('../models/voc_anno')

describe('vocdb', () => {
    const vocDir = pj(__dirname, 'VOC')
    const annosDir = pj(vocDir, 'Annotations')
    const imSetsDir = pj(vocDir, 'ImageSets', 'Main')
    const imDir = pj(vocDir, 'JPEGImages')

    const timer = new Timer()
    describe('#_loadAnnoXmlSync', () => {
        it('should parse data correctly in voc xml file', () => {
            const vocdb = new VocDb(vocDir)
            const vocAnno = vocdb._loadAnnoXmlSync(pj(annosDir, './img_1001.xml'))
            assert.equal(vocAnno.objs.length, 2)
            assert.equal(vocAnno.objs[0].name, 'dog')
            assert.equal(vocAnno.objs[1].name, 'person')
        })
    })

    describe('#_loadImSets', () => {
        it('should load all image sets', () => {
            const vocdb = new VocDb(vocDir)
            vocdb._loadImSets(imSetsDir)
        })
    })

    describe('#getImPath', () => {
        it('should get image path by image name', () => {
            const vocdb = new VocDb(vocDir)
            assert.equal(vocdb.getImPath('img_1001'), pj(imDir, 'img_1001.jpg'))
        })
    })


    describe('#_loadAnnosSync', () => {
        it('should load annos sync', () => {
            const vocdb = new VocDb(vocDir)
            timer.tic()
            vocdb._loadAnnosSync("/Users/cwq/Documents/bioack/data/VOCdevkit/VOC2007/Annotations")
            assert.equal(vocdb.annos.size, 6000)
            console.log(`load 2 annos sync time ${timer.toc()} ms`)
        })
    })

    describe('#_loadAnnos', () => {
        it('should load annos', done => {
            const vocdb = new VocDb(vocDir)
            timer.tic()
            vocdb._loadAnnos("/Users/cwq/Documents/bioack/data/VOCdevkit/VOC2007/Annotations", () => {
                assert.equal(vocdb.annos.size, 6000)
                console.log(`load 2 annos sync time ${timer.toc()} ms`)
                done()
            })
        })
    })
})
