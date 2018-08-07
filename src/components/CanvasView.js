import React from 'react'
import PropTypes from 'prop-types'

import Rect from '../models/Rect'
import Point from '../models/Point'
import VocAnno from '../models/VocAnno'
import Logger from '../libs/Logger'
import Canvas from '../libs/Canvas'
import io from '../libs/io'

import { Stage, Layer, Image } from 'react-konva'

class CanvasView extends React.Component {
  constructor(props) {
    super(props)
    this.MAX_WIDTH = 750
    this.MAX_HEIGHT = 600
    this.imgPath = ''
    this.selectVocObjId = -1
    this.imageNode = null
    this.sWidth = 0
    this.sHeight = 0
    this.scale = 1

    this.state = {
      image: new window.Image(),
      stageHeight: 0,
      stageWidth: 0
    }
  }

  componentDidMount() {
    // this.canvas = new Canvas(this.refs.canvas)
    this.imageNode = this.refs.imageNode
    this.canvasWrapper = this.refs.canvasWrapper
    this.setState({
      stageHeight: this.canvasWrapper.clientHeight,
      stageWidth: this.canvasWrapper.clientWidth
    })
    this.updateCanvas()
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (
      nextProps.imgPath === this.imgPath &&
      nextProps.selectVocObjId === this.selectVocObjId
    ) {
      return false
    }
    return true
  }

  updateCanvas() {
    const { imgPath, anno, selectVocObjId } = this.props

    if (!io.exists(imgPath)) return

    this.anno = anno
    this.imgPath = imgPath
    this.selectVocObjId = selectVocObjId

    this.state.image.src = new URL('file://' + imgPath)
    this.state.image.onload = () => {
      this.imageNode.getLayer().batchDraw()
      this.onImgLoad()
    }

    // this.canvas.drawImage(this.img, this.sWidth, this.sHeight)
    // this.drawAnno(this.anno)
  }

  drawAnno(anno) {
    if (anno == null) return

    anno.getObjs().forEach((obj, index) => {
      if (obj.id === this.selectVocObjId) {
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

    // this.canvas.setWidth(this.sWidth)
    // this.canvas.setHeight(this.sHeight)

    // // strokeStype will be reset after set width/height
    // // so we need to reset here
    // this.canvas.setStrokeColor(0, 255, 0)
    // this.canvas.setFillColor(0, 0, 255)
    // this.canvas.setLineWidth(2)
  }

  onImgLoad() {
    const { image } = this.state
    this.findBestImgSize(image)

    this.canvas.drawImage(image, this.sWidth, this.sHeight)
    this.drawAnno(this.anno)

    const fileSize = io.fileSize(this.imgPath)
    this.props.onImgLoad(image.width, image.height, fileSize)
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
    const p = this.getCorrectXY(e)
    this.props.onMouseMove(p.x, p.y)
  }

  handleMouseDown(e) {
    const p = this.getCorrectXY(e)
    const obj = this.anno.searchObj(p)
    if (obj != null) {
      this.props.onClickVocObjInCanvas(obj)
    }
  }

  handleKeyDown(event) {
    if (event.key === 'Delete') {
      this.props.onDeleteVocObj()
    }
  }

  getCorrectXY(e) {
    const x = Math.ceil(this.scale * e.nativeEvent.offsetX)
    const y = Math.ceil(this.scale * e.nativeEvent.offsetY)
    return new Point(x, y)
  }

  render() {
    const { image, stageHeight, stageWidth } = this.state
    const x = 0
    const y = 0
    return (
      <div
        className="canvas-wrapper"
        ref="canvasWrapper"
        onKeyDown={e => this.handleKeyDown(e)}
        // https://stackoverflow.com/questions/43503964/onkeydown-event-not-working-on-divs-in-react
        tabIndex="0"
      >
        <Stage width={stageWidth} height={stageHeight}>
          <Layer>
            <Image
              image={image}
              x={x}
              y={y}
              width={this.sWidth}
              height={this.sHeight}
              ref="imageNode"
            />
          </Layer>
        </Stage>
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
