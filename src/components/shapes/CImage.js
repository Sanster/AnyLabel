import React, { Component } from 'react'
import Konva from 'konva'
import { render } from 'react-dom'
import { Stage, Layer, Image } from 'react-konva'

class CImage extends React.Component {
  state = {
    image: new window.Image(),
    x: 0,
    y: 0,
    height: 0,
    width: 0
  }

  render() {
    const { x, y, height, width } = this.props
    const x = cx - this.sWidth / 2
    const y = cy - this.sHeight / 2

    return (
      <Image
        image={this.state.image}
        x={x}
        y={y}
        width={this.sWidth}
        height={this.sHeight}
        ref={node => {
          this.imageNode = node
        }}
      />
    )
  }
}

export default CImage
