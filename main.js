const path = require("path")
const electron = require("electron")
const {
  default: installExtension,
  REACT_DEVELOPER_TOOLS
} = require("electron-devtools-installer")

const BrowserWindow = electron.BrowserWindow
const app = electron.app

const debug = /development/.test(process.env.NODE_ENV)

var mainWindow = null

function initialize() {
  var shouldQuit = makeSingleInstance()
  if (shouldQuit) return app.quit()

  function createWindow() {
    var windowOptions = {
      width: 1080,
      minWidth: 680,
      height: 840,
      title: app.getName(),
      // To load local image file
      webPreferences: {
        webSecurity: false
      }
    }

    mainWindow = new BrowserWindow(windowOptions)

    if (debug) {
      mainWindow.loadURL("http://localhost:1234")
      installExtension(REACT_DEVELOPER_TOOLS)
        .then(name => console.log(`Added Extension:  ${name}`))
        .catch(err => console.log("An error occurred: ", err))
    } else {
      mainWindow.loadURL(path.join("file://", __dirname, "dist/index.html"))
    }

    mainWindow.on("closed", function() {
      mainWindow = null
    })
  }

  app.on("ready", function() {
    createWindow()
  })

  app.on("window-all-closed", function() {
    if (process.platform !== "darwin") {
      app.quit()
    }
  })

  app.on("activate", function() {
    if (mainWindow === null) {
      createWindow()
    }
  })
}

// Make this app a single instance app.
//
// The main window will be restored and focused instead of a second window
// opened when a person attempts to launch a second instance.
//
// Returns true if the current version of the app should quit instead of
// launching.
function makeSingleInstance() {
  if (process.mas) return false

  return app.makeSingleInstance(function() {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus()
    }
  })
}

initialize()
