import React from 'react'
import PropTypes from 'prop-types'

import Rect from '../models/Rect'
import Point from '../models/Point'
import VocAnno from '../models/VocAnno'
import Logger from '../libs/Logger'
import Canvas from '../libs/Canvas'

class CanvasView extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    Logger.log('componentDidMount')
    this.canvas = new Canvas(this.refs.canvas)
    this.updateCanvas(this.props.imgPath, this.props.vocAnno)
  }

  componentWillReceiveProps(props) {
    // Logger.log('componentWillReceiveProps')
    this.updateCanvas(props.imgPath, props.vocAnno)
  }

  drawAnno(anno) {
    if (anno == null) return

    Logger.debug(`Object num: ${anno.objs.length}`)
    anno.objs.forEach(obj => {
      this.canvas.drawRect(obj.rect, this.scale)
    })
  }

  _findBestImgSize(img) {
    let wScale = 1
    let hScale = 1
    if (img.width > this.IM_MAX_WIDTH) {
      wScale = img.width / this.IM_MAX_WIDTH
    }
    if (img.height > this.IM_MAX_HEIGHT) {
      hScale = img.height / this.IM_MAX_HEIGHT
    }

    this.scale = Math.max(wScale, hScale)
    this.sWidth = img.width / this.scale
    this.sHeight = img.height / this.scale

    this.canvas.setWidth(this.sWidth)
    this.canvas.setHeight(this.sHeight)

    // strokeStype will be reset after set width/height
    // so we need to reset here
    this.canvas.setStrokeColor(0, 255, 0)
    this.canvas.setLineWidth(2)
  }

  _onImgLoad(img, anno) {
    this._findBestImgSize(img)

    this.canvas.drawImage(img, this.sWidth, this.sHeight)
    this.drawAnno(anno)
    this.img = img
  }

  updateCanvas(imgPath, anno) {
    if (this.img == null || imgPath != this.imgPath) {
      this.imgPath = imgPath
      Logger.log(`Load image: ${imgPath}`)
      const img = new Image()
      img.onload = () => this._onImgLoad(img, anno)
      img.src = new URL('file://' + imgPath)
    }

    this.drawAnno(anno)
  }

  drawImg() {
    if (this.img != null) {
      this.canvas.drawImage(this.img, this.sWidth, this.sHeight)
    }
  }

  getPoint(e) {
    return new Point(e.nativeEvent.offsetX, e.nativeEvent.offsetY)
  }

  handleMouseMove(e) {
    this.props.onMouseMove(e.nativeEvent.offsetX, e.nativeEvent.offsetY)
  }

  render() {
    return (
      <canvas
        id="canvas"
        ref="canvas"
        onMouseMove={e => this.handleMouseMove(e)}
      />
    )
  }
}

CanvasView.propTypes = {
  imgPath: PropTypes.string,
  vocAnno: PropTypes.instanceOf(VocAnno),
  onMouseMove: PropTypes.func
}

export default CanvasView
