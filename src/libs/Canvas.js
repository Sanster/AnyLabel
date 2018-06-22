class Canvas {
  constructor(canvas) {
    this.canvas = canvas
    this.ctx = this.canvas.getContext('2d')
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
  }

  drawImage(img, width, height) {
    this.ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, width, height)
  }

  drawRect(rect, scale, fill = false) {
    const x = rect.x1 / scale
    const y = rect.y1 / scale
    const w = rect.width / scale
    const h = rect.height / scale

    if (fill) {
      this.ctx.fillRect(x, y, w, h)
    } else {
      this.ctx.strokeRect(x, y, w, h)
    }
  }

  setWidth(width) {
    this.canvas.width = width
  }

  setHeight(height) {
    this.canvas.height = height
  }

  setLineWidth(lineWidth) {
    this.ctx.lineWidth = lineWidth
  }

  setStrokeColor(r, g, b) {
    this.ctx.strokeStyle = `rgb(${r},${g},${b})`
    this.ctx.strokeStyle = `rgb(0,255,0)`
  }
}

export default Canvas
