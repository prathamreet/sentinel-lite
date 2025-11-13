import React from 'react';
import ThreatChart from './ThreatChart';

function Dashboard({ stats, alerts, logs }) {
  const criticalAlerts = alerts.filter(a => a.severity === 'CRITICAL').length;
  const highAlerts = alerts.filter(a => a.severity === 'HIGH').length;
  const mediumAlerts = alerts.filter(a => a.severity === 'MEDIUM').length;

  const securityScore = Math.max(0, 100 - (criticalAlerts * 20 + highAlerts * 10 + mediumAlerts * 5));

  return (
    <div className="space-y-6 h-full flex flex-col">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 flex-shrink-0">
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-600 hover:border-slate-500 transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-slate-400 text-sm font-medium">Total Logs</h3>
              <p className="text-3xl font-bold text-white mt-2">{stats.total_logs?.toLocaleString() || logs.length.toLocaleString()}</p>
            </div>
            <div className="text-slate-500">
              {/* <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg> */}
            </div>
          </div>
        </div>

        <div className="bg-slate-800 rounded-xl p-6 border border-red-500 hover:border-red-400 transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-slate-400 text-sm font-medium">Critical Alerts</h3>
              <p className="text-3xl font-bold text-red-400 mt-2">{criticalAlerts}</p>
            </div>
            <div className="text-red-500">
              {/* <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg> */}
            </div>
          </div>
        </div>

        <div className="bg-slate-800 rounded-xl p-6 border border-orange-500 hover:border-orange-400 transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-slate-400 text-sm font-medium">High Severity</h3>
              <p className="text-3xl font-bold text-orange-400 mt-2">{highAlerts}</p>
            </div>
            <div className="text-orange-500">
              {/* <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg> */}
            </div>
          </div>
        </div>

        <div className="bg-slate-800 rounded-xl p-6 border border-blue-500 hover:border-blue-400 transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-slate-400 text-sm font-medium">Medium Severity</h3>
              <p className="text-3xl font-bold text-blue-400 mt-2">{mediumAlerts}</p>
            </div>
            <div className="text-blue-500">
              {/* <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg> */}
            </div>
          </div>
        </div>

        <div className={`bg-slate-800 rounded-xl p-6 border transition-all duration-200 ${
          securityScore > 70 
            ? 'border-green-500 hover:border-green-400' 
            : securityScore > 40 
            ? 'border-yellow-500 hover:border-yellow-400' 
            : 'border-red-500 hover:border-red-400'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-slate-400 text-sm font-medium">Security Score</h3>
              <p className={`text-3xl font-bold mt-2 ${
                securityScore > 70 ? 'text-green-400' : securityScore > 40 ? 'text-yellow-400' : 'text-red-400'
              }`}>
                {securityScore}/100
              </p>
            </div>
            <div className={`${
              securityScore > 70 ? 'text-green-500' : securityScore > 40 ? 'text-yellow-500' : 'text-red-500'
            }`}>
              {/* <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg> */}
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-600 flex-shrink-0">
        <ThreatChart stats={stats} alerts={alerts} />
      </div>

      {/* Recent Alerts */}
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-600 flex-1 min-h-0 overflow-y-auto">
        <h2 className="text-xl font-bold text-white mb-6">Recent Alerts</h2>
        <div className="space-y-4">
          {alerts.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-slate-500 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-300 mb-2">No alerts detected</h3>
              <p className="text-slate-400">System monitoring active</p>
            </div>
          ) : (
            alerts.slice(0, 5).map((alert, idx) => (
              <div key={idx} className={`p-4 rounded-lg border-l-4 ${
                alert.severity === 'CRITICAL' 
                  ? 'bg-red-900/20 border-red-500' 
                  : alert.severity === 'HIGH'
                  ? 'bg-orange-900/20 border-orange-500'
                  : 'bg-blue-900/20 border-blue-500'
              }`}>
                <div className="flex justify-between items-start mb-2">
                  <span className="font-semibold text-white">
                    {alert.type.replace(/_/g, ' ').toUpperCase()}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                    alert.severity === 'CRITICAL' 
                      ? 'bg-red-500 text-white' 
                      : alert.severity === 'HIGH'
                      ? 'bg-orange-500 text-white'
                      : 'bg-blue-500 text-white'
                  }`}>
                    {alert.severity}
                  </span>
                </div>
                <p className="text-slate-300 mb-3">{alert.description}</p>
                <div className="flex justify-between text-sm text-slate-400">
                  <span>{alert.timestamp}</span>
                  <span>{alert.ip_address || 'N/A'}</span>
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