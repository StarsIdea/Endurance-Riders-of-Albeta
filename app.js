const {app, BrowserWindow, Menu, MenuItem} = require('electron')
const path = require('path')
const url = require('url')
const eventdb = require('./model/stores/event');
const racedb = require('./model/stores/race');
const riderdb = require('./model/stores/rider');
const tempRiderdb = require('./model/stores/tempRider');
const tempHorsedb = require('./model/stores/tempHorse');

if(handleSquirrelEvent(app)) {
  return;
}

global.eventdb = eventdb;
global.racedb = racedb;
global.riderdb = riderdb;
global.tempRiderdb = tempRiderdb;
global.tempHorsedb = tempHorsedb;


global.sharedObj = {
  event_id: null,
  race_id: null,
  rider_category: null
};

let window = null

app.once('ready', () => {
  window = new BrowserWindow({
    width: 1600,
    height: 1024,
    backgroundColor: "#fff",
    icon: __dirname + '/favicon.ico',
    show: false
  })

  // window.webContents.openDevTools()
  window.loadURL(url.format({
    pathname: path.join(__dirname, './view/index.html'),
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
                pathname: path.join(__dirname, './view/auto-correct.html'),
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

function handleSquirrelEvent(application) {
  if (process.argv.length === 1) {
      return false;
  }

  const ChildProcess = require('child_process');
  const path = require('path');

  const appFolder = path.resolve(process.execPath, '..');
  const rootAtomFolder = path.resolve(appFolder, '..');
  const updateDotExe = path.resolve(path.join(rootAtomFolder, 'Update.exe'));
  const exeName = path.basename(process.execPath);

  const spawn = function(command, args) {
      let spawnedProcess, error;

      try {
          spawnedProcess = ChildProcess.spawn(command, args, {
              detached: true
          });
      } catch (error) {}

      return spawnedProcess;
  };

  const spawnUpdate = function(args) {
      return spawn(updateDotExe, args);
  };

  const squirrelEvent = process.argv[1];
  switch (squirrelEvent) {
      case '--squirrel-install':
      case '--squirrel-updated':
          // Optionally do things such as:
          // - Add your .exe to the PATH
          // - Write to the registry for things like file associations and
          //   explorer context menus

          // Install desktop and start menu shortcuts
          spawnUpdate(['--createShortcut', exeName]);

          setTimeout(application.quit, 1000);
          return true;

      case '--squirrel-uninstall':
          // Undo anything you did in the --squirrel-install and
          // --squirrel-updated handlers

          // Remove desktop and start menu shortcuts
          spawnUpdate(['--removeShortcut', exeName]);

          setTimeout(application.quit, 1000);
          return true;

      case '--squirrel-obsolete':
          // This is called on the outgoing version of your app before
          // we update to the new version - it's the opposite of
          // --squirrel-updated

          application.quit();
          return true;
  }
}