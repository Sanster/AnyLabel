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
    this.image = new window.Image()

    this.state = {
      stageHeight: 0,
      stageWidth: 0
    }
  }

  componentDidMount() {
    this.imageNode = this.refs.imageNode
    this.canvasWrapper = this.refs.canvasWrapper

    this.setState({
      stageHeight: this.canvasWrapper.clientHeight,
      stageWidth: this.canvasWrapper.clientWidth
    })

    this.image.onload = () => {
      this.onImgLoad()
    }

    this.updateCanvas(this.props)
  }

  componentWillReceiveProps(nextProps, nextState) {
    // console.log('componentWillReceiveProps')
    if (
      nextProps.imgPath !== this.imgPath ||
      nextProps.selectVocObjId !== this.selectVocObjId
    ) {
      this.updateCanvas(nextProps)
    }
  }

  updateCanvas(props) {
    // console.log('updateCanvas')
    const { imgPath, anno, selectVocObjId } = props

    if (!io.exists(imgPath)) {
      console.log(`imgPath not exists: ${imgPath}`)
      return
    }

    this.anno = anno
    this.imgPath = imgPath
    this.selectVocObjId = selectVocObjId

    this.image.src = new URL('file://' + imgPath)

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
    console.log('onImgLoad')

    this.findBestImgSize(this.image)

    this.imageNode.getLayer().batchDraw()

    const fileSize = io.fileSize(this.imgPath)
    this.props.onImgLoad(this.image.width, this.image.height, fileSize)
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
    const { stageHeight, stageWidth } = this.state
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
              image={this.image}
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
