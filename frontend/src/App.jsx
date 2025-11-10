import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Dashboard from './components/Dashboard';
import AlertPanel from './components/AlertPanel';
import LogTable from './components/LogTable';
import ThreatChart from './components/ThreatChart';
import AttackTimeline from './components/AttackTimeline';
import './App.css';

const API_URL = 'http://localhost:5000';

function App() {
  const [logs, setLogs] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [stats, setStats] = useState({});
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      await axios.post(`${API_URL}/upload`, formData);
      await analyzeData();
<<<<<<< HEAD
      alert(' Logs uploaded and analyzed successfully!');
    } catch (error) {
      alert(' Error uploading file: ' + error.message);
=======
      alert('Logs uploaded and analyzed successfully!');
    } catch (error) {
      alert('Error uploading file: ' + error.message);
>>>>>>> 85abb9c0ff3d02ed7d644169f9181eb73d556fcc
    } finally {
      setLoading(false);
    }
  };

  const analyzeData = async () => {
    setLoading(true);
    try {
      const [logsRes, analysisRes, timelineRes] = await Promise.all([
        axios.get(`${API_URL}/logs?limit=100`),
        axios.get(`${API_URL}/analyze`),
        axios.get(`${API_URL}/timeline`)
      ]);

      setLogs(logsRes.data);
      setAlerts(analysisRes.data.alerts || []);
      setStats(analysisRes.data.stats || {});
      setTimeline(timelineRes.data || []);
    } catch (error) {
      console.error('Error analyzing data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClearData = async () => {
    if (window.confirm('Are you sure you want to clear all data?')) {
      try {
        await axios.post(`${API_URL}/clear`);
        setLogs([]);
        setAlerts([]);
        setStats({});
        setTimeline([]);
<<<<<<< HEAD
        alert(' All data cleared');
      } catch (error) {
        alert(' Error clearing data');
=======
        alert('All data cleared');
      } catch (error) {
        alert('Error clearing data');
>>>>>>> 85abb9c0ff3d02ed7d644169f9181eb73d556fcc
      }
    }
  };

  const downloadReport = async () => {
    try {
      const response = await axios.get(`${API_URL}/report`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `LogWatch_Report_${Date.now()}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
<<<<<<< HEAD
      alert(' Error generating report');
=======
      alert('Error generating report');
>>>>>>> 85abb9c0ff3d02ed7d644169f9181eb73d556fcc
    }
  };

  useEffect(() => {
    // Check backend connection
    axios.get(`${API_URL}/health`)
<<<<<<< HEAD
      .then(() => console.log('✅ Backend connected'))
      .catch(() => alert(' Backend not running! Start Python server first.'));
=======
      .then(() => console.log('Backend connected'))
      .catch(() => alert('Backend not running! Start Python server first.'));
>>>>>>> 85abb9c0ff3d02ed7d644169f9181eb73d556fcc
  }, []);

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-left">
<<<<<<< HEAD
          <h1>🛡️ LogWatch Sentinel</h1>
=======
          <h1>LogWatch Sentinel</h1>
          <span className="version">v1.0.0 | Offline Mode</span>
>>>>>>> 85abb9c0ff3d02ed7d644169f9181eb73d556fcc
        </div>
        <div className="header-right">
          <input
            type="file"
            id="file-upload"
            accept=".log,.txt"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
          />
          <label htmlFor="file-upload" className="btn btn-primary">
<<<<<<< HEAD
             Upload Logs
=======
            Upload Logs
>>>>>>> 85abb9c0ff3d02ed7d644169f9181eb73d556fcc
          </label>
          <button onClick={analyzeData} className="btn btn-secondary" disabled={loading}>
            {loading ? ' Analyzing...' : ' Analyze'}
          </button>
          <button onClick={downloadReport} className="btn btn-success">
<<<<<<< HEAD
             Export Report
          </button>
          <button onClick={handleClearData} className="btn btn-danger">
             Clear Data
=======
            Export Report
          </button>
          <button onClick={handleClearData} className="btn btn-danger">
            Clear Data
>>>>>>> 85abb9c0ff3d02ed7d644169f9181eb73d556fcc
          </button>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="tabs">
        <button
          className={activeTab === 'dashboard' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('dashboard')}
        >
<<<<<<< HEAD
           Dashboard
=======
          Dashboard
>>>>>>> 85abb9c0ff3d02ed7d644169f9181eb73d556fcc
        </button>
        <button
          className={activeTab === 'alerts' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('alerts')}
        >
<<<<<<< HEAD
           Alerts ({alerts.length})
=======
          Alerts ({alerts.length})
>>>>>>> 85abb9c0ff3d02ed7d644169f9181eb73d556fcc
        </button>
        <button
          className={activeTab === 'timeline' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('timeline')}
        >
<<<<<<< HEAD
           Attack Timeline
=======
          ⏱Attack Timeline
>>>>>>> 85abb9c0ff3d02ed7d644169f9181eb73d556fcc
        </button>
        <button
          className={activeTab === 'logs' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('logs')}
        >
<<<<<<< HEAD
           Raw Logs
=======
          Raw Logs
>>>>>>> 85abb9c0ff3d02ed7d644169f9181eb73d556fcc
        </button>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        {activeTab === 'dashboard' && (
          <Dashboard stats={stats} alerts={alerts} logs={logs} />
        )}
        {activeTab === 'alerts' && (
          <AlertPanel alerts={alerts} />
        )}
        {activeTab === 'timeline' && (
          <AttackTimeline timeline={timeline} />
        )}
        {activeTab === 'logs' && (
          <LogTable logs={logs} />
        )}
      </main>
    </div>
  );
}

export default App;