import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'

import TopBar from './components/TopBar'
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
      imgIndex: 0,
      imgPath: '',
      vocAnno: null,
      mousePos: new Point()
    }

    this.voc = null
  }

  onCanvasMouseMove = (x, y) => {
    const _mousePos = this.state.mousePos
    _mousePos.x = x
    _mousePos.y = y
    this.setState({ mousePos: _mousePos })
  }

  onVocDirSelected = vocDir => {
    this.voc = new Voc(vocDir)
    const imgPath = this.voc.getImgPathByIndex('train', 0)
    const vocAnno = this.voc.getVocAnnoByIndex('train', 0)
    this.setState({
      imgPath: imgPath,
      vocAnno: vocAnno
    })
  }

  render() {
    const { classes } = this.props
    const { imgPath, vocAnno, mousePos } = this.state

    return (
      <div className={classes.root}>
        <AppBar position="absolute" className={classes.appBar}>
          <TopBar onVocDirSelected={this.onVocDirSelected} />
        </AppBar>

        <LeftSideBar />

        <main className={classes.content}>
          <CanvasView
            imgPath={imgPath}
            vocAnno={vocAnno}
            onMouseMove={this.onCanvasMouseMove}
          />
          <BottomBar mousePos={mousePos} />
        </main>

        <RightSideBar />
      </div>
    )
  }
}

export default withStyles(styles)(App)
