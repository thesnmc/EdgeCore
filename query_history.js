const { Client } = require('pg');

const dbClient = new Client({
    user: 'postgres', host: 'localhost', database: 'postgres', password: 'supersecret', port: 5432,
});

async function getSpatialHistory(did) {
    await dbClient.connect();
    // This query asks the database for the last 10 "states of being" for a specific DID
    const res = await dbClient.query(
        'SELECT * FROM spatial_history WHERE did = $1 ORDER BY timestamp DESC LIMIT 10', 
        [did]
    );
    
    console.log(`--- 4D History for ${did} ---`);
    res.rows.forEach(row => {
        console.log(`[${row.timestamp.toLocaleTimeString()}] Voxel: [${row.voxel_x}, ${row.voxel_y}, ${row.voxel_z}] | State:`, row.state_data);
    });
    await dbClient.end();
}

// Check the history of our HVAC sensor
getSpatialHistory('did:space:hvac-8f9a');