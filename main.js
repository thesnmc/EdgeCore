const { app, BrowserWindow } = require('electron');

let mainWindow;

function createWindow () {
    // 1. Force the App Window to open immediately
    mainWindow = new BrowserWindow({
        width: 1280,
        height: 720,
        title: "Paradigm III - Spatial OS",
        autoHideMenuBar: true
    });

    // 2. Try to load the UI
    mainWindow.loadURL('http://localhost:3000').catch(e => console.log("Waiting for server to spin up..."));

    // 3. Give the background server 2 seconds to warm up, then refresh the app!
    setTimeout(() => {
        if(mainWindow) mainWindow.reload();
    }, 2000);
}

app.whenReady().then(() => {
    // Boot your exact server.js file silently in the background
    try {
        require('./server.js'); 
    } catch (err) {
        console.log("BACKGROUND SERVER ERROR:", err);
    }
    
    createWindow();
});

// Force kill EVERYTHING when you hit the red X on the app window
app.on('window-all-closed', function () {
    app.quit();
    process.exit(0); 
});