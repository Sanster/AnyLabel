import React from 'react'
import { setTimeout } from 'timers'
import Rect from '../models/rect'
import Point from '../models/point'
import Logger from '../libs/logger'

class Canvas extends React.Component {
    componentDidMount() {
        this.ctx = this.refs.canvas.getContext('2d')
        this.ctx.strokeStyle = 'rgb(0,255,0)'
        this.width = this.refs.canvas.width
        this.height = this.refs.canvas.height
        this.rects = []
        this.isDrawing = false
        this.img = null
        this.imPath = ''
    }

    componentWillReceiveProps(props) {
        this.drawImg(props.bg)
    }

    _clear() {
        this.ctx.clearRect(0, 0, this.width, this.height)
    }

    // show image in canvas center
    drawImg(imPath) {
        if (this.img == null || imPath != this.imPath) {
            this.imPath = imPath
            Logger.debug(`Load image: ${imPath}`)
            const img = new Image()
            img.onload = () => {
                const dx = (this.width - img.width) / 2
                const dy = (this.height - img.height) / 2
                this.ctx.drawImage(img, dx, dy)
                // this line must put in img.onload callback to prevent image load twice
                this.img = img
            }
            this._clear()
            img.src = new URL('file://' + imPath)
        } else {
            const dx = (this.width - this.img.width) / 2
            const dy = (this.height - this.img.height) / 2
            this.ctx.drawImage(this.img, dx, dy)
        }
    }

    updateCanvas() {
        this.ctx.strokeRect(100, 100, 100, 100)
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
            this._clear()
            this.drawImg()
            this.drawRect(this.mouseDownPoint, this.getPoint(e))
        }
    }

    handleMouseUp(e) {
        console.log('mouse up')
        this.isDrawing = false
    }

    getPoint(e) {
        return new Point(e.nativeEvent.offsetX, e.nativeEvent.offsetY)
    }

    drawRect(p1, p2) {
        this.ctx.strokeRect(p1.x, p1.y, p2.x - p1.x, p2.y - p1.y)
    }

    render() {
        return (
            <canvas
                id="canvas"
                ref="canvas"
                width={600}
                height={600}
                onMouseDown={e => this.handleMouseDown(e)}
                onMouseMove={e => this.handleMouseMove(e)}
                onMouseUp={e => this.handleMouseUp(e)}
            />
        )
    }
}

export default Canvas
