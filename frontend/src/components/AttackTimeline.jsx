import React from 'react';

function AttackTimeline({ timeline }) {
  return (
    <div className="space-y-4 h-full flex flex-col">
      <h2 className="text-base font-semibold text-white uppercase tracking-wide flex-shrink-0">Attack Timeline</h2>
      
      {timeline.length === 0 ? (
        <div className="bg-slate-800 rounded border border-slate-700 p-12 text-center">
          <div className="text-sm text-slate-500 mb-1">No attack patterns detected</div>
          <div className="text-xs text-slate-600">Timeline monitoring active</div>
        </div>
      ) : (
        <div className="bg-slate-800 rounded border border-slate-700 p-5 flex-1 min-h-0 overflow-y-auto">
          <div className="space-y-0">
            {timeline.map((event, idx) => (
              <div key={idx} className="relative">
                {/* Timeline connector line */}
                {idx !== timeline.length - 1 && (
                  <div className="absolute left-3 top-8 bottom-0 w-px bg-slate-700"></div>
                )}
                
                <div className="flex gap-4 pb-6">
                  {/* Timeline marker */}
                  <div className="flex-shrink-0 flex flex-col items-center">
                    <div className={`w-6 h-6 rounded-full border-2 bg-slate-900 flex items-center justify-center ${
                      event.severity === 'CRITICAL' 
                        ? 'border-red-500' 
                        : event.severity === 'HIGH'
                        ? 'border-orange-500'
                        : 'border-blue-500'
                    }`}>
                      <div className={`w-2 h-2 rounded-full ${
                        event.severity === 'CRITICAL' 
                          ? 'bg-red-500' 
                          : event.severity === 'HIGH'
                          ? 'bg-orange-500'
                          : 'bg-blue-500'
                      }`}></div>
                    </div>
                  </div>

                  {/* Event content */}
                  <div className="flex-1 pt-0">
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-xs text-slate-500 font-mono">{event.time}</span>
                      <span className="text-xs text-slate-600 font-mono">#{idx + 1}</span>
                    </div>
                    
                    <h3 className="text-sm font-semibold text-white mb-1">{event.stage}</h3>
                    <p className="text-sm text-slate-400 mb-3">{event.description}</p>
                    
                    {event.details && (
                      <div className="bg-slate-900 rounded border border-slate-700 p-3 text-xs text-slate-400">
                        {event.details}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default AttackTimeline;
