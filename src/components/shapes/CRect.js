import React from 'react'
import Konva from 'konva'
import { Rect, Transformer } from 'react-konva'

class CRect extends React.Component {
  handleClick = () => {}

  handleChange = e => {
    const shape = e.target
    // take a look into width and height properties
    // by default Transformer will change scaleX and scaleY
    // while transforming
    // so we need to adjust that properties to width and height
    console.log(shape)
    this.props.onTransform({
      x: shape.x(),
      y: shape.y(),
      width: shape.width() * shape.scaleX(),
      height: shape.height() * shape.scaleY()
    })
  }

  render() {
    const { x, y, width, height, selected, name } = this.props

    const color = 'green'
    let fill = ''

    if (selected) {
      fill = `rgba(0,0,255,0.3)`
    }

    return (
      <Rect
        onTransformEnd={this.handleChange}
        strokeScaleEnabled={false}
        draggable
        x={x}
        y={y}
        scaleX={1}
        scaleY={1}
        width={width}
        height={height}
        stroke={color}
        fill={fill}
        name={name}
        strokeWidth={2.5}
        onClick={this.handleClick}
      />
    )
  }
}

export default CRect
