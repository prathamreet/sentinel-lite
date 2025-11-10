import React, { useState } from 'react';
import './LogTable.css';

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
    <div className="log-table-container">
      <div className="table-header">
<<<<<<< HEAD
        <h2> Raw Log Entries</h2>
=======
        <h2>Raw Log Entries</h2>
>>>>>>> 85abb9c0ff3d02ed7d644169f9181eb73d556fcc
        <input
          type="text"
          placeholder="🔍 Search logs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="table-wrapper">
        <table className="log-table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Source</th>
              <th>Severity</th>
              <th>Type</th>
              <th>Message</th>
              <th>IP Address</th>
            </tr>
          </thead>
          <tbody>
            {currentLogs.map((log, idx) => (
              <tr key={idx} className={log.severity.toLowerCase()}>
                <td>{log.timestamp}</td>
                <td>{log.source}</td>
                <td>
                  <span className={`severity-tag ${log.severity.toLowerCase()}`}>
                    {log.severity}
                  </span>
                </td>
                <td>{log.log_type}</td>
                <td className="message-cell">{log.message}</td>
                <td>{log.ip_address || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          ← Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next →
        </button>
      </div>
    </div>
  );
}

export default LogTable;