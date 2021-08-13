import { app, BrowserWindow } from 'electron';
import url from 'url';


export class PropertiesTab {
  public readonly window: BrowserWindow;
  layer:Array<String>;

  constructor(layer:String) {
    this.layer = layer.split('+');
    this.window = this.createWindow();

  }

  createWindow(): BrowserWindow {
    const window = new BrowserWindow({
      width: 600,
      height: 550,
      show: true, // This will show the window on launch time.
      webPreferences: {
        nodeIntegration: true
      }
    })

    //window.webContents.openDevTools();

    // Load our index.html at location #/properties
    window.loadURL(`file://${app.getAppPath()}/index.html#properties/${this.layer[0]}/${this.layer[1]}/${this.layer[2]}`);
    return window;
  }
}
