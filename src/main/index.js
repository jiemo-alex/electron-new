const { BrowserWindow } = require('electron')
const createApp = require('./createApp')
const ipcEvents = require('./ipcEvents')
const createMenu = require('./createMenu')
const path = require('path')

createApp(_ => {   
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    // icon: path.join(__dirname, 'favicon.ico'),
    webPreferences: {
      nodeIntegration: true
    }
  })

  ipcEvents(win)
  createMenu(win)
  win.loadFile('src/view/index.html')
  win.webContents.openDevTools()
})
