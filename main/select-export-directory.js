// Node Libs
const fs = require('fs');

// Electron Libs
const ipc = require('electron').ipcMain;
const dialog = require('electron').dialog;
const BrowserWindow = require('electron').BrowserWindow;

// 3rd Party Libs
const appConfig = require('electron-settings');

ipc.on('select-export-directory', event => {
  const window = BrowserWindow.fromWebContents(event.sender);
  dialog.showOpenDialog(window, {
    properties: ['openDirectory']
  }).then(result => {
    if (result.filePaths) {
      fs.access(result.filePaths[0], fs.constants.W_OK, err => {
        if (err) {
          event.reply('no-access-directory', err.message);
        } else {
          appConfig.setSync('exportDir', result.filePaths[0]);
          event.reply('confirmed-export-directory', result.filePaths[0]);
        }
      });
    }
  }).catch(err => {
    event.reply('no-access-directory', err.message);
  });
});
