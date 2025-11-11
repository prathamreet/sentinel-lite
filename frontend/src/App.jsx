import React, { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import Dashboard from './components/Dashboard';
import AlertPanel from './components/AlertPanel';
import LogTable from './components/LogTable';
import AttackTimeline from './components/AttackTimeline';
import './App.css';

const API_URL = 'http://localhost:5000';
const socket = io(API_URL);

function App() {
  const [logs, setLogs] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [stats, setStats] = useState({
    total_logs: 0,
    total_alerts: 0,
    alerts_by_severity: { CRITICAL: 0, HIGH: 0, MEDIUM: 0 },
    by_severity: { CRITICAL: 0, HIGH: 0, MEDIUM: 0 },
    by_type: {}
  });
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [connectionStatus, setConnectionStatus] = useState('connecting');

  // WebSocket listeners
  useEffect(() => {
    socket.on('connect', () => {
      console.log('✅ Connected to live server');
      setConnectionStatus('connected');
    });

    socket.on('disconnect', () => {
      console.log('❌ Disconnected from server');
      setConnectionStatus('disconnected');
    });

    socket.on('new_alerts', (data) => {
      console.log('🚨 New alerts received:', data);
      
      // Add new alerts to existing ones
      setAlerts(prev => {
        const combined = [...data.alerts, ...prev];
        return combined.slice(0, 100); // Keep last 100
      });
      
      // Update stats - CRITICAL FIX
      setStats(prevStats => {
        const newStats = { ...prevStats };
        
        // Update alert counts by severity
        data.alerts.forEach(alert => {
          const severity = alert.severity;
          if (newStats.alerts_by_severity) {
            newStats.alerts_by_severity[severity] = (newStats.alerts_by_severity[severity] || 0) + 1;
          }
          if (newStats.by_severity) {
            newStats.by_severity[severity] = (newStats.by_severity[severity] || 0) + 1;
          }
          
          // Update type counts
          if (newStats.by_type) {
            newStats.by_type[alert.type] = (newStats.by_type[alert.type] || 0) + 1;
          }
        });
        
        // Update total alerts
        newStats.total_alerts = (newStats.total_alerts || 0) + data.alerts.length;
        
        return newStats;
      });
      
      // Show notification for critical alerts
      const critical = data.alerts.filter(a => a.severity === 'CRITICAL');
      if (critical.length > 0) {
        showNotification(`🚨 ${critical.length} CRITICAL ALERT(S) DETECTED!`);
      }
    });

    socket.on('new_logs', (data) => {
      console.log('📊 New logs received:', data.count);
      
      setLogs(prev => {
        const combined = [...data.logs, ...prev];
        return combined.slice(0, 1000); // Keep last 1000
      });
      
      // Update log count
      setStats(prevStats => ({
        ...prevStats,
        total_logs: (prevStats.total_logs || 0) + data.logs.length
      }));
    });

    socket.on('stats_update', (data) => {
      console.log('📈 Stats update received:', data);
      
      // Merge with existing stats to ensure all fields are present
      setStats(prevStats => ({
        ...prevStats,
        ...data,
        // Ensure by_severity exists for charts
        by_severity: data.alerts_by_severity || data.by_severity || prevStats.by_severity || {},
        by_type: data.by_type || prevStats.by_type || {}
      }));
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('new_alerts');
      socket.off('new_logs');
      socket.off('stats_update');
    };
  }, []);

  const showNotification = (message) => {
    if (window.Notification && Notification.permission === 'granted') {
      new Notification('LogWatch Sentinel', { body: message });
    }
  };

  const requestNotificationPermission = () => {
    if (window.Notification && Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  };

  useEffect(() => {
    requestNotificationPermission();
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      const [logsRes, analysisRes, timelineRes] = await Promise.all([
        axios.get(`${API_URL}/logs?limit=100`),
        axios.get(`${API_URL}/analyze`),
        axios.get(`${API_URL}/timeline`)
      ]);

      setLogs(logsRes.data || []);
      setAlerts(analysisRes.data.alerts || []);
      
      // Properly structure stats
      const statsData = analysisRes.data.stats || {};
      setStats({
        total_logs: analysisRes.data.total_logs || 0,
        total_alerts: (analysisRes.data.alerts || []).length,
        alerts_by_severity: statsData.by_severity || { CRITICAL: 0, HIGH: 0, MEDIUM: 0 },
        by_severity: statsData.by_severity || { CRITICAL: 0, HIGH: 0, MEDIUM: 0 },
        by_type: statsData.by_type || {},
        critical_count: statsData.critical_count || 0,
        high_count: statsData.high_count || 0,
        medium_count: statsData.medium_count || 0
      });
      
      setTimeline(timelineRes.data || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    loadInitialData();
  };

  const handleClearData = async () => {
    if (window.confirm('Are you sure you want to clear all data?')) {
      try {
        await axios.post(`${API_URL}/clear`);
        setLogs([]);
        setAlerts([]);
        setStats({
          total_logs: 0,
          total_alerts: 0,
          alerts_by_severity: { CRITICAL: 0, HIGH: 0, MEDIUM: 0 },
          by_severity: { CRITICAL: 0, HIGH: 0, MEDIUM: 0 },
          by_type: {}
        });
        setTimeline([]);
        alert('✅ All data cleared');
      } catch (error) {
        alert('❌ Error clearing data');
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
      alert('❌ Error generating report');
    }
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-left">
          <h1>🛡️ LogWatch Sentinel</h1>
          <span className="version">v1.0.0 | LIVE MODE</span>
          <span className={`status-badge ${connectionStatus}`}>
            {connectionStatus === 'connected' ? '🟢 LIVE' : '🔴 OFFLINE'}
          </span>
        </div>
        <div className="header-right">
          <button onClick={handleRefresh} className="btn btn-secondary">
            🔄 Refresh
          </button>
          <button onClick={downloadReport} className="btn btn-success">
            📄 Export Report
          </button>
          <button onClick={handleClearData} className="btn btn-danger">
            🗑️ Clear Data
          </button>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="tabs">
        <button
          className={activeTab === 'dashboard' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('dashboard')}
        >
          📊 Dashboard
        </button>
        <button
          className={activeTab === 'alerts' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('alerts')}
        >
          🚨 Alerts ({alerts.length})
          {alerts.filter(a => a.severity === 'CRITICAL').length > 0 && (
            <span className="alert-badge">
              {alerts.filter(a => a.severity === 'CRITICAL').length}
            </span>
          )}
        </button>
        <button
          className={activeTab === 'timeline' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('timeline')}
        >
          ⏱️ Attack Timeline
        </button>
        <button
          className={activeTab === 'logs' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('logs')}
        >
          📋 Live Logs ({logs.length})
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