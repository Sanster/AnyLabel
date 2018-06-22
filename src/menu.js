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
    const templateDefault = [
      //   {
      //     label: '&File',
      //     submenu: [
      //       {
      //         label: '&Open Voc',
      //         accelerator: 'Ctrl+O'
      //       }
      //     ]
      //   },
      {
        label: '&Dev',
        submenu: [{ role: 'reload' }, { role: 'toggledevtools' }]
      }
    ]

    return templateDefault
  }
}

module.exports = MenuBuilder
