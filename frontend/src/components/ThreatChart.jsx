import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import './ThreatChart.css';

function ThreatChart({ stats, alerts }) {
  const severityData = [
    { name: 'Critical', value: stats.critical_count || 0, color: '#ef4444' },
    { name: 'High', value: stats.high_count || 0, color: '#f59e0b' },
    { name: 'Medium', value: stats.medium_count || 0, color: '#3b82f6' }
  ];

  const threatTypeData = Object.entries(stats.by_type || {}).map(([key, value]) => ({
    name: key.replace(/_/g, ' ').toUpperCase(),
    count: value
  }));

  return (
    <div className="threat-chart-container">
      <div className="chart-card">
        <h3>Threats by Severity</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={severityData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) => `${name}: ${value}`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {severityData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-card">
        <h3>Threats by Type</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={threatTypeData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="name" stroke="#94a3b8" angle={-45} textAnchor="end" height={100} />
            <YAxis stroke="#94a3b8" />
            <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #475569' }} />
            <Legend />
            <Bar dataKey="count" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default ThreatChart;