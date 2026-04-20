# 🪐 EdgeCore: Spatial OS & HSTP Micro-Kernel

> *"Digital interfaces move from flat screens into the physical environment itself, creating persistent, real-time mirror worlds where digital data and physical reality seamlessly intersect."*

**EdgeCore** is a localized, offline micro-kernel prototype for the **Spatial Web**. It abandons the traditional 2D nested-folder hierarchy of modern computing and replaces it with a **Voxel-Based Spatial File System**. 

Powered by a simulated **Hyperspace Transaction Protocol (HSTP)**, EdgeCore bridges a WebGL 3D physics engine directly to the Windows OS Kernel. Digital objects (voxels) are hard-linked to physical text files on the host machine. Modifying the physical file updates the 3D world in real-time, and manipulating the 3D world actively rewrites the physical data on your hard drive.

---

## 🚀 Core Architecture & Features

### 1. Executable Spatial Interface (OS Integration)
EdgeCore breaks out of the browser sandbox using **Electron** and Node's `child_process`. By double-clicking a floating 3D data cube (voxel) in the spatial matrix, the Node backend executes a kernel-level command to physically open the corresponding `.txt` file on the host Windows machine in Notepad. Digital reality commands physical reality.

### 2. Bi-Directional Stateful Synchronization
EdgeCore utilizes an infinite `fs.watch` loop to monitor a localized `_SpatialDrive` directory.
* **Physical to Digital:** Editing a text file in Notepad (e.g., changing `Temp: 22C` to `Temp: 99C`) instantly mutates the physical properties and visual state of the 3D cube in the rendering engine.
* **Digital to Physical:** Grabbing a cube with your mouse, moving it through 3D space, and dropping it triggers a raycasted coordinate sync. The engine calculates the new `X/Z` coordinates and physically injects `[SPATIAL META]` data back into the raw `.txt` file on your hard drive.

### 3. The 4D Time Machine (Temporal Scrubbing)
Backed by a **PostgreSQL** database, every spatial mutation and state change is cryptographically signed and recorded. Using the built-in UI slider, users can freeze live execution and "scrub" backward through time, restoring the exact 3D spatial layout and sensor states of the matrix from previous hours or days.

### 4. Autonomous AI Daemon (The Ghost in the Machine)
The system includes a standalone AI script (`daemon.js`) that runs asynchronously from the rendering engine. It actively monitors the spatial drive for anomalies. If a file's state breaches physical limits (e.g., exceeding 50°C), the Daemon autonomously intervenes, forcefully rewrites the file's spatial coordinates, and physically teleports the overheating voxel to an isolated 3D "Quarantine Zone" (`X: 15, Z: -15`).

### 5. WebRTC P2P Mesh Networking
Prepared for the Global Edge, the architecture features built-in WebRTC signaling via `Socket.io`. When multiple instances connect, they negotiate STUN servers to establish direct Peer-to-Peer data channels, allowing multiple users to inhabit and manipulate the same spatial directory with sub-20ms latency.

---

## 🛠️ Technical Stack

* **Application Shell:** Electron.js
* **Backend / Edge Node:** Node.js, Express, Socket.io, `child_process`
* **3D Rendering & Raycasting:** Three.js (WebGL)
* **Physics Engine:** Cannon.js
* **Spatial Indexing:** Uber's H3 Hexagonal Hierarchical Spatial Index (`h3-js`)
* **Database / Time Machine:** PostgreSQL
* **Cryptography:** Node `crypto` (HMAC SHA-256 state signing)

---

## ⚙️ Installation & Setup

```bash
# ==========================================
# PREREQUISITES: Node.js (v18+) & Docker Desktop
# ==========================================

# Step 1: Clone the Repository
git clone [https://github.com/thesnmc/EdgeCore.git](https://github.com/thesnmc/EdgeCore.git)
cd EdgeCore

# Step 2: Install Dependencies
npm install

# Step 3: Start the Time Machine Database (Optional but Recommended)
# To enable 4D temporal scrubbing, spin up a local PostgreSQL container.
# (Note: EdgeCore will gracefully fallback to "Live-Only Mode" if the database is unreachable).
docker run --name spatial-db -e POSTGRES_PASSWORD=supersecret -p 5432:5432 -d postgres

# Step 4: Boot the OS
# This will launch the standalone EdgeCore Electron application. 
# A local folder named _SpatialDrive/ will be automatically generated on your machine to hold your spatial files.
npm start

# Step 5: Activate the AI Daemon (Optional)
# To run the autonomous Watcher AI, open a secondary terminal in the project root and execute:
# node daemon.js
```

---

## 🕹️ God Mode Controls (Mouse)

Once inside the Spatial Matrix, use the following controls to interact with your file system:

* **Rotate Camera:** `Left Click + Drag`
* **Pan Camera:** `Right Click + Drag`
* **Zoom:** `Scroll Wheel`
* **Relocate File:** `Left Click + Hold` on a Voxel, move mouse, and release to drop. (This physically alters the text file on your drive).
* **Execute File:** `Double-Click` a Voxel. (This forces the Windows OS to open the file).

---

## 📄 License
Copyright: (c) 2026 thesnmc

*Engineered for the Spatial Web.*
