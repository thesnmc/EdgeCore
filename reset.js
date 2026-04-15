const fs = require('fs');
const path = require('path');
const drivePath = './_SpatialDrive';

console.log("🧹 INITIATING AMNESIA PROTOCOL...");

const files = fs.readdirSync(drivePath);
let scrubCount = 0;

files.forEach(filename => {
    if (!filename.endsWith('.txt')) return;
    const filePath = path.join(drivePath, filename);
    let content = fs.readFileSync(filePath, 'utf8');
    
    if (content.includes('[QUARANTINED] YES')) {
        // Strip the lock off the file
        content = content.replace('[QUARANTINED] YES', '');
        fs.writeFileSync(filePath, content.trim());
        console.log(`✅ Unlocked: ${filename}`);
        scrubCount++;
    }
});

console.log(`\n💥 Matrix Reset Complete. ${scrubCount} files unlocked!`);