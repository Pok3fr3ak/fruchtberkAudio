import { app, BrowserWindow } from 'electron';
//import isDev from 'electron-is-dev'

export class ProjectOverview {
  public readonly mainWindow: BrowserWindow;

  constructor() {
    this.mainWindow = this.createWindow();
  }

  createWindow(): BrowserWindow {
    const mainWindow = new BrowserWindow({
      width: 1200,
      height: 720,
      show: true, // This will show the window on launch time.
      webPreferences: {
        //webSecurity: false,
        nodeIntegration: true,
        contextIsolation: false,
      },
    })

    mainWindow.webContents.openDevTools();

    // Load our index.html
    //@ts-ignore
    mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY)
    return mainWindow;
  }
}
