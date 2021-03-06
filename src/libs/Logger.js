class Logger {
  static log(msg) {
    console.log(Logger._time(msg))
  }

  static _time(msg) {
    const d = new Date()
    return `${d.toLocaleString()}: ${msg}`
  }
}

module.exports = Logger
