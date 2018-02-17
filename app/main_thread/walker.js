const fs = require('fs')
const path = require('path')

exports.readFiles = (rootDir, cb) => {
  fs.readdir(rootDir, (err, files) => {
    if (err) {
      console.error(err)
    } else {
      cb(files)
    }
  })
}
