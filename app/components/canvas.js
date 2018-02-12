import React from 'react'
import { setTimeout } from 'timers'
import Rect from '../models/rect'
import Point from '../models/point'
import Logger from '../libs/logger'

class Canvas extends React.Component {
  componentDidMount() {
    console.log('componentDidMount')
    this.IM_MAX_WIDTH = 980
    this.IM_MAX_HEIGHT = 600

    this.ctx = this.refs.canvas.getContext('2d')
    this.rects = []
    this.isDrawing = false
    this.img = null
    this.imPath = ''
    this.scale = 1
    this.sHeight = 0
    this.sWidth = 0
  }

  componentWillReceiveProps(props) {
    console.log('componentWillReceiveProps')
    this.updateCanvas(props.bg, props.anno)
  }

  drawAnno(anno) {
    if (anno == null) return

    Logger.debug(`Object num: ${anno.objs.length}`)
    anno.objs.forEach(obj => {
      this.ctx.strokeRect(
        obj.rect.x1 / this.scale,
        obj.rect.y1 / this.scale,
        obj.rect.width / this.scale,
        obj.rect.height / this.scale
      )
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

    this.refs.canvas.width = this.sWidth
    this.refs.canvas.height = this.sHeight

    // strokeStype will be reset after set width/height
    // so we need to reset here
    this.ctx.strokeStyle = 'rgb(0,255,0)'
  }

  _onImgLoad(img, anno) {
    this._findBestImgSize(img)
    this.ctx.drawImage(
      img,
      0,
      0,
      img.width,
      img.height,
      0,
      0,
      this.sWidth,
      this.sHeight
    )
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
  }

  drawImg() {
    if (this.img != null) {
      this.ctx.drawImage(
        this.img,
        0,
        0,
        this.img.width,
        this.img.height,
        0,
        0,
        this.sWidth,
        this.sHeight
      )
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
    if (this.isDrawing) {
      console.log(
        `mouse move x: ${e.nativeEvent.offsetX} y: ${e.nativeEvent.offsetY}`
      )
      this._clear()
      this.drawImg()
      this.drawRect(this.mouseDownPoint, this.getPoint(e))
    }
  }

  handleMouseUp(e) {
    this.isDrawing = false
  }

  getPoint(e) {
    return new Point(e.nativeEvent.offsetX, e.nativeEvent.offsetY)
  }

  drawRect(p1, p2) {
    this.ctx.strokeRect(p1.x, p1.y, p2.x - p1.x, p2.y - p1.y)
  }

  _clear() {
    this.ctx.clearRect(0, 0, this.refs.canvas.width, this.refs.canvas.height)
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

export default Canvas
