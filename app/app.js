import React from 'react'
import Mousetrap from 'mousetrap'
import Canvas from './components/canvas'
import Button from './components/button'
import TopBar from './components/Topbar'
import SideBar from './components/sidebar'
import BottomBar from './components/bottombar'
import Logger from './libs/logger'
import Local from './libs/local'
import Point from './models/point'
const VocDb = remote.require('./main_thread/vocdb')

class App extends React.Component {
  constructor(props) {
    super(props)
    this.vocdb = null
    this.setName = 'trainval'
    this.imPath = ''
    this.anno = null

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

  chooseVOCDir() {
    Local.openDir(path => {
      this.vocdb = new VocDb(path)
      this.vocdb.load(() => {
        Logger.debug('Voc Data Load finish')
        this.show(0)
      })
    })
  }

  show(index) {
    this.setState({ index: index })
  }

  showNext() {
    const index = this.state.index
    if (index + 1 < this.vocdb.getImSetCount(this.setName)) {
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

  render() {
    const { index, mousePos } = this.state
    if (this.vocdb != null) {
      this.imPath = this.vocdb.getImPath(this.setName, index)
      this.anno = this.vocdb.getAnno(this.setName, index)
    }

    return (
      <div className="App">
        <TopBar />
        <Button onClick={() => this.chooseVOCDir()}> Open dir </Button>
        <div id="content">
          <div className="canvas-wrapper">
            {this.imPath !== '' && (
              <Canvas
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
