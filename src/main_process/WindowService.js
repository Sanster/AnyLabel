const { dialog } = require('electron')

class WindowService {
  static pickVocDir() {
    const selectedDir = dialog.showOpenDialog({ properties: ['openDirectory'] })
    //   TODO: check voc valid
    if (selectedDir) {
      return selectedDir[0]
    }

    return null
  }
}

module.exports = WindowService
