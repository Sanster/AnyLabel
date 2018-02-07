const fs = require('fs')
const path = require('path')

exports.readImgFiles = (rootDir, pathcb) => {
  fs.readdir(rootDir, (err, files) => {
    if (err) {
      console.error(err)
    } else {
      files.forEach(filename => {
        const filepath = path.join(rootDir, filename)
        pathcb(filepath)
      })
    }
  })
}
