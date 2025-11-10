import React, { useState } from 'react';
import './AlertPanel.css';

function AlertPanel({ alerts }) {
  const [filter, setFilter] = useState('ALL');

  const filteredAlerts = filter === 'ALL' 
    ? alerts 
    : alerts.filter(a => a.severity === filter);

  return (
    <div className="alert-panel">
      <div className="alert-header">
        <h2> Security Alerts</h2>
        <div className="filter-buttons">
          {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM'].map(level => (
            <button
              key={level}
              className={`filter-btn ${filter === level ? 'active' : ''}`}
              onClick={() => setFilter(level)}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      <div className="alerts-container">
        {filteredAlerts.length === 0 ? (
          <div className="empty-state">
            <h3>No alerts found</h3>
            <p>Your system looks secure!</p>
          </div>
        ) : (
          filteredAlerts.map((alert, idx) => (
            <div key={idx} className={`alert-card ${alert.severity.toLowerCase()}`}>
              <div className="alert-card-header">
                <h3>{alert.type.replace(/_/g, ' ').toUpperCase()}</h3>
                <span className={`severity-badge ${alert.severity.toLowerCase()}`}>
                  {alert.severity}
                </span>
              </div>
              <p className="alert-desc">{alert.description}</p>
              <div className="alert-details">
                <div><strong>Time:</strong> {alert.timestamp}</div>
                <div><strong>Source:</strong> {alert.source}</div>
                {alert.ip_address && <div><strong>IP:</strong> {alert.ip_address}</div>}
                {alert.username && <div><strong>User:</strong> {alert.username}</div>}
              </div>
              <div className="alert-message">
                <strong>Details:</strong> {alert.details}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default AlertPanel;