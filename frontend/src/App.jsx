import React, { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import Dashboard from './components/Dashboard';
import AlertPanel from './components/AlertPanel';
import LogTable from './components/LogTable';
import AttackTimeline from './components/AttackTimeline';

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
  const [activeTab, setActiveTab] = useState('overview');
  const [connectionStatus, setConnectionStatus] = useState('connecting');

  // WebSocket listeners
  useEffect(() => {
    socket.on('connect', () => {
      console.log(' Connected to live server');
      setConnectionStatus('connected');
    });

    socket.on('disconnect', () => {
      console.log(' Disconnected from server');
      setConnectionStatus('disconnected');
    });

    socket.on('new_alerts', (data) => {
      console.log(' New alerts received:', data);
      
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
      console.log('New logs received:', data.count);
      
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
      console.log(' Stats update received:', data);
      
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
        alert(' All data cleared');
      } catch (error) {
        alert(' Error clearing data');
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
      alert(' Error generating report');
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-slate-900 to-slate-800 overflow-hidden flex flex-col">
      {/* Header */}
      <header className="bg-slate-800 px-8 py-4 flex justify-between items-center border-b border-slate-600">
        <div className="flex items-center space-x-6">
          <h1 className="text-2xl font-bold text-white">LogWatch Sentinel</h1>
          <span className="text-sm text-slate-400 font-medium">v1.0.0</span>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${
              connectionStatus === 'connected' 
                ? 'bg-green-500' 
                : connectionStatus === 'connecting'
                ? 'bg-yellow-500'
                : 'bg-red-500'
            }`}></div>
            <span className="text-sm text-slate-300 font-medium">
              {connectionStatus === 'connected' ? 'LIVE' : connectionStatus === 'connecting' ? 'CONNECTING' : 'OFFLINE'}
            </span>
          </div>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={handleRefresh} 
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded font-medium transition-colors duration-200"
          >
            Refresh
          </button>
          <button 
            onClick={downloadReport} 
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium transition-colors duration-200"
          >
            Export Report
          </button>
          <button 
            onClick={handleClearData} 
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-medium transition-colors duration-200"
          >
            Clear Data
          </button>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-slate-800 px-8 flex space-x-1 border-b border-slate-600 flex-shrink-0">
        <button
          className={`px-6 py-3 font-medium transition-all duration-200 border-b-2 ${
            activeTab === 'overview' 
              ? 'text-white border-blue-500 bg-slate-700' 
              : 'text-slate-400 border-transparent hover:text-slate-200 hover:bg-slate-700'
          }`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={`px-6 py-3 font-medium transition-all duration-200 border-b-2 relative ${
            activeTab === 'security' 
              ? 'text-white border-blue-500 bg-slate-700' 
              : 'text-slate-400 border-transparent hover:text-slate-200 hover:bg-slate-700'
          }`}
          onClick={() => setActiveTab('security')}
        >
          Security Analysis
          {alerts.filter(a => a.severity === 'CRITICAL').length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              {alerts.filter(a => a.severity === 'CRITICAL').length}
            </span>
          )}
        </button>
      </nav>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        {loading && (
          <div className="flex justify-center items-center h-full">
            <div className="text-xl text-slate-400">Loading...</div>
          </div>
        )}
        {!loading && activeTab === 'overview' && (
          <div className="h-full flex">
            {/* Dashboard Section */}
            <div className="w-1/2 p-6 border-r border-slate-600 overflow-y-auto">
              <Dashboard stats={stats} alerts={alerts} logs={logs} />
            </div>
            {/* Live Logs Section */}
            <div className="w-1/2 p-6 overflow-y-auto">
              <LogTable logs={logs} />
            </div>
          </div>
        )}
        {!loading && activeTab === 'security' && (
          <div className="h-full flex">
            {/* Alerts Section */}
            <div className="w-1/2 p-6 border-r border-slate-600 overflow-y-auto">
              <AlertPanel alerts={alerts} />
            </div>
            {/* Attack Timeline Section */}
            <div className="w-1/2 p-6 overflow-y-auto">
              <AttackTimeline timeline={timeline} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;