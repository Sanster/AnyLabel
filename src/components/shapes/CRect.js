import React from 'react'
import Konva from 'konva'
import { Rect } from 'react-konva'

class CRect extends React.Component {
  state = {
    color: 'green'
  }
  handleClick = () => {
    this.setState({
      color: Konva.Util.getRandomColor()
    })
  }
  render() {
    const { x, y, width, height } = this.props
    return (
      <Rect
        x={x}
        y={y}
        width={width}
        height={height}
        stroke={this.state.color}
        strokeWidth={2.5}
        onClick={this.handleClick}
      />
    )
  }
}

export default CRect
