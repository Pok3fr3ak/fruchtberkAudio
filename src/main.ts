import { app, BrowserWindow, dialog, ipcMain, webContents } from 'electron';
import contextMenu from 'electron-context-menu';
import { appManager } from './electron/AppManager';
import { db } from './electron/DB';
import { ProjectOverview } from './electron/ProjectOverview';
import { PropertiesTab } from './electron/PropertiesTab';

const appElements: any = {
    windows: []
};

app.on('ready', () => {
    appManager.setWindow('Projects', new ProjectOverview());


    ipcMain.on('open-layerProperties', (event, arg)=>{
        appManager.setWindow('Properties', new PropertiesTab(arg));
    })

    contextMenu({
        prepend: (defaultActions, parameters, browserWindow) => [
              {
                  label: 'Rainbow',
                  // Only show it when right-clicking images
                  visible: parameters.mediaType === 'image'
              },
          ]
      })

    ipcMain.on('prompt-choose-file', (event) => {
        //NEED TO BE IMPLEMENTED: CHECK WHICH FILES THE AUDIO PLAYER CAN PLAY AND MAKE FILTER APPROPRATELY
        dialog.showOpenDialog(
            {
                title: "Choose File",
                properties: ['openFile'],
                filters: [
                    {name: 'Audio', extensions: ['mp3', 'ogg', 'wav']}
                ]
            }
        )
            .then(res => {
                event.sender.send('file-chosen', res.filePaths);
            });

    })
});

