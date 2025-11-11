import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import './ThreatChart.css';

function ThreatChart({ stats, alerts }) {
  const [severityData, setSeverityData] = useState([]);
  const [threatTypeData, setThreatTypeData] = useState([]);

  // Update charts when stats or alerts change
  useEffect(() => {
    console.log('📊 ThreatChart updating with stats:', stats);
    
    // Prepare severity data
    const bySeverity = stats.by_severity || stats.alerts_by_severity || {};
    const newSeverityData = [
      { name: 'Critical', value: bySeverity.CRITICAL || 0, color: '#ef4444' },
      { name: 'High', value: bySeverity.HIGH || 0, color: '#f59e0b' },
      { name: 'Medium', value: bySeverity.MEDIUM || 0, color: '#3b82f6' }
    ];
    setSeverityData(newSeverityData);

    // Prepare threat type data
    const byType = stats.by_type || {};
    const newThreatTypeData = Object.entries(byType).map(([key, value]) => ({
      name: key.replace(/_/g, ' ').toUpperCase(),
      count: value
    }));
    setThreatTypeData(newThreatTypeData);

  }, [stats, alerts]); // Re-run when stats or alerts change

  return (
    <div className="threat-chart-container">
      {/* Severity Pie Chart */}
      <div className="chart-card">
        <h3>Threats by Severity</h3>
        {severityData.reduce((sum, item) => sum + item.value, 0) === 0 ? (
          <div className="empty-chart">
            <p>✅ No threats detected yet</p>
            <p style={{ fontSize: '0.9rem', color: '#94a3b8' }}>
              Charts will update in real-time as threats are detected
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={severityData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => value > 0 ? `${name}: ${value}` : ''}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                animationDuration={500}
              >
                {severityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Threat Type Bar Chart */}
      <div className="chart-card">
        <h3>Threats by Type</h3>
        {threatTypeData.length === 0 ? (
          <div className="empty-chart">
            <p>✅ No threats detected yet</p>
            <p style={{ fontSize: '0.9rem', color: '#94a3b8' }}>
              Waiting for attack patterns...
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={threatTypeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis 
                dataKey="name" 
                stroke="#94a3b8" 
                angle={-45} 
                textAnchor="end" 
                height={100}
                interval={0}
              />
              <YAxis stroke="#94a3b8" />
              <Tooltip 
                contentStyle={{ 
                  background: '#1e293b', 
                  border: '1px solid #475569',
                  borderRadius: '6px'
                }} 
              />
              <Legend />
              <Bar 
                dataKey="count" 
                fill="#3b82f6"
                animationDuration={500}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

export default ThreatChart;