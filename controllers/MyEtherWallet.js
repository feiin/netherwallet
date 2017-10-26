const { app, shell, BrowserWindow } = require('electron');
const url = require('url');
const path = require('path');

class MyEtherWalletWindow {

    constructor() {
        this.walletWindow = null;
        this.createWindow();
    }

    createWindow() {
        this.walletWindow = new BrowserWindow({
            width: 1000,
            height: 720,
            title:'MyEtherWallet App'
        });
        
        this.walletWindow.loadURL(url.format({
            pathname: path.join(__dirname, '../assets/index.html'),
            protocol: 'file:',
            slashes: true
        }));

        this.walletWindow.openDevTools();
        
    }

    initEvents() {
        this.walletWindow.on('closed', () => {
            this.walletWindow = null;
        })
    }
}

module.exports = MyEtherWalletWindow;
