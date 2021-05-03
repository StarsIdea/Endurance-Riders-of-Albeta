const {app, BrowserWindow, Menu, MenuItem} = require('electron')
const path = require('path')
const url = require('url')
const eventdb = require('./db/stores/event');
const horsedb = require('./db/stores/horse');
const riderdb = require('./db/stores/rider');

global.eventdb = eventdb;
global.horsedb = horsedb;
global.riderdb = riderdb;

global.sharedObj = {event_id: null};

let window = null

// Wait until the app is ready
app.once('ready', () => {
  // Create a new window
  window = new BrowserWindow({
    width: 1440,
    height: 1024,
    backgroundColor: "#fff",
    icon: './assets/image/favicon.ico',
    show: false
  })

  window.webContents.openDevTools()
  // Load a URL in the window to the local index.html path
  window.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  const template = [
    {
      label: 'File',
      submenu: [
        {
            label: 'Edit Autocorrect',
            click(){
              window.loadURL(url.format({
                pathname: path.join(__dirname, 'test.html'),
                protocol: 'file:',
                slashes: true
              }))
            }
        }
      ]
    }
  ]
 
 const menu = Menu.buildFromTemplate(template)
 Menu.setApplicationMenu(menu)

  // Show window when page is ready
  window.once('ready-to-show', () => {
    window.show()
  })
})
