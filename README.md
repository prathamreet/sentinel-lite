# Sentinel-LM

Sentinel-LM is a real-time log monitoring and threat detection system. It provides a web-based interface to visualize security alerts and analyze attack timelines.

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (React)                     │
│  ┌──────────┐  ┌──────────┐  ┌────────────────────┐     │
│  │Dashboard │  │  Alerts  │  │  Attack Timeline   │     │
│  └──────────┘  └──────────┘  └────────────────────┘     │
└────────────────────┬────────────────────────────────────┘
                     │ WebSocket + REST API
┌────────────────────▼────────────────────────────────────┐
│              Backend (Flask + SocketIO)                 │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐    │
│  │ Log Monitor  │→ │   Detector   │→ │  Database   │    │
│  │  (Watchdog)  │  │   (Rules)    │  │  (SQLite)   │    │
│  └──────────────┘  └──────────────┘  └─────────────┘    │
└────────────────────┬────────────────────────────────────┘
                     │ File System Watch
┌────────────────────▼────────────────────────────────────┐
│                  Log Sources                            │
│  ┌──────────┐  ┌──────────┐  ┌───────────────────┐      │
│  │auth.log  │  │apache.log│  │ windows.log       │      │
│  └──────────┘  └──────────┘  └───────────────────┘      │
└─────────────────────────────────────────────────────────┘
                     ▲
                     │ Generates (Demo Mode)
┌────────────────────┴────────────────────────────────────┐
│              Mock Server (Optional)                     │
│         Simulates real attack scenarios                 │
└─────────────────────────────────────────────────────────┘
```

## Features

*   **Real-time Log Monitoring**: Monitors log files for changes in real-time.
*   **Threat Detection**: Uses a rule-based engine to detect suspicious activities.
*   **Web-based UI**: Provides a dashboard to view alerts and an attack timeline.
*   **Extensible**: Easily extendable with new log parsers and detection rules.
*   **Mock Log Server**: Includes a mock server to simulate log data for demonstration purposes.

## Getting Started

### Prerequisites

*   Node.js and npm
*   Python 3 and pip

### Installation and Running

**1. Frontend (Terminal 1)**

```bash
cd frontend
npm install
npm start
```

**2. Backend (Terminal 2)**

```bash
cd backend
pip install -r requirements.txt
python app.py
```

**3. Live Mock Logs (Terminal 3, Optional)**

To simulate live log data for demonstration, you can use the mock log server.

```bash
cd log
python mock-log-server.py demo
```

## Components

### Frontend

The frontend is a React application that provides a user interface for Sentinel-LM. It communicates with the backend using WebSockets and a REST API.

*   **Dashboard**: Displays a summary of security events.
*   **Alerts**: Shows a list of detected threats.
*   **Attack Timeline**: Visualizes the sequence of an attack.

### Backend

The backend is a Flask application that forms the core of Sentinel-LM.

*   **Log Monitor**: Watches the file system for log file changes.
*   **Parser**: Parses new log entries.
*   **Detector**: Analyzes log data against a set of rules to identify threats.
*   **Database**: Stores alerts and other relevant data in a SQLite database.

### Log Sources

Sentinel-LM can monitor various log files, such as `auth.log`, `apache.log`, etc.

### Mock Server

The mock server is a Python script that generates sample log data to demonstrate the functionality of Sentinel-LM.
