import React from 'react';
import ThreatChart from './ThreatChart';
import './Dashboard.css';

function Dashboard({ stats, alerts, logs }) {
  const criticalAlerts = alerts.filter(a => a.severity === 'CRITICAL').length;
  const highAlerts = alerts.filter(a => a.severity === 'HIGH').length;
  const mediumAlerts = alerts.filter(a => a.severity === 'MEDIUM').length;

  const securityScore = Math.max(0, 100 - (criticalAlerts * 20 + highAlerts * 10 + mediumAlerts * 5));

  return (
    <div className="dashboard">
      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-info">
            <h3>Total Logs</h3>
            <p className="stat-value">{logs.length.toLocaleString()}</p>
          </div>
        </div>

        <div className="stat-card critical">
          <div className="stat-icon">🚨</div>
          <div className="stat-info">
            <h3>Critical Alerts</h3>
            <p className="stat-value">{criticalAlerts}</p>
          </div>
        </div>

        <div className="stat-card high">
          <div className="stat-icon">⚠️</div>
          <div className="stat-info">
            <h3>High Severity</h3>
            <p className="stat-value">{highAlerts}</p>
          </div>
        </div>

        <div className="stat-card medium">
          <div className="stat-icon">ℹ️</div>
          <div className="stat-info">
            <h3>Medium Severity</h3>
            <p className="stat-value">{mediumAlerts}</p>
          </div>
        </div>

        <div className={`stat-card security-score ${securityScore > 70 ? 'good' : securityScore > 40 ? 'warning' : 'danger'}`}>
          <div className="stat-icon">🛡️</div>
          <div className="stat-info">
            <h3>Security Score</h3>
            <p className="stat-value">{securityScore}/100</p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="charts-grid">
        <ThreatChart stats={stats} alerts={alerts} />
      </div>

      {/* Recent Alerts */}
      <div className="recent-alerts">
        <h2>Recent Critical Alerts</h2>
        {alerts.slice(0, 5).map((alert, idx) => (
          <div key={idx} className={`alert-item ${alert.severity.toLowerCase()}`}>
            <div className="alert-header">
              <span className="alert-type">{alert.type.replace(/_/g, ' ').toUpperCase()}</span>
              <span className="alert-severity">{alert.severity}</span>
            </div>
            <p className="alert-description">{alert.description}</p>
            <div className="alert-footer">
              <span>{alert.timestamp}</span>
              <span>{alert.ip_address || 'N/A'}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;