import React from 'react'
import { setTimeout } from 'timers'
import Rect from '../models/rect'
import Point from '../models/point'
import Logger from '../libs/logger'
import Canvas from '../libs/canvas'

class CanvasView extends React.Component {
  constructor(props) {
    super(props)
    this.IM_MAX_WIDTH = 730
    this.IM_MAX_HEIGHT = 520

    this.rects = []
    this.isDrawing = false
    this.img = null
    this.imPath = ''
    this.scale = 1
    this.sHeight = 0
    this.sWidth = 0
    this.mousePos = new Point(0, 0)

    this.updateCanvas(props.imPath, props.anno)
  }

  componentDidMount() {
    console.log('componentDidMount')
    this.canvas = new Canvas(this.refs.canvas)
  }

  componentWillReceiveProps(props) {
    console.log('componentWillReceiveProps')
    this.updateCanvas(props.imPath, props.anno)
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

  updateCanvas(imPath, anno) {
    if (this.img == null || imPath != this.imPath) {
      this.imPath = imPath
      Logger.debug(`Load image: ${imPath}`)
      const img = new Image()
      img.onload = () => this._onImgLoad(img, anno)
      img.src = new URL('file://' + imPath)
    }

    this.drawAnno(anno)
  }

  drawImg() {
    if (this.img != null) {
      this.canvas.drawImage(this.img, this.sWidth, this.sHeight)
    }
  }

  handleMouseDown(e) {
    console.log(
      `mouse down x: ${e.nativeEvent.offsetX} y: ${e.nativeEvent.offsetY}`
    )

    if (this.isDrawing == false) {
      this.isDrawing = true
      this.mouseDownPoint = this.getPoint(e)
    }
  }

  handleMouseMove(e) {
    this.mousePos.x = e.nativeEvent.offsetX
    this.mousePos.y = e.nativeEvent.offsetY
    this.props.onMouseMove(this.mousePos)

    if (this.isDrawing) {
      this._clear()
      this.drawImg()
      //   this.drawRect(this.mouseDownPoint, this.getPoint(e))
    }
  }

  handleMouseUp(e) {
    this.isDrawing = false
  }

  getPoint(e) {
    return new Point(e.nativeEvent.offsetX, e.nativeEvent.offsetY)
  }

  _clear() {
    this.canvas.clear()
  }

  render() {
    return (
      <canvas
        id="canvas"
        ref="canvas"
        onMouseDown={e => this.handleMouseDown(e)}
        onMouseMove={e => this.handleMouseMove(e)}
        onMouseUp={e => this.handleMouseUp(e)}
      />
    )
  }
}

export default CanvasView
