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
    <div className="space-y-4 h-full flex flex-col">
      <div className="flex justify-between items-center flex-shrink-0">
        <h2 className="text-base font-semibold text-white uppercase tracking-wide">Live Logs</h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Search logs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded px-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-slate-600 w-80"
          />
        </div>
      </div>

      <div className="bg-slate-800 rounded border border-slate-700 overflow-hidden flex-1 min-h-0 flex flex-col">
        <div className="overflow-x-auto flex-1 min-h-0">
          <table className="w-full">
            <thead className="bg-slate-900 border-b border-slate-700">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Timestamp</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Source</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Severity</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Type</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Message</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {currentLogs.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-4 py-12 text-center">
                    <div className="text-sm text-slate-500 mb-1">No logs found</div>
                    <div className="text-xs text-slate-600">No log entries match your search criteria</div>
                  </td>
                </tr>
              ) : (
                currentLogs.map((log, idx) => (
                  <tr key={idx} className="hover:bg-slate-900">
                    <td className="px-4 py-3 text-xs text-slate-300 font-mono whitespace-nowrap">{log.timestamp}</td>
                    <td className="px-4 py-3 text-xs text-slate-300">{log.source}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        log.severity === 'CRITICAL' 
                          ? 'bg-red-500/20 text-red-400 border border-red-500' 
                          : log.severity === 'HIGH'
                          ? 'bg-orange-500/20 text-orange-400 border border-orange-500'
                          : log.severity === 'MEDIUM'
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500'
                          : 'bg-slate-500/20 text-slate-400 border border-slate-500'
                      }`}>
                        {log.severity}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-300">{log.log_type}</td>
                    <td className="px-4 py-3 text-xs text-slate-300 max-w-md truncate">{log.message}</td>
                    <td className="px-4 py-3 text-xs text-slate-300 font-mono">{log.ip_address || '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-between items-center flex-shrink-0 bg-slate-800 border border-slate-700 rounded px-4 py-3">
          <div className="text-xs text-slate-400">
            Showing {indexOfFirstLog + 1}-{Math.min(indexOfLastLog, filteredLogs.length)} of {filteredLogs.length} logs
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-slate-700 border border-slate-600 text-white text-sm rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-600"
            >
              Previous
            </button>
            <span className="text-sm text-slate-300 px-3">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-slate-700 border border-slate-600 text-white text-sm rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-600"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default LogTable;
