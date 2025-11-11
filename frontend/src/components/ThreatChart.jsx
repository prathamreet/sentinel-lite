import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Severity Pie Chart */}
      <div className="bg-slate-700 rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-6">Threats by Severity</h3>
        {severityData.reduce((sum, item) => sum + item.value, 0) === 0 ? (
          <div className="flex flex-col items-center justify-center h-80 text-center">
            <div className="text-slate-500 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <p className="text-lg text-slate-300 mb-2">No threats detected</p>
            <p className="text-sm text-slate-400">
              Charts will update as threats are detected
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
              <Tooltip 
                contentStyle={{ 
                  background: '#1e293b', 
                  border: '1px solid #475569',
                  borderRadius: '8px',
                  color: '#e2e8f0'
                }} 
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Threat Type Bar Chart */}
      <div className="bg-slate-700 rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-6">Threats by Type</h3>
        {threatTypeData.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-80 text-center">
            <div className="text-slate-500 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <p className="text-lg text-slate-300 mb-2">No threats detected</p>
            <p className="text-sm text-slate-400">
              Monitoring for attack patterns
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
                fontSize={12}
              />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  background: '#1e293b', 
                  border: '1px solid #475569',
                  borderRadius: '8px',
                  color: '#e2e8f0'
                }} 
              />
              <Legend />
              <Bar 
                dataKey="count" 
                fill="#3b82f6"
                animationDuration={500}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

export default ThreatChart;