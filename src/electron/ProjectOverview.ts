import { app, BrowserWindow } from 'electron';
import isDev from 'electron-is-dev'

export class ProjectOverview {
  public readonly window: BrowserWindow;

  constructor() {
    this.window = this.createWindow();
  }

  createWindow(): BrowserWindow {
    const window = new BrowserWindow({
      width: 1200,
      height: 720,
      show: true, // This will show the window on launch time.
      webPreferences: {
        nodeIntegration: true,
        webSecurity: false
      }
    })

    window.webContents.openDevTools();

    // Load our index.html
    window.loadURL(isDev ? 'http://localhost:9000' : `file://${app.getAppPath()}/index.html`)
    return window;
  }
}
