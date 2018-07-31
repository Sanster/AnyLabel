const { app, Menu, shell, BrowserWindow } = require('electron')

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
            label: '&Open Voc Dataset'
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
