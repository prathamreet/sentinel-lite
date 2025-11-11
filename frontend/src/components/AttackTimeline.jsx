import React from 'react';

function AttackTimeline({ timeline }) {
  return (
    <div className="space-y-6 h-full flex flex-col">
      <h2 className="text-2xl font-bold text-white flex-shrink-0">Attack Timeline</h2>
      
      {timeline.length === 0 ? (
        <div className="bg-slate-800 rounded-xl p-8 text-center border border-slate-600">
          <div className="text-slate-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-slate-300 mb-2">No attack patterns detected</h3>
          <p className="text-slate-400">Timeline monitoring active</p>
        </div>
      ) : (
        <div className="relative flex-1 min-h-0 overflow-y-auto">
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-slate-600"></div>
          <div className="space-y-8">
            {timeline.map((event, idx) => (
              <div key={idx} className="relative flex items-start">
                <div className={`flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-lg border-4 ${
                  event.severity === 'CRITICAL' 
                    ? 'bg-red-500 border-red-400' 
                    : event.severity === 'HIGH'
                    ? 'bg-orange-500 border-orange-400'
                    : 'bg-blue-500 border-blue-400'
                }`}>
                  {idx + 1}
                </div>
                <div className="ml-6 flex-1">
                  <div className={`bg-slate-800 rounded-xl p-6 border-l-4 ${
                    event.severity === 'CRITICAL' 
                      ? 'border-red-500 bg-red-900/10' 
                      : event.severity === 'HIGH'
                      ? 'border-orange-500 bg-orange-900/10'
                      : 'border-blue-500 bg-blue-900/10'
                  } hover:shadow-xl transition-all duration-200`}>
                    <div className="flex justify-between items-start mb-3">
                      <div className="text-sm text-slate-400 font-mono">{event.time}</div>
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        event.severity === 'CRITICAL' 
                          ? 'bg-red-500 text-white' 
                          : event.severity === 'HIGH'
                          ? 'bg-orange-500 text-white'
                          : 'bg-blue-500 text-white'
                      }`}>
                        {event.severity}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">{event.stage}</h3>
                    <p className="text-slate-300 text-lg mb-4">{event.description}</p>
                    {event.details && (
                      <div className="bg-slate-700 rounded-lg p-4">
                        <div className="text-slate-400 text-sm font-medium mb-2">Additional Details</div>
                        <div className="text-slate-200">{event.details}</div>
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