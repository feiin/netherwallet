const path = require('path');
const { app, BrowserWindow, ipcMain } = require('electron');
const MyEtherWalletWindow = require('./controllers/MyEtherWallet');

class NMyEtherWallet {
    constructor() {
        this.myEtherWalletWindow = null;
    }

    init() {
        console.log('init myetherwallet');
        this.initApp();
    }

    initApp() {
        app.on('ready', () => {
            this.createMyEtherWalletWindow();
        });

        // Quit when all windows are closed
        app.on('window-all-closed', () => {
            // On OS X it is common for applications and their menu bar
            // to stay active until the user quits explicitly with Cmd + Q
            if (process.platform != 'darwin') {
                app.quit();
            }
        });
    }

    createMyEtherWalletWindow() {
        this.myEtherWalletWindow = new MyEtherWalletWindow();
    }
}


new NMyEtherWallet().init();