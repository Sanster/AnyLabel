import React from 'react'
import { setTimeout } from 'timers'
import testPng from './assets/test.png'

class Canvas extends React.Component {
  componentDidMount() {
    this.ctx = this.refs.canvas.getContext('2d')
    this.updateCanvas()
    this.offset = 0
  }

  updateCanvas() {
    this.ctx.fillStyle = 'rgb(200,0,0)'
    this.ctx.fillRect(0, 0, 100, 100)
    this.ctx.clearRect(25, 25, 50, 50)

    this.ctx.strokeStyle = 'rgb(0,255,0)'
    this.ctx.strokeRect(100, 100, 100, 100)

    this.ctx.beginPath()
    this.ctx.moveTo(200, 200)
    this.ctx.lineTo(100, 200)
    this.ctx.lineTo(100, 100)
    this.ctx.fill()

    this.ctx.strokeStyle = 'rgb(0,0,255)'
    this.ctx.beginPath()
    this.ctx.arc(200, 200, 50, 0, Math.PI / 2, false)
    this.ctx.arc(50, 100, 50, 0, 10)
    this.ctx.stroke()

    this.ctx.beginPath()
    this.ctx.rect(200, 100, 50, 50)
    this.ctx.stroke()

    const rect = new Path2D()
    rect.rect(200, 0, 50, 50)
    this.ctx.stroke(rect)

    this.ctx.fill(rect)
    // for (var i = 0; i < 6; i++) {
    //   for (var j = 0; j < 6; j++) {
    //     this.ctx.fillStyle = `rgb(${Math.floor(255 - 22.5 * i)},${Math.floor(
    //       255 - 42.5 * j
    //     )},0)`
    //     this.ctx.fillRect(j * 25, i * 25, 25, 25)
    //   }
    // }

    // for (var i = 0; i < 6; i++) {
    //   for (var j = 0; j < 6; j++) {
    //     this.ctx.strokeStyle =
    //       'rgb(0, ' +
    //       Math.floor(255 - 42.5 * i) +
    //       ', ' +
    //       Math.floor(255 - 42.5 * j) +
    //       ')'
    //     this.ctx.beginPath()
    //     this.ctx.arc(12.5 + j * 25, 12.5 + i * 25, 10, 0, Math.PI * 2, true)
    //     this.ctx.stroke()
    //   }
    // }

    // this.march()

    this.ctx.font = '48px serif'
    this.ctx.fillText('Hello world', 200, 200)

    var img = new Image()
    img.onload = () => {
      this.ctx.drawImage(img, 0, 0, 200, 200)
      this.ctx.beginPath()
      this.ctx.moveTo(30, 96)
      this.ctx.lineTo(70, 66)
      this.ctx.lineTo(103, 76)
      this.ctx.lineTo(170, 15)
      this.ctx.stroke()
    }
    img.src = testPng
  }

  drawDash() {
    this.ctx.clearRect(0, 0, 300, 300)
    this.ctx.setLineDash([4, 2])
    this.ctx.lineDashOffset = -this.offset
    this.ctx.strokeRect(10, 10, 100, 100)
  }

  march() {
    this.offset++
    if (this.offset > 16) {
      this.offset = 0
    }
    this.drawDash()
    setTimeout(this.march.bind(this), 20)
  }

  render() {
    return <canvas id="canvas" ref="canvas" width={300} height={300} />
  }
}

export default Canvas
