const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { Client } = require('pg');
const h3 = require('h3-js'); 
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process'); // <-- THE BRIDGE TO THE WINDOWS KERNEL

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// This tells Express to physically bind to the directory it is currently running inside
app.use(express.static(path.join(__dirname, 'public')));

// Fallback to ensure the root URL always loads the UI
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const HVAC_SECRET = "titan-m2-hvac-key-123";
const AXON_SECRET = "titan-m2-axon-key-456";

function signData(payload, secret) { return crypto.createHmac('sha256', secret).update(JSON.stringify(payload)).digest('hex'); }
function verifySignature(payload, signature, secret) { return signData(payload, secret) === signature; }

const baseLat = 13.0827; const baseLng = 80.2707; const roomRes = 14; 
const globalHexId = h3.latLngToCell(baseLat, baseLng, roomRes);

// --- SPATIAL DIRECTORY ENGINE ---
const drivePath = './_SpatialDrive';
if (!fs.existsSync(drivePath)) { fs.mkdirSync(drivePath); console.log('📁 Local Spatial Drive folder created on Windows!'); }

let spatialDirectory = {}; // Master Memory Map

function extractTemp(content) {
    // 1. Try to read the complex JSON format: "temp":"99C"
    const jsonMatch = content.match(/"temp"\s*:\s*"([\d.]+)C?"/i);
    
    // 2. Try to read the raw Plain Text format: Temp: 99C
    const standardMatch = content.match(/Temp:\s*([\d.]+)C?/i);
    
    if (jsonMatch && jsonMatch[1]) {
        return parseFloat(jsonMatch[1]);
    } else if (standardMatch && standardMatch[1]) {
        return parseFloat(standardMatch[1]);
    }
    
    // If it can't read either, default to room temperature
    return 22.0; 
}

// NEW: Teaches the Node Server how to read the AI's hacked coordinates!
function extractCoords(content) {
    const match = content.match(/\[SPATIAL META\] X:\s*([-\d.]+),\s*Z:\s*([-\d.]+)/i);
    if (match) {
        return { x: parseFloat(match[1]), z: parseFloat(match[2]) };
    }
    return null; 
}

// 1. BOOT SCAN: Read all files currently in the folder
function scanDirectory() {
    const files = fs.readdirSync(drivePath);
    files.forEach((filename, index) => {
        if (filename.endsWith('.txt')) {
            const content = fs.readFileSync(`${drivePath}/${filename}`, 'utf8');
            spatialDirectory[filename] = {
                filename: filename,
                temp: extractTemp(content),
                x: (index % 3) * 1.5 - 1.5, // Spread them out on the X axis
                y: 5 + index,               // Drop them from the sky
                z: -Math.floor(index / 3) * 1.5 - 2 // Spread them out on the Z axis
            };
        }
    });
    console.log(`🗄️ Indexed ${Object.keys(spatialDirectory).length} files in Spatial Drive.`);
}
scanDirectory();

// 2. INFINITE FILE WATCHER (UPGRADED)
console.log('👀 Watching Windows Hard Drive for File System changes...');
let fsTimeouts = {}; 
fs.watch(drivePath, (eventType, filename) => {
    if (!filename || !filename.endsWith('.txt')) return;

    clearTimeout(fsTimeouts[filename]);
    fsTimeouts[filename] = setTimeout(() => {
        const filePath = `${drivePath}/${filename}`;
        
        if (fs.existsSync(filePath)) {
            const content = fs.readFileSync(filePath, 'utf8');
            const newTemp = extractTemp(content);
            const newCoords = extractCoords(content); // <-- Scan for AI hacks

            if (!spatialDirectory[filename]) {
                // NEW FILE CREATED IN WINDOWS
                spatialDirectory[filename] = { filename, temp: newTemp, x: 0, y: 5, z: -2 };
                io.emit('file-added', spatialDirectory[filename]);
                console.log(`✨ NEW FILE DETECTED: Spawning ${filename} in VR!`);
            } else {
                let hasMutated = false;

                // Did the temperature change?
                if (spatialDirectory[filename].temp !== newTemp) {
                    spatialDirectory[filename].temp = newTemp;
                    hasMutated = true;
                }

                // Did the AI (or Notepad) change the spatial coordinates?
                if (newCoords && (spatialDirectory[filename].x !== newCoords.x || spatialDirectory[filename].z !== newCoords.z)) {
                    spatialDirectory[filename].x = newCoords.x;
                    spatialDirectory[filename].z = newCoords.z;
                    hasMutated = true;
                }

                // If ANYTHING changed, force the 3D physics engine to update!
                if (hasMutated) {
                    io.emit('file-mutated', { 
                        filename: filename, 
                        temp: spatialDirectory[filename].temp,
                        x: spatialDirectory[filename].x,
                        z: spatialDirectory[filename].z
                    });
                    console.log(`📝 OVERRIDE: Reality shifted for [${filename}]`);
                }
            }
        } else {
            // FILE DELETED IN WINDOWS
            delete spatialDirectory[filename];
            io.emit('file-removed', filename);
            console.log(`🗑️ FILE DELETED: Removing ${filename} from VR!`);
        }
    }, 100); 
});

