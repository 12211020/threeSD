electron = require('electron')
app = electron.app
BrowserWindow = electron.BrowserWindow
fs = require('fs')

mainWindow = undefined

createWindow = ()->
  mainWindow = new BrowserWindow(
    width: 800
    height: 600
  )
  mainWindow.setMenu(null)
  mainWindow.loadURL("file://#{__dirname}/index.html")

  # Open the DevTools.
#  mainWindow.webContents.openDevTools()

  mainWindow.on('closed', ()->
    mainWindow = undefined
  )

app.on 'ready', createWindow

app.on 'window-all-closed', ()->
  if process.platform isnt 'darwin'
    app.quit()

app.on 'activate', ()->
  createWindow() if not mainWindow