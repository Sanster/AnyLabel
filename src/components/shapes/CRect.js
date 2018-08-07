import React from 'react'
import Konva from 'konva'
import { Rect } from 'react-konva'

class CRect extends React.Component {
  handleClick = () => {}

  render() {
    const { x, y, width, height, selected } = this.props

    const color = 'green'
    let fill = ''

    if (selected) {
      fill = `rgba(0,0,255,0.3)`
    }

    return (
      <Rect
        x={x}
        y={y}
        width={width}
        height={height}
        stroke={color}
        fill={fill}
        strokeWidth={2.5}
        onClick={this.handleClick}
      />
    )
  }
}

export default CRect
