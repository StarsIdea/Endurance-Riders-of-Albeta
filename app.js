const {app, BrowserWindow, Menu, MenuItem} = require('electron')
const path = require('path')
const url = require('url')
const eventdb = require('./db/stores/event');
const racedb = require('./db/stores/race');
const riderdb = require('./db/stores/rider');
const tempRiderdb = require('./db/stores/tempRider');
const tempHorsedb = require('./db/stores/tempHorse');

global.eventdb = eventdb;
global.racedb = racedb;
global.riderdb = riderdb;
global.tempRiderdb = tempRiderdb;
global.tempHorsedb = tempHorsedb;


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
                pathname: path.join(__dirname, 'auto-correct.html'),
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
