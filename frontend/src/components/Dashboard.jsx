import React from 'react';
import ThreatChart from './ThreatChart';

function Dashboard({ stats, alerts, logs }) {
  const criticalAlerts = alerts.filter(a => a.severity === 'CRITICAL').length;
  const highAlerts = alerts.filter(a => a.severity === 'HIGH').length;
  const mediumAlerts = alerts.filter(a => a.severity === 'MEDIUM').length;

  const securityScore = Math.max(0, 100 - (criticalAlerts * 20 + highAlerts * 10 + mediumAlerts * 5));

  return (
    <div className="space-y-5 h-full flex flex-col">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 flex-shrink-0">
        {/* Total Logs */}
        <div className="bg-slate-800 rounded border border-slate-700 p-5">
          <div className="text-xs text-slate-400 mb-2 uppercase tracking-wide">Total Logs</div>
          <div className="text-2xl font-semibold text-white">
            {stats.total_logs?.toLocaleString() || logs.length.toLocaleString()}
          </div>
        </div>

        {/* Critical Alerts */}
        <div className="bg-slate-800 rounded border-l-4 border-t border-r border-b border-red-500 p-5">
          <div className="text-xs text-slate-400 mb-2 uppercase tracking-wide">Critical</div>
          <div className="text-2xl font-semibold text-red-400">{criticalAlerts}</div>
        </div>

        {/* High Severity */}
        <div className="bg-slate-800 rounded border-l-4 border-t border-r border-b border-orange-500 p-5">
          <div className="text-xs text-slate-400 mb-2 uppercase tracking-wide">High</div>
          <div className="text-2xl font-semibold text-orange-400">{highAlerts}</div>
        </div>

        {/* Medium Severity */}
        <div className="bg-slate-800 rounded border-l-4 border-t border-r border-b border-blue-500 p-5">
          <div className="text-xs text-slate-400 mb-2 uppercase tracking-wide">Medium</div>
          <div className="text-2xl font-semibold text-blue-400">{mediumAlerts}</div>
        </div>

        {/* Security Score */}
        <div className={`bg-slate-800 rounded border-l-4 border-t border-r border-b p-5 ${
          securityScore > 70 ? 'border-green-500' : securityScore > 40 ? 'border-yellow-500' : 'border-red-500'
        }`}>
          <div className="text-xs text-slate-400 mb-2 uppercase tracking-wide">Security Score</div>
          <div className={`text-2xl font-semibold ${
            securityScore > 70 ? 'text-green-400' : securityScore > 40 ? 'text-yellow-400' : 'text-red-400'
          }`}>
            {securityScore}/100
          </div>
        </div>
      </div>

      {/* Threat Chart */}
      <div className="bg-slate-800 rounded border border-slate-700 p-5 flex-shrink-0">
        <ThreatChart stats={stats} alerts={alerts} />
      </div>

      {/* Recent Alerts */}
      <div className="bg-slate-800 rounded border border-slate-700 p-5 flex-1 min-h-0 flex flex-col">
        <h2 className="text-base font-semibold text-white mb-4 uppercase tracking-wide">Recent Alerts</h2>
        
        <div className="space-y-3 overflow-y-auto flex-1">
          {alerts.length === 0 ? (
            <div className="flex items-center justify-center h-full text-slate-500">
              <div className="text-center">
                <div className="text-sm mb-1">No alerts detected</div>
                <div className="text-xs text-slate-600">System monitoring active</div>
              </div>
            </div>
          ) : (
            alerts.slice(0, 5).map((alert, idx) => (
              <div 
                key={idx} 
                className={`p-4 rounded border-l-4 ${
                  alert.severity === 'CRITICAL' 
                    ? 'bg-slate-900 border-red-500' 
                    : alert.severity === 'HIGH'
                    ? 'bg-slate-900 border-orange-500'
                    : 'bg-slate-900 border-blue-500'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm font-medium text-white">
                    {alert.type.replace(/_/g, ' ')}
                  </span>
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
                <p className="text-sm text-slate-300 mb-3">{alert.description}</p>
                <div className="flex justify-between text-xs text-slate-500">
                  <span>{alert.timestamp}</span>
                  <span className="font-mono">{alert.ip_address || 'N/A'}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
