class Rect {
  constructor(x1, y1, x2, y2) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
  }

  width() {
    return x2 - x1;
  }

  height() {
    return y2 - y1;
  }
}

export default Rect;
