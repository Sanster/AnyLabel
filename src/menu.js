const { app, Menu, shell, BrowserWindow } = require('electron')
const WindowService = require('./main_process/WindowService')

class MenuBuilder {
  constructor(mainWindow) {
    this.mainWindow = mainWindow
  }

  buildMenu() {
    const template = this.buildDefaultTemplate()

    const menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)

    return menu
  }

  buildDefaultTemplate() {
    const template = [
      {
        label: '&File',
        submenu: [
          {
            label: '&Open Voc Dataset',
            click: () => {
              const vocDir = WindowService.pickVocDir()
              if (vocDir) {
                this.mainWindow.webContents.send('open-voc', vocDir)
              }
            }
          }
        ]
      },
      {
        label: '&Dev',
        submenu: [{ role: 'reload' }, { role: 'toggledevtools' }]
      }
    ]

    if (process.platform === 'darwin') {
      template.unshift({
        label: 'AnyLabel',
        submenu: [{ role: 'about' }, { role: 'quit' }]
      })
    }

    return template
  }
}

module.exports = MenuBuilder
