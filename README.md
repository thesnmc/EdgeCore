# 🚀 EdgeCore - Spatial OS
> A local-first, bi-directional 3D operating system that turns physical hard drive files into tangible objects governed by physics and an autonomous AI daemon.

[![License](https://img.shields.io/badge/License-TheSNMC-blue.svg)](LICENSE)
[![Platform](https://img.shields.io/badge/Platform-Windows%20%7C%20Node.js-lightgrey)]()
[![Architecture](https://img.shields.io/badge/Architecture-Local--First-success)]()

---

## 📖 Overview
EdgeCore completely reimagines the desktop interface. Instead of interacting with 2D icons on a flat screen, this OS bridges your native Windows file system with a 3D WebGL physics matrix. When a file is created on your hard drive, it physically drops from the sky into your spatial grid. When you move the file in 3D space, its coordinates are instantly written back into the metadata of the literal `.txt` file on your disk.

Beyond just a spatial file explorer, the OS is alive. It runs an independent, asynchronous AI Daemon (The "Ghost") that constantly monitors the health and data states of your files. If a file overheats or reaches a critical data state, the AI autonomously hacks the file system, rewrites its coordinates, and violently quarantines the physical cube in the 3D environment. 

**The Core Mandate:** The operating system should not be a passive window; it should be an active, physical environment. Absolute data sovereignty is achieved by keeping all processing, physics, and telemetry strictly local, bridging the gap between sub-level OS hardware and high-level 3D spatial computing.

## ✨ Key Features
* **Bi-Directional File Execution:** Double-clicking a 3D cube uses Node.js `child_process` to physically execute and open the file in the native Windows OS (e.g., Notepad). Editing the file in Notepad instantly mutates the 3D cube in the Matrix.
* **Autonomous AI Daemon:** A background Watcher script continuously scans the spatial drive. It reads complex JSON/Regex data states and autonomously relocates or quarantines files that exceed safe operational thresholds.
* **Live Hardware Telemetry:** The environment actively breathes with your hardware. The OS reads physical motherboard data (CPU/RAM load) and dynamically alters the size, color, and physics of the `SYSTEM_CORE` voxel in real-time.
* **Cannon.js Physics Engine:** Files have physical mass. They obey gravity, collide with one another in mid-air, and bounce across the grid when dropped or relocated by the AI.
* **WebRTC P2P Spatial Mesh:** Fully decentralized, local-network file throwing. Multiple instances can connect via WebRTC, allowing users to physically toss files across the spatial room to transfer data peer-to-peer.
* **4D Timeline Scrubbing:** (Optional via PostgreSQL) The system records every spatial mutation, allowing the user to scrub backward in time and view the exact physical layout of the file system at any given moment.

## 🛠️ Tech Stack
* **Language:** JavaScript / Node.js
* **Frontend Framework:** HTML5 Canvas, Three.js (WebGL), Cannon.js (Physics Engine)
* **Backend Environment:** Node.js, Express.js, Socket.io
* **Key Libraries/APIs:** WebRTC (Peer-to-Peer), Native OS modules (`fs.watch`, `child_process`, `os`), H3 Hexagonal Grid System.

## ⚙️ Architecture & Data Flow
The system operates on a "Tyrant Matrix vs. Ghost Daemon" race-condition architecture:

* **Input:** The Node server (`server.js`) utilizes `fs.watch` to monitor the `_SpatialDrive` directory for user inputs. Simultaneously, it polls the native `os.cpus()` for motherboard telemetry.
* **Processing:** Two separate entities process the data. The Matrix Engine handles immediate visual and physics calculations, while the independent AI Daemon asynchronously parses file contents for danger thresholds (e.g., `Temp: 99C`).
* **Output:** If the Daemon detects a threshold breach, it overwrites the file's `[SPATIAL META]` tags. The Matrix reads this forced injection, updates the Cannon.js physics body, and drops the 3D voxel into the quarantine zone via Socket.io.

## 🔒 Privacy & Data Sovereignty
* **Data Collection:** Absolute zero. All data parsing, AI logic, and file manipulation occurs entirely on-device within the local Node runtime.
* **Permissions Required:** Local Read/Write access to the `_SpatialDrive` directory to allow for bi-directional file synchronization.
* **Cloud Connectivity:** Completely disabled by default. The WebRTC implementation utilizes Google's public STUN server purely for initial handshaking, after which all P2P file transfers are routed locally.

## 🚀 Getting Started

### Prerequisites
* Node.js (v16.0 or higher)
* NPM (Node Package Manager)
* PostgreSQL (Only required if enabling the 4D Timeline Database feature)

### Installation

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/yourusername/edgecore.git](https://github.com/yourusername/edgecore.git)
   ```

2. **Open the project in your IDE and install the core dependencies:**
   ```bash
   npm install
   ```

3. **Boot the Autonomous AI Daemon in your first terminal:**
   ```bash
   node daemon.js
   ```

4. **Boot the 3D Matrix Engine in a second terminal:**
   ```bash
   npm start
   ```

5. Open your browser or the Electron wrapper to `http://localhost:3000` to enter the spatial grid. Create a `.txt` file in the `_SpatialDrive` folder to watch the physics engine react!

## 🤝 Contributing
Contributions, issues, and feature requests are welcome. Because this involves heavy file-system manipulation, please thoroughly test Cannon.js collisions before submitting pull requests. Feel free to check the issues page if you want to contribute.

## 📄 License
See the LICENSE file for details.  
Built by an independent developer in Chennai, India.
