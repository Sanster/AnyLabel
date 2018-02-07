const walker = electron.require('./main_thread/walker')

class Local {
  constructor() {
    this.walker = walker
  }

  openDir(cb) {
    electron.dialog.showOpenDialog(
      {
        properties: ['openDirectory']
      },
      filePaths => {
        if (filePaths != undefined) {
          cb(filePaths[0])
        }
      }
    )
  }
}

// TODO: check if import in different file is same instance
export default new Local()