io.on('connection', (socket) => {
    console.log(`⚡ User entered the Spatial Grid: ${socket.id}`);
    socket.join(globalHexId);
    
    // Give the user the entire directory instantly upon joining
    socket.emit('initial-directory', Object.values(spatialDirectory));
    socket.to(globalHexId).emit('peer-joined', socket.id);

    socket.on('webrtc-signal', (data) => { io.to(data.target).emit('webrtc-signal', { sender: socket.id, signal: data.signal }); });

    // When a VR user throws a cube, update the actual text file metadata!
    socket.on('update-file-location', (data) => {
        const filePath = `${drivePath}/${data.filename}`;
        if (fs.existsSync(filePath)) {
            let content = fs.readFileSync(filePath, 'utf8');
            const metaTag = `\n[SPATIAL META] X: ${data.x.toFixed(2)}, Z: ${data.z.toFixed(2)}`;
            if(content.includes('[SPATIAL META]')) {
                content = content.replace(/\[SPATIAL META\].*/, metaTag.trim());
            } else {
                content += metaTag;
            }
            fs.writeFileSync(filePath, content);
            io.emit('file-creation-success', data.filename);
        }
    });

    // --- TRUE OS INTEGRATION: OPEN FILES FROM SPATIAL WEB ---
    socket.on('execute-file', (filename) => {
        const filePath = path.resolve(drivePath, filename);
        console.log(`\n🚀 EXECUTING VOXEL: Forcing Windows to open [${filename}]`);
        
        // This tells the Windows Kernel to open the file in its default OS program (Notepad)
        exec(`start "" "${filePath}"`, (error) => {
            if (error) console.error(`Execution Error: ${error}`);
        });
        
        io.emit('file-executed-ui', filename);
    });

    socket.on('disconnect', () => { console.log(`👻 User left the grid: ${socket.id}`); socket.to(globalHexId).emit('peer-left', socket.id); });
});

// --- DATABASE & MASTER ENGINE ---
app.get('/api/history', async (req, res) => {
    if (!dbOnline) return res.json([]); 
    try {
        const result = await dbClient.query('SELECT * FROM global_spatial_history ORDER BY timestamp ASC');
        res.json(result.rows);
    } catch (err) { res.status(500).send("Database error"); }
});

const dbClient = new Client({ user: 'postgres', host: 'localhost', database: 'postgres', password: 'supersecret', port: 5432 });
let dbOnline = false;
dbClient.connect().then(() => { dbOnline = true; console.log('🟢 Spatial Database Connected!'); }).catch(() => { console.log('🟡 Database Offline: Live-Only Mode.'); });

setInterval(async () => { 
    const currentTemp = parseFloat((20 + Math.random() * 5).toFixed(1));
    const hvacPayload = { did: 'did:space:hvac-8f9a', h3_index: globalHexId, state: { temp: currentTemp + 'C' }, timestamp: Date.now() };
    const hvacSignature = signData(hvacPayload, HVAC_SECRET); 
    const axonPayload = { did: 'did:space:telemetry-node', h3_index: globalHexId, state: { status: currentTemp > 24.0 ? 'COOLING_ENGAGED' : 'STANDBY' }, timestamp: Date.now() };
    const axonSignature = signData(axonPayload, AXON_SECRET);

    if (verifySignature(hvacPayload, hvacSignature, HVAC_SECRET)) {
        if (dbOnline) await dbClient.query(`INSERT INTO global_spatial_history (did, h3_index, state_data) VALUES ($1, $2, $3)`, [hvacPayload.did, hvacPayload.h3_index, hvacPayload.state]).catch(()=>{});
        io.emit('hstp-update-hvac', hvacPayload); 
    }
    if (verifySignature(axonPayload, axonSignature, AXON_SECRET)) {
        if (dbOnline) await dbClient.query(`INSERT INTO global_spatial_history (did, h3_index, state_data) VALUES ($1, $2, $3)`, [axonPayload.did, axonPayload.h3_index, axonPayload.state]).catch(()=>{});
        io.emit('hstp-update-axon', axonPayload); 
    }
}, 2000);

setInterval(() => {
    const roguePayload = { did: 'did:space:hvac-8f9a', h3_index: globalHexId, state: { temp: '999C' }, timestamp: Date.now() };
    if (!verifySignature(roguePayload, "invalid-hash", HVAC_SECRET)) io.emit('hstp-security-alert', { did: roguePayload.did, attempt: 'Spoofed Data' });
}, 7000);

server.listen(3000, () => console.log(`🚀 Edge Node running! Open http://localhost:3000`));