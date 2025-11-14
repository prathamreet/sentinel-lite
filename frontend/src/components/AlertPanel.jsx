import React, { useState } from 'react';

function AlertPanel({ alerts }) {
  const [filter, setFilter] = useState('ALL');

  const filteredAlerts = filter === 'ALL' 
    ? alerts 
    : alerts.filter(a => a.severity === filter);

  return (
    <div className="space-y-4 h-full flex flex-col">
      <div className="flex justify-between items-center flex-shrink-0">
        <h2 className="text-base font-semibold text-white uppercase tracking-wide">Security Alerts</h2>
        <div className="flex space-x-2">
          {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM'].map(level => (
            <button
              key={level}
              className={`px-3 py-1.5 rounded text-xs font-medium uppercase tracking-wide transition-colors ${
                filter === level 
                  ? 'bg-slate-700 text-white border border-slate-600' 
                  : 'bg-slate-800 text-slate-400 border border-slate-700 hover:text-slate-300'
              }`}
              onClick={() => setFilter(level)}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4 flex-1 min-h-0 overflow-y-auto">
        {filteredAlerts.length === 0 ? (
          <div className="bg-slate-800 rounded border border-slate-700 p-12 text-center">
            <div className="text-sm text-slate-500 mb-1">No alerts found</div>
            <div className="text-xs text-slate-600">System monitoring active</div>
          </div>
        ) : (
          filteredAlerts.map((alert, idx) => (
            <div key={idx} className={`bg-slate-800 rounded border-2 border-opacity-40 p-5 ${
              alert.severity === 'CRITICAL' 
                ? 'border-red-500' 
                : alert.severity === 'HIGH'
                ? 'border-orange-500'
                : 'border-blue-500'
            }`}>
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-sm font-semibold text-white">
                  {alert.type.replace(/_/g, ' ')}
                </h3>
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                  alert.severity === 'CRITICAL' 
                    ? 'bg-red-500/20 text-red-400 border border-red-500' 
                    : alert.severity === 'HIGH'
                    ? 'bg-orange-500/20 text-orange-400 border border-orange-500'
                    : 'bg-blue-500/20 text-blue-400 border border-blue-500'
                }`}>
                  {alert.severity}
                </span>
              </div>
              
              <p className="text-sm text-slate-300 mb-4">{alert.description}</p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                <div className="bg-slate-900 rounded border border-slate-700 p-3">
                  <div className="text-xs text-slate-400 mb-1 uppercase tracking-wide">Time</div>
                  <div className="text-xs text-white font-mono">{alert.timestamp}</div>
                </div>
                <div className="bg-slate-900 rounded border border-slate-700 p-3">
                  <div className="text-xs text-slate-400 mb-1 uppercase tracking-wide">Source</div>
                  <div className="text-xs text-white">{alert.source}</div>
                </div>
                {alert.ip_address && (
                  <div className="bg-slate-900 rounded border border-slate-700 p-3">
                    <div className="text-xs text-slate-400 mb-1 uppercase tracking-wide">IP Address</div>
                    <div className="text-xs text-white font-mono">{alert.ip_address}</div>
                  </div>
                )}
                {alert.username && (
                  <div className="bg-slate-900 rounded border border-slate-700 p-3">
                    <div className="text-xs text-slate-400 mb-1 uppercase tracking-wide">User</div>
                    <div className="text-xs text-white">{alert.username}</div>
                  </div>
                )}
              </div>
              
              {alert.details && (
                <div className="bg-slate-900 rounded border border-slate-700 p-3">
                  <div className="text-xs text-slate-400 mb-2 uppercase tracking-wide">Details</div>
                  <div className="text-xs text-slate-300">{alert.details}</div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default AlertPanel;
