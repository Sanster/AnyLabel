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
import SwitchImgDialog from './components/dialogs/SwitchImgDialog'
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
      selectVocObjId: 0,
      mousePos: new Point(),
      vocObjDeleteDialogOpen: false,
      switchImgDialogOpen: false,
      vocObjChanged: false, // Object 是否有删除或添加
      imgSetChanged: false // 图片集合是否有删除
    }

    this.switchNextImg = false
    this.switchPrevImg = false
    this.voc = null
    this.numImg = 0
    this.bindKey()
    this.registerIpc()
  }

  bindKey = () => {
    Mousetrap.bind('left', this.onLeftKeyPress)
    Mousetrap.bind('right', this.onRightKeyPress)
    Mousetrap.bind('ctrl+s', this.saveVocAnno)
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

  onClickVocObjInCanvas = vocObj => {
    this.setState({ selectVocObjId: vocObj.id })
  }

  resetImgSet = imgSetName => {
    this.setState({
      selectImgIndex: 0,
      selectImgSet: imgSetName,
      selectVocObjIndex: 0
    })
  }

  saveVocAnno = () => {
    const { vocObjChanged, imgSetChanged } = this.state
    if (vocObjChanged || imgSetChanged) {
      this.voc.saveVocAnno()
      this.setState({
        vocObjChanged: false,
        imgSetChanged: false
      })
    }
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
    this.setState({
      selectImgIndex: imgIndex,
      selectVocObjIndex: 0
    })
  }

  onVocObjClick = vocObj => {
    console.log(`App.js onVocObjClick: ${vocObj.id}`)
    this.setState({ selectVocObjId: vocObj.id })
  }

  onImgLoad = (width, height, fileSize) => {
    this.setState({
      selectImgWidth: width,
      selectImgHeight: height,
      selectImgSize: fileSize
    })
  }

  onRightKeyPress = () => {
    const { selectImgIndex, vocObjChanged } = this.state
    if (selectImgIndex < this.numImg - 1) {
      if (vocObjChanged) {
        this.switchNextImg = true
        this.setState({ switchImgDialogOpen: true })
      } else {
        this.showNextImg()
      }
    }
  }

  onLeftKeyPress = () => {
    const { selectImgIndex, vocObjChanged } = this.state
    if (selectImgIndex >= 1) {
      if (vocObjChanged) {
        this.switchPrevImg = true
        this.setState({ switchImgDialogOpen: true })
      } else {
        this.showPrevImg()
      }
    }
  }

  showNextImg = () => {
    const { selectImgIndex } = this.state
    if (selectImgIndex < this.numImg - 1) {
      this.setState({
        selectImgIndex: selectImgIndex + 1,
        vocObjChanged: false
      })
    }
  }

  showPrevImg = () => {
    const { selectImgIndex } = this.state
    if (selectImgIndex >= 1) {
      this.setState({
        selectImgIndex: selectImgIndex - 1,
        vocObjChanged: false
      })
    }
  }

  onDeleteVocObj = () => {
    this.setState({ vocObjDeleteDialogOpen: true })
  }

  handleDeleteVocObjDialogClose = isDelete => {
    this.setState({ vocObjDeleteDialogOpen: false })
    if (isDelete) {
      const { selectVocObjId } = this.state
      console.log(`Delete voc object ${selectVocObjId}`)

      this.voc.deleteVocAnnoObjById(selectVocObjId)

      this.setState({
        vocObjChanged: true,
        selectVocObjId: this.voc.curAnno.getNextObjId(selectVocObjId)
      })
    }
  }

  handleSwitchImgDialogClose = isOk => {
    this.setState({ switchImgDialogOpen: false })
    if (isOk) {
      if (this.switchNextImg) {
        this.showNextImg()
      }
      if (this.switchPrevImg) {
        this.showPrevImg()
      }
    }

    this.switchNextImg = false
    this.switchPrevImg = false
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
      selectVocObjId,
      vocObjChanged
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
            onClickVocObjInCanvas={this.onClickVocObjInCanvas}
            onImgLoad={this.onImgLoad}
            selectVocObjId={selectVocObjId}
          />
          <BottomBar mousePos={mousePos} />
        </main>

        <RightSideBar
          vocAnno={vocAnno}
          selectVocObjId={selectVocObjId}
          vocObjChanged={vocObjChanged}
          onVocObjClick={this.onVocObjClick}
          onDeleteVocObj={this.onDeleteVocObj}
        />

        <DeleteDialog
          open={this.state.vocObjDeleteDialogOpen}
          onClose={this.handleDeleteVocObjDialogClose}
        />

        <SwitchImgDialog
          open={this.state.switchImgDialogOpen}
          onClose={this.handleSwitchImgDialogClose}
        />
      </div>
    )
  }
}

export default withStyles(styles)(App)
