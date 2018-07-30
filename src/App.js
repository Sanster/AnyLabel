import React, { Component } from 'react'
import Mousetrap from 'mousetrap'
import { withStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'

import TopBar from './components/TopBar'
import Toolbar from '@material-ui/core/Toolbar'
import LeftSideBar from './components/LeftSideBar'
import RightSideBar from './components/RightSideBar'
import CanvasView from './components/CanvasView'
import BottomBar from './components/BottomBar'
import Point from './models/Point'
import Voc from './libs/Voc'
import './App.css'

const drawerWidth = 240

const styles = theme => ({
  root: {
    flexGrow: 1,
    height: '100%',
    zIndex: 1,
    overflow: 'hidden',
    position: 'relative',
    display: 'flex'
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1
  },
  drawerPaper: {
    position: 'relative',
    width: drawerWidth
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    position: 'relative'
  }
})

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      voc: null,
      selectImgSet: '',
      selectImgIndex: 0,
      selectImgWidth: 0,
      selectImgHeight: 0,
      selectImgSize: 0,
      selectVocObjIndex: 0,
      mousePos: new Point()
    }

    this.voc = null
    this.numImg = 0
    this.bindKey()
  }

  bindKey = () => {
    Mousetrap.bind('left', this.showPrevImg)
    Mousetrap.bind('right', this.showNextImg)
  }

  onCanvasMouseMove = (x, y) => {
    const _mousePos = this.state.mousePos
    _mousePos.x = x
    _mousePos.y = y
    this.setState({ mousePos: _mousePos })
  }

  onVocDirSelected = vocDir => {
    const voc = new Voc(vocDir)
    this.setState({ voc: voc }, () => {
      const selectImgSet = voc.getImgSetNames()[0]
      this.numImg = this.state.voc.getImgNames(selectImgSet).length
      this.showImg(selectImgSet, 0)
    })
  }

  onImgSetClick = imgSetName => {
    this.showImg(imgSetName, 0)
    this.numImg = this.state.voc.getImgNames(imgSetName).length
  }

  onImgNameClick = imgIndex => {
    this.setState({ selectImgIndex: imgIndex })
  }

  onVocObjClick = vocObjIndex => {
    console.log(`App.js onVocObjClick: ${vocObjIndex}`)
    this.setState({ selectVocObjIndex: vocObjIndex })
  }

  onImgLoad = (width, height, fileSize) => {
    this.setState({
      selectImgWidth: width,
      selectImgHeight: height,
      selectImgSize: fileSize
    })
  }

  showImg(imgSetName, index = 0) {
    this.setState({
      selectImgIndex: index,
      selectImgSet: imgSetName
    })
  }

  showNextImg = () => {
    const { selectImgIndex } = this.state
    if (selectImgIndex < this.numImg - 1) {
      this.setState({ selectImgIndex: selectImgIndex + 1 })
    }
  }

  showPrevImg = () => {
    const { selectImgIndex } = this.state
    if (selectImgIndex >= 1) {
      this.setState({ selectImgIndex: selectImgIndex - 1 })
    }
  }

  render() {
    const { classes } = this.props

    const {
      mousePos,
      voc,
      selectImgSet,
      selectImgIndex,
      selectImgHeight,
      selectImgWidth,
      selectImgSize,
      selectVocObjIndex
    } = this.state

    let imgPath = ''
    let vocAnno = null
    let imgNames = null
    let imgSets = null
    if (voc != null && selectImgSet !== '') {
      imgPath = voc.getImgPathByIndex(selectImgSet, selectImgIndex)
      vocAnno = voc.getVocAnnoByIndex(selectImgSet, selectImgIndex)
      imgSets = voc.getImgSetNames()
      imgNames = voc.getImgNames(selectImgSet)
    }

    return (
      <div className={classes.root}>
        <AppBar position="absolute" className={classes.appBar}>
          <TopBar onVocDirSelected={this.onVocDirSelected} />
        </AppBar>

        <LeftSideBar
          selectImgIndex={selectImgIndex}
          selectImgSet={selectImgSet}
          selectImgWidth={selectImgWidth}
          selectImgHeight={selectImgHeight}
          selectImgSize={selectImgSize}
          imgSets={imgSets}
          imgNames={imgNames}
          onImgNameClick={this.onImgNameClick}
          onImgSetClick={this.onImgSetClick}
        />

        <main className={classes.content}>
          <CanvasView
            imgPath={imgPath}
            vocAnno={vocAnno}
            onMouseMove={this.onCanvasMouseMove}
            onImgLoad={this.onImgLoad}
            selectVocObjIndex={selectVocObjIndex}
          />
          <BottomBar mousePos={mousePos} />
        </main>

        <RightSideBar
          vocAnno={vocAnno}
          selectVocObjIndex={selectVocObjIndex}
          onVocObjClick={this.onVocObjClick}
        />
      </div>
    )
  }
}

export default withStyles(styles)(App)
