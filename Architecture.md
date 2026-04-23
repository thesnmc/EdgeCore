# 🏗️ Architecture & Design Document: EdgeCore - Spatial OS
**Version:** 1.0.0 | **Date:** 2026-04-23 | **Author:** Sujay

---

## 1. Executive Summary
This document outlines the architecture for EdgeCore, a local-first, bi-directional 3D operating system. The system bridges the native Windows file system with a WebGL spatial matrix, turning standard `.txt` files and live motherboard telemetry into tangible, physics-governed 3D objects. It is designed to operate entirely locally, utilizing a multi-process architecture where an autonomous AI Daemon asynchronously governs spatial reality based on physical hardware states and data thresholds, adhering to a strict local-data sovereignty mandate.

## 2. Architectural Drivers
**What forces shaped this architecture?**

* **Primary Goals:** Bridge the gap between 2D sub-level OS data (file systems, CPU load) and 3D spatial computing in real-time, maintaining a strict 60 FPS visual environment without blocking the main execution thread.
* **Technical Constraints:** Must run entirely locally on Windows, utilizing Node.js for raw hardware access (`fs.watch`, `child_process`) without relying on external cloud APIs or closed-source tracking ecosystems.
* **Non-Functional Requirements (NFRs):** * **Security/Privacy:** Absolute local execution; data is never transmitted externally unless explicitly thrown via decentralized WebRTC channels.
  * **Reliability:** Must elegantly handle race conditions between user input, physics engine updates, and autonomous AI rewrites.
  * **Performance:** High-frequency polling of the Windows hard drive and motherboard NPU/CPU without degrading Cannon.js physics calculations.

## 3. System Architecture (The 10,000-Foot View)
The system is divided into a decoupled, three-tier architecture:

* **Presentation & Physics Layer (The Matrix):** Built with HTML5 Canvas, Three.js (WebGL rendering), and Cannon.js (rigid-body physics). It operates on a continuous animation loop, translating socket events into spatial coordinate updates and visual state changes (color/scale mutations).
* **Domain Layer (The Web/Sync Server):** A Node.js/Express and Socket.io environment (`server.js`). It acts as the traffic controller, digesting complex regex/JSON text file structures and broadcasting real-time state changes to the Presentation Layer.
* **Data/Hardware Layer (The Ghost & The OS):** * The Windows Kernel accessed via native Node modules (`os`, `child_process`).
  * The `_SpatialDrive` (The physical hard drive acting as the single-source-of-truth database).
  * The Autonomous AI Daemon (`daemon.js`), operating as a completely independent Node process that asynchronously polices the Data Layer.

## 4. Design Decisions & Trade-Offs (The "Why")

* **Decision 1: The Two-Process Architecture (Decoupling the AI from the Server)**
  * **Rationale:** The `server.js` process is dedicated to keeping the 3D physics engine and UI running at a flawless 60 FPS. If the AI regex scanning was bundled into the main server, a large hard-drive sync could block the UI thread and crash the Matrix.
  * **Trade-off:** Requires running two separate terminal instances (`npm start` and `node daemon.js`). It also introduces deliberate race conditions where the Matrix and the AI fight for file locks, which was mitigated by implementing strict `[QUARANTINED] YES` padding rules.

* **Decision 2: Using the Raw File System as the Primary Database**
  * **Rationale:** Adhering to the data sovereignty mandate. By using Windows Notepad and `.txt` files as the database, the user retains absolute, transparent ownership of their data. The OS bridges reality rather than trapping data in a proprietary SQL/NoSQL schema.
  * **Trade-off:** Hard-disk I/O operations (reads/writes) are significantly slower than in-memory RAM databases (like Redis). We mitigate this by using `setTimeout` debouncing on the `fs.watch` loop to prevent cascade crashes when multiple files are dropped simultaneously.

* **Decision 3: WebRTC for Spatial Mesh Networking**
  * **Rationale:** To allow decentralized, local-network spatial computing. Users can throw files peer-to-peer without passing through a centralized server.
  * **Trade-off:** Requires an initial connection to a public STUN server (e.g., Google's ICE servers) purely to punch through NAT firewalls before the local connection is established.

## 5. Data Flow & Lifecycle

* **Ingestion (The Hardware Bridge):** Raw motherboard telemetry (CPU/RAM load) is captured via the `os.cpus()` API. Concurrently, `fs.watch` detects user edits made natively in Windows Notepad.
* **Processing (The Race Condition):** * The Node Server sanitizes the data, extracts coordinates via Regex, and broadcasts to the WebGL client.
  * Simultaneously, the independent AI Daemon scans the raw text. If threshold limits are breached (e.g., Temp > 80C), the Daemon hijacks the processing pipeline and autonomously rewrites the file's `[SPATIAL META]` coordinates.
* **Execution/Output:** The Three.js/Cannon.js engine receives the final coordinates, picks the rigid-body voxel up on the Y-axis, and drops it into the environment, allowing gravity and friction algorithms to calculate its final resting place, which is then written back to the Windows file system.

## 6. Security & Privacy Threat Model

* **Data at Rest:** Governed entirely by Windows native folder permissions. The system intentionally avoids hidden storage or proprietary encryption, relying on transparent, localized `.txt` mapping.
* **Data in Transit:** N/A for single-player mode (air-gapped by design). In multiplayer mode, WebRTC data channels are utilized, which are inherently encrypted point-to-point via DTLS/SRTP.
* **Mitigated Risks:** Infinite loop crashes caused by recursive hard-drive writes are mitigated by the AI Daemon's strict `[QUARANTINED]` lock protocol, preventing the Daemon from hacking files that are already secured.

## 7. Future Architecture Roadmap

* **The Physical Desk Bridge:** Transitioning from mouse-drag inputs to a webcam-based Inverse Perspective Mapping (IPM) system, allowing a physical A4 sheet of paper on the user's desk to act as the hardware controller for the 3D grid.
* **Zero-Knowledge Subatomic Vault:** Integrating a local subatomic entropy API. When a user drags a file into a designated 3D "Vault" coordinate zone, the system will trigger a background encryption sequence, converting the physical file into a zero-knowledge cryptographic string on disk.
