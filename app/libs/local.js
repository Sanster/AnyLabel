const walker = remote.require('./main_thread/walker')

class Local {
  constructor() {
    this.walker = walker
  }

  openDir(cb) {
    remote.dialog.showOpenDialog(
      remote.getCurrentWindow(),
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

// this will export same instance after first import
export default new Local()
