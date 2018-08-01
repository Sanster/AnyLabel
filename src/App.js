import React, { Component } from 'react'
import Mousetrap from 'mousetrap'
import { withStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'

import TopBar from './components/TopBar'
import LeftSideBar from './components/LeftSideBar'
import RightSideBar from './components/RightSideBar'
import CanvasView from './components/CanvasView'
import BottomBar from './components/BottomBar'
import Point from './models/Point'
import Voc from './libs/Voc'
import DeleteDialog from './components/dialogs/DeleteDialog'
import './App.css'

const ipcRenderer = window.require('electron').ipcRenderer

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
      selectImgSet: '',
      selectImgIndex: 0,
      selectImgWidth: 0,
      selectImgHeight: 0,
      selectImgSize: 0,
      selectVocObjIndex: 0,
      mousePos: new Point(),
      vocObjDeleteDialogOpen: false
    }

    this.voc = null
    this.numImg = 0
    this.bindKey()
    this.registerIpc()
  }

  bindKey = () => {
    Mousetrap.bind('left', this.showPrevImg)
    Mousetrap.bind('right', this.showNextImg)
  }

  registerIpc = () => {
    ipcRenderer.on('open-voc', (event, vocDir) => {
      console.log(vocDir)
      this.onVocDirSelected(vocDir)
    })
  }

  onCanvasMouseMove = (x, y) => {
    const _mousePos = this.state.mousePos
    _mousePos.x = x
    _mousePos.y = y
    this.setState({ mousePos: _mousePos })
  }

  resetImgSet = imgSetName => {
    this.setState({
      selectImgIndex: 0,
      selectImgSet: imgSetName,
      selectVocObjIndex: 0
    })
  }

  onVocDirSelected = vocDir => {
    const voc = new Voc(vocDir)
    this.voc = voc
    const selectImgSet = voc.getImgSetNames()[0]
    this.numImg = this.voc.getImgNames(selectImgSet).length
    this.resetImgSet(selectImgSet)
  }

  onImgSetClick = imgSetName => {
    this.resetImgSet(imgSetName)
    this.numImg = this.voc.getImgNames(imgSetName).length
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

  onDeleteVocObj = () => {
    this.setState({ vocObjDeleteDialogOpen: true })
  }

  handleDeleteVocObjDialogClose = isDelete => {
    this.setState({ vocObjDeleteDialogOpen: false })
    if (isDelete) {
      const { selectVocObjIndex, selectImgSet, selectImgIndex } = this.state
      console.log(`Delete voc object ${selectVocObjIndex}`)

      this.voc.deleteVocAnnoObjByIndex(selectVocObjIndex)

      if (selectVocObjIndex !== 0) {
        this.setState({ selectVocObjIndex: selectVocObjIndex - 1 })
      }
    }
  }

  render() {
    const { classes } = this.props

    const {
      mousePos,
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
    if (this.voc != null && selectImgSet !== '') {
      imgPath = this.voc.getImgPathByIndex(selectImgSet, selectImgIndex)
      vocAnno = this.voc.getVocAnnoByIndex(selectImgSet, selectImgIndex)
      imgSets = this.voc.getImgSetNames()
      imgNames = this.voc.getImgNames(selectImgSet)
    }

    return (
      <div className={classes.root}>
        <AppBar position="absolute" className={classes.appBar}>
          <TopBar />
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
          onDeleteVocObj={this.onDeleteVocObj}
        />

        <DeleteDialog
          open={this.state.vocObjDeleteDialogOpen}
          onClose={this.handleDeleteVocObjDialogClose}
        />
      </div>
    )
  }
}

export default withStyles(styles)(App)
