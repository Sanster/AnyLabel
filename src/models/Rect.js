class Rect {
  constructor(x1, y1, x2, y2) {
    this.x1 = parseInt(x1)
    this.y1 = parseInt(y1)
    this.x2 = parseInt(x2)
    this.y2 = parseInt(y2)

    this.width = x2 - x1
    this.height = y2 - y1
  }

  contain(point) {
    return (
      this.x1 < point.x &&
      this.y1 < point.y &&
      this.x2 > point.x &&
      this.y2 > point.y
    )
  }
}

export default Rect
