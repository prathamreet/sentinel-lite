import React, { useState, useEffect, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

function ThreatChart({ stats, alerts }) {
  const [prevStats, setPrevStats] = useState({});
  const [shouldAnimate, setShouldAnimate] = useState(false);

  // Memoized data preparation for better performance
  const severityData = useMemo(() => {
    const bySeverity = stats.by_severity || stats.alerts_by_severity || {};
    return [
      { name: 'Critical', value: bySeverity.CRITICAL || 0, color: '#dc2626', fill: '#dc2626' },
      { name: 'High', value: bySeverity.HIGH || 0, color: '#ea580c', fill: '#ea580c' },
      { name: 'Medium', value: bySeverity.MEDIUM || 0, color: '#2563eb', fill: '#2563eb' }
    ].filter(item => item.value > 0); // Only show non-zero values
  }, [stats]);

  const threatTypeData = useMemo(() => {
    const byType = stats.by_type || {};
    return Object.entries(byType)
      .map(([key, value]) => ({
        name: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        count: value,
        fill: getColorForThreatType(key)
      }))
      .sort((a, b) => b.count - a.count) // Sort by count descending
      .slice(0, 8); // Limit to top 8 for better visualization
  }, [stats]);

  // Color mapping for different threat types
  function getColorForThreatType(type) {
    const colors = {
      'brute_force': '#dc2626',
      'sql_injection': '#ea580c', 
      'privilege_escalation': '#d97706',
      'data_exfiltration': '#7c2d12',
      'port_scan': '#2563eb',
      'log_tampering': '#7c3aed',
      'ransomware': '#be123c',
      'backdoor': '#059669'
    };
    return colors[type] || '#6b7280';
  }

  // Only trigger animation when data actually changes significantly
  useEffect(() => {
    const currentSeveritySum = (stats.by_severity?.CRITICAL || 0) + 
                              (stats.by_severity?.HIGH || 0) + 
                              (stats.by_severity?.MEDIUM || 0);
    const prevSeveritySum = (prevStats.by_severity?.CRITICAL || 0) + 
                           (prevStats.by_severity?.HIGH || 0) + 
                           (prevStats.by_severity?.MEDIUM || 0);

    // Only animate if there's a meaningful change (new threats detected)
    if (currentSeveritySum > prevSeveritySum) {
      setShouldAnimate(true);
      setTimeout(() => setShouldAnimate(false), 1000);
    }
    
    setPrevStats(stats);
  }, [stats]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Severity Pie Chart */}
      <div className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl p-6 shadow-xl border border-slate-600">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">Threats by Severity</h3>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-slate-400">Live</span>
          </div>
        </div>
        {severityData.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-80 text-center">
            <div className="text-slate-500 mb-4 animate-pulse">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-lg text-slate-300 mb-2">System Secure</p>
            <p className="text-sm text-slate-400">
              Monitoring for threats...
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={severityData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value, percent }) => 
                  value > 0 ? `${name}: ${value} (${(percent * 100).toFixed(0)}%)` : ''
                }
                outerRadius={110}
                innerRadius={40}
                fill="#8884d8"
                dataKey="value"
                isAnimationActive={shouldAnimate}
                animationBegin={0}
                animationDuration={shouldAnimate ? 800 : 0}
                animationEasing="ease-out"
              >
                {severityData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color}
                    stroke={entry.color}
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  background: 'rgba(30, 41, 59, 0.95)', 
                  border: '1px solid #475569',
                  borderRadius: '12px',
                  color: '#e2e8f0',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.3)'
                }}
                formatter={(value, name) => [
                  <span style={{ color: '#fff', fontWeight: 'bold' }}>{value}</span>, 
                  <span style={{ color: '#cbd5e1' }}>{name}</span>
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Threat Type Bar Chart */}
      <div className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl p-6 shadow-xl border border-slate-600">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">Attack Patterns</h3>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-slate-400">Live</span>
          </div>
        </div>
        {threatTypeData.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-80 text-center">
            <div className="text-slate-500 mb-4 animate-pulse">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-lg text-slate-300 mb-2">No Attacks Detected</p>
            <p className="text-sm text-slate-400">
              AI monitoring active...
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={320}>
            <BarChart 
              data={threatTypeData} 
              margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
            >
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="100%" stopColor="#1e40af" stopOpacity={0.3}/>
                </linearGradient>
              </defs>
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="#334155" 
                strokeOpacity={0.3}
              />
              <XAxis 
                dataKey="name" 
                stroke="#94a3b8" 
                angle={-45} 
                textAnchor="end" 
                height={80}
                interval={0}
                fontSize={11}
                fontWeight="500"
              />
              <YAxis 
                stroke="#94a3b8" 
                fontSize={12}
                fontWeight="500"
              />
              <Tooltip 
                contentStyle={{ 
                  background: 'rgba(30, 41, 59, 0.95)', 
                  border: '1px solid #475569',
                  borderRadius: '12px',
                  color: '#e2e8f0',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.3)'
                }}
                formatter={(value, name) => [
                  <span style={{ color: '#fff', fontWeight: 'bold' }}>{value}</span>, 
                  <span style={{ color: '#cbd5e1' }}>Incidents</span>
                ]}
                labelFormatter={(label) => (
                  <span style={{ color: '#f1f5f9', fontWeight: 'bold' }}>{label}</span>
                )}
              />
              <Bar 
                dataKey="count" 
                fill="url(#barGradient)"
                isAnimationActive={shouldAnimate}
                animationBegin={0}
                animationDuration={shouldAnimate ? 1000 : 0}
                animationEasing="ease-out"
                radius={[6, 6, 0, 0]}
                stroke="#1e40af"
                strokeWidth={1}
              >
                {threatTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

export default ThreatChart;