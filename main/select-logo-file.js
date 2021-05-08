// Electron Libs
const ipc = require('electron').ipcMain;
const dialog = require('electron').dialog;

ipc.on('open-file-dialog', event => {
  dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [{ name: 'Images', extensions: ['jpg', 'png', 'svg'] }],
  }).then(result => {
    if (result.filePaths) event.sender.send('file-selected', result.filePaths[0]);
  }).catch(err => {
    ;
  });
});
