import React from 'react'
import PropTypes from 'prop-types'
import { Stage, Layer, Image } from 'react-konva'

import Rect from '../models/Rect'
import Point from '../models/Point'
import VocAnno from '../models/VocAnno'
import Logger from '../libs/Logger'
import Canvas from '../libs/Canvas'
import io from '../libs/io'

import CRect from './shapes/CRect'

class CanvasView extends React.Component {
  constructor(props) {
    super(props)
    this.MAX_WIDTH = 750
    this.MAX_HEIGHT = 600

    this.anno = null
    this.imgPath = ''
    this.imageNode = null

    this.scaledImgWidth = 0
    this.scaledImgHeight = 0
    this.scale = 1
    this.image = new window.Image()

    this.state = {
      selectVocObjId: -1,
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
    if (nextProps.imgPath !== this.imgPath) {
      this.updateCanvas(nextProps)
      return
    }

    if (
      nextProps.imgPath === this.imgPath &&
      nextProps.selectVocObjId !== this.selectVocObjId
    ) {
      this.updateAnnos(nextProps)
    }
  }

  updateCanvas(props) {
    // console.log('updateCanvas')
    const { imgPath, vocAnno, selectVocObjId } = props

    if (!io.exists(imgPath)) {
      console.log(`imgPath not exists: ${imgPath}`)
      return
    }

    this.anno = vocAnno
    this.imgPath = imgPath
    this.setState({ selectVocObjId })

    this.image.src = new URL('file://' + imgPath)
  }

  // 不重新读取图片只重绘 anno
  updateAnnos(props) {
    this.setState({ selectVocObjId: props.selectVocObjId })
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
    this.scaledImgWidth = img.width / this.scale
    this.scaledImgHeight = img.height / this.scale
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

  renderObjs(imgLeft, imgTop, selectVocObjId) {
    if (this.anno === null) return null

    const objs = this.anno.getObjs()

    return objs.map(n => (
      <CRect
        key={n.id}
        x={imgLeft + n.rect.x1 / this.scale}
        y={imgTop + n.rect.y1 / this.scale}
        width={n.rect.width / this.scale}
        height={n.rect.height / this.scale}
        selected={n.id === selectVocObjId}
      />
    ))
  }

  render() {
    const { stageHeight, stageWidth, selectVocObjId } = this.state
    const imgLeft = (stageWidth - this.scaledImgWidth) / 2
    const imgTop = (stageHeight - this.scaledImgHeight) / 2

    const objCRects = this.renderObjs(imgLeft, imgTop, selectVocObjId)

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
              x={imgLeft}
              y={imgTop}
              width={this.scaledImgWidth}
              height={this.scaledImgHeight}
              ref="imageNode"
            />
            {objCRects}
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
