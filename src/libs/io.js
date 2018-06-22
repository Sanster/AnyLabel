const electron = window.require('electron')
const fs = electron.remote.require('fs')

// 检查文件，文件夹是否存在
function exists(path) {
  return fs.existsSync(path)
}

const io = {
  exists: exists
}

export default io
