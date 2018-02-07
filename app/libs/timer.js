class Timer {
  constructor() {
    this.total_time = 0
    this.calls = 0
    this.start_time = 0
    // millis
    this.diff = 0
    this.average_time = 0
  }

  tic() {
    this.start_time = Date.now()
  }

  toc(average = false) {
    this.diff = Date.now() - this.start_time
    this.total_time += this.diff
    this.calls += 1
    this.average_time = this.total_time / this.calls
    if (average === true) {
      return this.average_time
    }
    return this.diff
  }
}

module.exports = Timer
