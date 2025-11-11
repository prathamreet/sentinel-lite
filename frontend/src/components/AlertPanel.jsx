import React, { useState } from 'react';

function AlertPanel({ alerts }) {
  const [filter, setFilter] = useState('ALL');

  const filteredAlerts = filter === 'ALL' 
    ? alerts 
    : alerts.filter(a => a.severity === filter);

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex justify-between items-center flex-shrink-0">
        <h2 className="text-2xl font-bold text-white">Security Alerts</h2>
        <div className="flex space-x-2">
          {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM'].map(level => (
            <button
              key={level}
              className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                filter === level 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-white'
              }`}
              onClick={() => setFilter(level)}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 flex-1 min-h-0 overflow-y-auto">
        {filteredAlerts.length === 0 ? (
          <div className="bg-slate-800 rounded-xl p-8 text-center border border-slate-600">
            <div className="text-slate-500 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-slate-300 mb-2">No alerts found</h3>
            <p className="text-slate-400">System monitoring active</p>
          </div>
        ) : (
          filteredAlerts.map((alert, idx) => (
            <div key={idx} className={`bg-slate-800 rounded-xl p-6 border-l-4 border ${
              alert.severity === 'CRITICAL' 
                ? 'border-red-500 bg-red-900/10' 
                : alert.severity === 'HIGH'
                ? 'border-orange-500 bg-orange-900/10'
                : 'border-blue-500 bg-blue-900/10'
            } hover:shadow-xl transition-all duration-200`}>
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-white">
                  {alert.type.replace(/_/g, ' ').toUpperCase()}
                </h3>
                <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                  alert.severity === 'CRITICAL' 
                    ? 'bg-red-500 text-white' 
                    : alert.severity === 'HIGH'
                    ? 'bg-orange-500 text-white'
                    : 'bg-blue-500 text-white'
                }`}>
                  {alert.severity}
                </span>
              </div>
              
              <p className="text-slate-300 text-lg mb-6">{alert.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div className="bg-slate-700 rounded-lg p-3">
                  <div className="text-slate-400 text-sm font-medium">Time</div>
                  <div className="text-white font-semibold">{alert.timestamp}</div>
                </div>
                <div className="bg-slate-700 rounded-lg p-3">
                  <div className="text-slate-400 text-sm font-medium">Source</div>
                  <div className="text-white font-semibold">{alert.source}</div>
                </div>
                {alert.ip_address && (
                  <div className="bg-slate-700 rounded-lg p-3">
                    <div className="text-slate-400 text-sm font-medium">IP Address</div>
                    <div className="text-white font-semibold">{alert.ip_address}</div>
                  </div>
                )}
                {alert.username && (
                  <div className="bg-slate-700 rounded-lg p-3">
                    <div className="text-slate-400 text-sm font-medium">User</div>
                    <div className="text-white font-semibold">{alert.username}</div>
                  </div>
                )}
              </div>
              
              {alert.details && (
                <div className="bg-slate-700 rounded-lg p-4">
                  <div className="text-slate-400 text-sm font-medium mb-2">Details</div>
                  <div className="text-slate-200">{alert.details}</div>
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