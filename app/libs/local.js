class Local {
  static openDir(cb) {
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

export default Local
