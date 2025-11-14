import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

function ThreatChart({ stats, alerts }) {
  // Prepare severity data
  const severityData = React.useMemo(() => {
    const bySeverity = stats.by_severity || stats.alerts_by_severity || {};
    return [
      { name: 'Critical', value: bySeverity.CRITICAL || 0, color: '#ef4444' },
      { name: 'High', value: bySeverity.HIGH || 0, color: '#f97316' },
      { name: 'Medium', value: bySeverity.MEDIUM || 0, color: '#3b82f6' }
    ].filter(item => item.value > 0);
  }, [stats]);

  // Prepare threat type data with shortened names
  const threatTypeData = React.useMemo(() => {
    const byType = stats.by_type || {};
    return Object.entries(byType)
      .map(([key, value]) => ({
        name: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        shortName: key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
        count: value,
        fill: getColorForThreatType(key)
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  }, [stats]);

  function getColorForThreatType(type) {
    const colors = {
      'brute_force': '#ef4444',
      'sql_injection': '#f97316', 
      'privilege_escalation': '#f59e0b',
      'data_exfiltration': '#dc2626',
      'port_scan': '#3b82f6',
      'log_tampering': '#8b5cf6',
      'ransomware': '#dc2626',
      'backdoor': '#10b981'
    };
    return colors[type] || '#6b7280';
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {/* Severity Chart */}
      <div>
        <h3 className="text-sm font-medium text-slate-400 mb-3 uppercase tracking-wide">Threats by Severity</h3>
        {severityData.length === 0 ? (
          <div className="flex items-center justify-center h-96 text-center">
            <div>
              <div className="text-sm text-slate-500 mb-1">No threats detected</div>
              <div className="text-xs text-slate-600">Monitoring active</div>
            </div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={360}>
            <PieChart>
              <Pie
                data={severityData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value, percent }) => 
                  value > 0 ? `${name}: ${value} (${(percent * 100).toFixed(0)}%)` : ''
                }
                outerRadius={120}
                innerRadius={60}
                dataKey="value"
                isAnimationActive={true}
                animationDuration={500}
              >
                {severityData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color}
                    stroke="#1e293b"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  background: '#1e293b', 
                  border: '1px solid #334155',
                  borderRadius: '4px',
                  fontSize: '12px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Threat Type Chart */}
      <div>
        <h3 className="text-sm font-medium text-slate-400 mb-3 uppercase tracking-wide">Attack Patterns</h3>
        {threatTypeData.length === 0 ? (
          <div className="flex items-center justify-center h-96 text-center">
            <div>
              <div className="text-sm text-slate-500 mb-1">No attacks detected</div>
              <div className="text-xs text-slate-600">Monitoring active</div>
            </div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={360}>
            <BarChart 
              data={threatTypeData} 
              margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
            >
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="#334155" 
                vertical={false}
              />
              <XAxis 
                dataKey="shortName" 
                stroke="#64748b" 
                angle={0} 
                textAnchor="middle" 
                height={40}
                interval={0}
                fontSize={9}
                tick={{ fill: '#64748b' }}
              />
              <YAxis 
                stroke="#64748b" 
                fontSize={11}
                width={40}
              />
              <Tooltip 
                contentStyle={{ 
                  background: '#1e293b', 
                  border: '1px solid #334155',
                  borderRadius: '4px',
                  fontSize: '12px'
                }}
                cursor={{ fill: 'rgba(148, 163, 184, 0.1)' }}
                labelFormatter={(label) => {
                  const item = threatTypeData.find(d => d.shortName === label);
                  return item ? item.name : label;
                }}
              />
              <Bar 
                dataKey="count" 
                isAnimationActive={true}
                animationDuration={500}
                radius={[4, 4, 0, 0]}
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
