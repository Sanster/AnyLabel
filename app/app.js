import React from 'react'
import Mousetrap from 'mousetrap'
import CanvasView from './components/canvas_view'
import TopBar from './components/Topbar'
import SideBar from './components/sidebar'
import BottomBar from './components/bottombar'
import Logger from './libs/logger'
import Local from './libs/local'
import Point from './models/point'
const pj = require('path').join

const { readFiles } = remote.require('./main_thread/walker')
const Voc = remote.require('./main_thread/voc')

class App extends React.Component {
  constructor(props) {
    super(props)
    this.vocdb = null
    this.setName = 'trainval'
    this.imDir = ''
    this.imNames = []
    this.imPath = ''

    this.xmlDir = ''
    this.xmlNames = []
    this.xmlPath = ''
    this.anno = null
    this.voc = new Voc()

    this.onMouseMove = this.onMouseMove.bind(this)

    this.state = {
      index: 0,
      mousePos: null
    }
  }

  componentDidMount() {
    Mousetrap.bind('left', () => this.showPrev())
    Mousetrap.bind('right', () => this.showNext())
  }

  chooseIMDir() {
    Local.openDir(path => {
      this.imDir = path

      // if xmlDir is not set yet, set same as imDir
      if (this.xmlDir === '') {
        this.xmlDir = path
      }

      Logger.debug('start read image files')
      readFiles(this.imDir, files => {
        Logger.debug(`end read image files: ${files.length}`)
        this.imNames = files
        this.show(0)
      })
    })
  }

  chooseXMLDir() {
    Local.openDir(path => {
      this.xmlDir = path
      Logger.debug('start read xml files')
      readFiles(this.xmlDir, files => {
        Logger.debug(`end read xml files: ${files.length}`)
        this.xmlNames = files
        this.show(0)
      })
    })
  }

  saveXml() {
    console.log('saveXml')
  }

  startDrawingBox() {
    console.log('startDrawingBox')
  }

  show(index) {
    this.setState({ index: index })
  }

  showNext() {
    const index = this.state.index
    if (index + 1 < this.imNames.length) {
      this.show(index + 1)
    }
  }

  showPrev() {
    const index = this.state.index
    if (index - 1 >= 0) {
      this.show(index - 1)
    }
  }

  onMouseMove(mousePos) {
    this.setState({ mousePos: mousePos })
  }

  onImageBtnClick() {
    this.chooseIMDir()
  }

  onXMLBtnClick() {
    this.chooseXMLDir()
  }

  onSaveBtnClick() {
    this.saveXml()
  }

  onBoxBtnClick() {
    this.startDrawingBox()
  }

  getBaseName(filename) {
    return filename.substring(0, filename.length - 4)
  }

  render() {
    const { index, mousePos } = this.state

    if (this.imDir != '') {
      const imName = this.imNames[index]
      this.imPath = pj(this.imDir, imName)

      const xmlName = this.getBaseName(imName) + '.xml'
      this.xmlPath = pj(this.xmlDir, xmlName)
      this.anno = this.voc.loadAnnoXmlSync(this.xmlPath)
    }

    return (
      <div className="App">
        <TopBar
          onImageBtnClick={() => this.onImageBtnClick()}
          onXMLBtnClick={() => this.onXMLBtnClick()}
          onSaveBtnClick={() => this.onSaveBtnClick()}
          onBoxBtnClick={() => this.onBoxBtnClick()}
        />
        <div id="content">
          <div className="canvas-wrapper">
            {this.imPath !== '' && (
              <CanvasView
                imPath={this.imPath}
                anno={this.anno}
                onMouseMove={this.onMouseMove}
              />
            )}
          </div>
          <SideBar />
        </div>
        <BottomBar mousePos={mousePos} />
      </div>
    )
  }
}

export default App
