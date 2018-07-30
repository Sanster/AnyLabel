import React from 'react'
import PropTypes from 'prop-types'

import Rect from '../models/Rect'
import Point from '../models/Point'
import VocAnno from '../models/VocAnno'
import Logger from '../libs/Logger'
import Canvas from '../libs/Canvas'
import io from '../libs/io'

class CanvasView extends React.Component {
  constructor(props) {
    super(props)
    this.MAX_WIDTH = 750
    this.MAX_HEIGHT = 600
    this.img = null
    this.imgPath = null
    this.selectVocObjIndex = props.selectVocObjIndex
  }

  componentDidMount() {
    Logger.log('componentDidMount')
    this.canvas = new Canvas(this.refs.canvas)
    this.updateCanvas(this.props.imgPath, this.props.vocAnno)
  }

  componentWillReceiveProps(props) {
    Logger.log('CanvasView componentWillReceiveProps')
    this.updateCanvas(props.imgPath, props.vocAnno, props.selectVocObjIndex)
  }

  drawAnno(anno) {
    if (anno == null) return

    anno.objs.forEach((obj, index) => {
      if (index === this.selectVocObjIndex) {
        this.canvas.drawRect(obj.rect, this.scale, true)
      }

      this.canvas.drawRect(obj.rect, this.scale)
    })
  }

  findBestImgSize(img) {
    let wScale = 1
    let hScale = 1
    if (img.width > this.MAX_WIDTH) {
      wScale = img.width / this.MAX_WIDTH
    }
    if (img.height > this.MAX_HEIGHT) {
      hScale = img.height / this.MAX_HEIGHT
    }

    this.scale = Math.max(wScale, hScale)
    this.sWidth = img.width / this.scale
    this.sHeight = img.height / this.scale

    this.canvas.setWidth(this.sWidth)
    this.canvas.setHeight(this.sHeight)

    // strokeStype will be reset after set width/height
    // so we need to reset here
    this.canvas.setStrokeColor(0, 255, 0)
    this.canvas.setFillColor(0, 0, 255)
    this.canvas.setLineWidth(2)
  }

  onImgLoad() {
    this.findBestImgSize(this.img)

    this.canvas.drawImage(this.img, this.sWidth, this.sHeight)
    this.drawAnno(this.anno)

    const fileSize = io.fileSize(this.imgPath)
    this.props.onImgLoad(this.img.width, this.img.height, fileSize)
  }

  updateCanvas(imgPath, anno, selectVocObjIndex) {
    if (!io.exists(imgPath)) return

    if (this.img == null || imgPath !== this.imgPath) {
      this.anno = anno
      this.imgPath = imgPath

      Logger.log(`Load image: ${imgPath}`)
      const img = new Image()
      img.onload = e => {
        this.img = img
        this.onImgLoad()
      }
      img.src = new URL('file://' + imgPath)
    }

    if (selectVocObjIndex != this.selectVocObjIndex) {
      this.selectVocObjIndex = selectVocObjIndex
      this.onImgLoad()
    }
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
      <div className="canvas-wrapper">
        <canvas
          id="canvas"
          ref="canvas"
          onMouseMove={e => this.handleMouseMove(e)}
        />
      </div>
    )
  }
}

CanvasView.propTypes = {
  imgPath: PropTypes.string,
  vocAnno: PropTypes.instanceOf(VocAnno),
  onMouseMove: PropTypes.func,
  selectVocObjIndex: PropTypes.number
}

export default CanvasView
