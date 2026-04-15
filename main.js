const { app, BrowserWindow } = require('electron');

let mainWindow;

function createWindow () {
    // 1. Force the App Window to open immediately
    mainWindow = new BrowserWindow({
        width: 1280,
        height: 720,
        title: "EdgeCore - Spatial OS",
        backgroundColor: '#000000', // Prevents the blinding white flash while booting
        autoHideMenuBar: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    // 2. Try to load the UI (Connecting to your server.js)
    mainWindow.loadURL('http://localhost:3000').catch(e => {
        console.log("Waiting for HSTP server to spin up...");
    });

    // 3. Give the background server 2 seconds to warm up, then refresh the app!
    setTimeout(() => {
        if(mainWindow) {
            console.log("Refreshing Matrix Window...");
            mainWindow.reload();
        }
    }, 2000);
}

app.whenReady().then(() => {
    // Boot your exact server.js file silently in the background
    try {
        require('./server.js'); 
        console.log("🟢 EdgeCore Background Server Initialized");
    } catch (err) {
        console.log("🔴 BACKGROUND SERVER ERROR:", err);
    }
    
    createWindow();
});

// Force kill EVERYTHING when you hit the red X on the app window.
// This is critical: It kills the Node server so Port 3000 doesn't get stuck in the background!
app.on('window-all-closed', function () {
    app.quit();
    process.exit(0); 
});