import React, { Component } from 'react'
import TopBar from './components/TopBar'
import CanvasView from './components/CanvasView'
import BottomBar from './components/BottomBar'
import Point from './models/Point'
import './App.css'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      imgIndex: 0,
      imgPath: '',
      vocAnno: null,
      mousePos: new Point()
    }
  }

  onCanvasMouseMove(x, y) {
    const _mousePos = this.state.mousePos
    _mousePos.x = x
    _mousePos.y = y
    this.setState({ mousePos: _mousePos })
  }

  onVocDirSelect(vocDir) {}

  render() {
    const { imgPath, vocAnno, mousePos } = this.state

    return (
      <div id="App">
        <TopBar onVocDirSelect={vocDir => this.onVocDirSelect(vocDir)} />
        <div id="content">
          <div className="canvas-wrapper">
            <CanvasView
              imgPath={imgPath}
              vocAnno={vocAnno}
              onMouseMove={(x, y) => this.onCanvasMouseMove(x, y)}
            />
          </div>
        </div>
        <BottomBar mousePos={mousePos} />
      </div>
    )
  }
}

export default App
