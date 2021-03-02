import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import { join } from 'path';

if ( process.platform === 'win32' ) {

  process.env.VLC_PLUGIN_PATH = join(__dirname, 'node_modules', 'webchimera.js', 'plugins');

}

let win: BrowserWindow;

function createWindow () {

  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    }
  });

  win.removeMenu();

  win.loadFile('dist/ash-player/index.html');

}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {

  if (process.platform !== 'darwin') app.quit();

});

app.on('activate', () => {

  if (BrowserWindow.getAllWindows().length === 0) createWindow();

});

ipcMain.handle('showOpenDialog', () => {

  return dialog.showOpenDialog(win, {
    properties: ['openFile'],
    filters: [
      { name: 'Videos', extensions: ['mkv', 'mp4', 'avi', 'mov', 'flv', '3gp'] }
    ]
  });

});
