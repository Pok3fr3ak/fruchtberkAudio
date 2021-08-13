import { app, BrowserWindow, dialog, ipcMain, protocol, webContents } from 'electron';
import contextMenu from 'electron-context-menu';
import { appManager } from './electron/AppManager';
import { db } from './electron/DB';
import { ProjectOverview } from './electron/ProjectOverview';
import installExtention, {REACT_DEVELOPER_TOOLS} from 'electron-devtools-installer';

const appElements: any = {
    windows: []
};

app.on('ready', () => {
    protocol.registerFileProtocol('file', (request, cb) => {
        const url = request.url.replace('file:///', '')
        const decodedUrl = decodeURI(url)
        try {
          return cb(decodedUrl)
        } catch (error) {
          console.error('ERROR: registerLocalResourceProtocol: Could not get file path:', error)
        }
      })

    appManager.setWindow('Projects', new ProjectOverview());

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

app.whenReady().then(()=>{
    installExtention(REACT_DEVELOPER_TOOLS)
    .then((name) => console.log(`Added Extension:  ${name}`))
    .catch((err) => console.log('An error occurred: ', err))
})