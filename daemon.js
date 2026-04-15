const fs = require('fs');
const path = require('path');

const drivePath = './_SpatialDrive';

const QUARANTINE_X = 0.00;
const QUARANTINE_Z = 5.00;

console.log("👻 AI Daemon 'Watcher' initialized in DEBUG MODE.");
console.log("👁️ Scanning the Spatial Matrix...\n");

function extractTemp(content) {
    // 1. Try to read the new JSON format: "temp":"100C"
    const jsonMatch = content.match(/"temp"\s*:\s*"([\d.]+)C?"/i);
    
    // 2. Try to read the old Plain Text format: Temp: 100C
    const standardMatch = content.match(/Temp:\s*([\d.]+)C?/i);
    
    if (jsonMatch && jsonMatch[1]) {
        return parseFloat(jsonMatch[1]);
    } else if (standardMatch && standardMatch[1]) {
        return parseFloat(standardMatch[1]);
    }
    
    return 22.0; // The default if it can't read anything
}

setInterval(() => {
    if (!fs.existsSync(drivePath)) return;

    const files = fs.readdirSync(drivePath);
    files.forEach(filename => {
        if (!filename.endsWith('.txt')) return;

        const filePath = path.join(drivePath, filename);
        let content = fs.readFileSync(filePath, 'utf8');
        
        const temp = extractTemp(content);
        
        // Only log files that are actually hot to reduce spam
        // Only log files that are actually hot to reduce spam
        if (temp >= 50) {
            console.log(`\n🔎 [INVESTIGATION] ${filename} is hot (${temp}C).`);
            
            // Print the EXACT location on your hard drive the AI is reading from
            console.log(`📂 PATH: ${path.resolve(filePath)}`);
            
            // Print exactly what the AI sees inside the file
            console.log(`📄 RAW FILE CONTENT SEEN BY AI: \n${content}\n--------------------`);
            
            const hasTag = content.includes('[QUARANTINED]');
            if (hasTag) {
                console.log(`🚫 AI BLOCKED: The tag is right there in the text above!`);
            } else {
                console.log(`✅ NO LOCK FOUND! THE AI IS EXECUTING THE HACK NOW!`);
                // ... (rest of your hack code stays the same)
                
                // --- THE HACK ---
                const metaTag = `\n[SPATIAL META] X: ${QUARANTINE_X.toFixed(2)}, Z: ${QUARANTINE_Z.toFixed(2)}\n[QUARANTINED] YES`;
                
                if (content.includes('[SPATIAL META]')) {
                    content = content.replace(/\[SPATIAL META\].*/s, metaTag.trim());
                } else {
                    content += metaTag;
                }

                fs.writeFileSync(filePath, content);
                console.log(`🚨 WATCHER ACTIVATED: Cube banished to Quarantine Zone.`);
            }
        }
    });
}, 3000);