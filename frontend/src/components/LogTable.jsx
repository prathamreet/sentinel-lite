import React, { useState } from 'react';

function LogTable({ logs }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const logsPerPage = 50;

  const filteredLogs = logs.filter(log =>
    log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.source.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastLog = currentPage * logsPerPage;
  const indexOfFirstLog = indexOfLastLog - logsPerPage;
  const currentLogs = filteredLogs.slice(indexOfFirstLog, indexOfLastLog);

  const totalPages = Math.ceil(filteredLogs.length / logsPerPage);

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex justify-between items-center flex-shrink-0">
        <h2 className="text-2xl font-bold text-white">Live Logs</h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Search logs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-80"
          />
        </div>
      </div>

      <div className="bg-slate-800 rounded-xl border border-slate-600 overflow-hidden flex-1 min-h-0 flex flex-col">
        <div className="overflow-x-auto flex-1 min-h-0">
          <table className="w-full">
            <thead className="bg-slate-700">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Timestamp</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Source</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Severity</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Type</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Message</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-600">
              {currentLogs.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center">
                    <div className="text-slate-500 mb-4">
                      <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-300 mb-2">No logs found</h3>
                    <p className="text-slate-400">No log entries match your search criteria</p>
                  </td>
                </tr>
              ) : (
                currentLogs.map((log, idx) => (
                  <tr key={idx} className="hover:bg-slate-700/50 transition-colors duration-150">
                    <td className="px-6 py-4 text-sm text-slate-300 font-mono">{log.timestamp}</td>
                    <td className="px-6 py-4 text-sm text-slate-300">{log.source}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        log.severity === 'CRITICAL' 
                          ? 'bg-red-500 text-white' 
                          : log.severity === 'HIGH'
                          ? 'bg-orange-500 text-white'
                          : log.severity === 'MEDIUM'
                          ? 'bg-blue-500 text-white'
                          : 'bg-slate-500 text-white'
                      }`}>
                        {log.severity}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-300">{log.log_type}</td>
                    <td className="px-6 py-4 text-sm text-slate-300 max-w-md truncate">{log.message}</td>
                    <td className="px-6 py-4 text-sm text-slate-300 font-mono">{log.ip_address || '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-4 flex-shrink-0 pt-4">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-slate-700 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-600 transition-colors duration-200"
          >
            ← Previous
          </button>
          <span className="text-slate-300 font-medium">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-slate-700 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-600 transition-colors duration-200"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}

export default LogTable;