import express from "express";
import request from "request";
import dotenv from 'dotenv'
import { app, BrowserWindow, dialog, ipcMain, protocol } from 'electron';
import { appManager } from './AppManager';
import cors from 'cors';
import fetch from 'node-fetch'

export class SpotifyLoginHandler {
    public readonly mainWindow: BrowserWindow;

    constructor() {
        this.mainWindow = this.createWindow();
    }

    createWindow(): BrowserWindow {
        const mainWindow = new BrowserWindow({
            width: 400,
            height: 550,
            show: true, // This will show the window on launch time.
            webPreferences: {
                //webSecurity: false,
                nodeIntegration: true,
                contextIsolation: false,
            },
        })

        // Load Spotify Login Page
        mainWindow.loadURL(`http://localhost:5000/auth/login`)
        return mainWindow;
    }
}

dotenv.config();
const server = express();
server.use(cors());
const spotify_client_id = process.env.SPOTIFY_CLIENT_ID;
const spotify_client_secret = process.env.SPOTIFY_CLIENT_SECRET;
let token: string;
let timeWhenTokeExpires: number;
let refreshToken: string;

const generateRandomString = function (length: number) {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};

server.get('/', (req, res) => {
    ipcMain.emit('SpotifyLoginCompleted');
})

server.get('/auth/login', (req, res) => {
    console.log('\n---New Login---\n');

    var scope = "streaming \
    user-read-email \
    user-read-private \
    playlist-read-private"

    var state = generateRandomString(16);

    var auth_query_parameters = new URLSearchParams({
        response_type: "code",
        client_id: spotify_client_id,
        scope: scope,
        redirect_uri: "http://localhost:5000/auth/callback",
        state: state
    })
    res.redirect('https://accounts.spotify.com/authorize/?' + auth_query_parameters.toString());
})

server.get('/auth/callback', (req, res) => {

    const code = req.query.code;

    const authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        form: {
            code: code,
            redirect_uri: "http://localhost:5000/auth/callback",
            grant_type: 'authorization_code'
        },
        headers: {
            'Authorization': 'Basic ' + (Buffer.from(spotify_client_id + ':' + spotify_client_secret).toString('base64')),
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        json: true
    }

    request.post(authOptions, (error, response, body) => {
        if (!error && response.statusCode === 200) {
            const access_token = body.access_token;
            token = body.access_token;
            refreshToken = body.refresh_token;
            timeWhenTokeExpires = Date.now() + 3600 * 1000
            res.redirect('/');
        }
    })

})

server.get('/auth/token', (req, res) => {
    console.log(`---FRONTEND WANTS NEW TOKEN---\nTime when Token expires: ${timeWhenTokeExpires}\nCurrent Time: ${Date.now()}\nDifference: ${timeWhenTokeExpires - Date.now()}\nToken: ${token}\n---END OF TOKEN REQUEST---`);

    if (Date.now() > timeWhenTokeExpires) {
        console.log('Fetching new Token because old one expired');

        const urlOptions = {
            url: 'https://accounts.spotify.com/api/token',
            headers: {
                'Authorization': 'Basic ' + (Buffer.from(spotify_client_id + ':' + spotify_client_secret).toString('base64')),
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            form: {
                grant_type: 'refresh_token',
                refresh_token: refreshToken
            }
        }
    
        request.post(urlOptions, (error, response, body) => {
            if (!error && response.statusCode === 200) {
                token = body.access_token;
                timeWhenTokeExpires = Date.now() + 3600 * 1000;
            }
        })

    } else {
        res.json({
            "access_token": token
        })
    }

})

server.listen(5000, () => {
    console.log("\n\n\napp is listening on port 5000\n\n\n");
})