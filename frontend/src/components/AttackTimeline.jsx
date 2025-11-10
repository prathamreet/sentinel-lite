import React from 'react';
import './AttackTimeline.css';

function AttackTimeline({ timeline }) {
  return (
    <div className="timeline-container">
      <h2>⏱️ Attack Timeline Story</h2>
      
      {timeline.length === 0 ? (
        <div className="empty-state">
          <h3>No attack patterns detected</h3>
          <p>Your system timeline looks clean!</p>
        </div>
      ) : (
        <div className="timeline">
          {timeline.map((event, idx) => (
            <div key={idx} className={`timeline-event ${event.severity.toLowerCase()}`}>
              <div className="timeline-marker">
                <span className="timeline-number">{idx + 1}</span>
              </div>
              <div className="timeline-content">
                <div className="timeline-time">{event.time}</div>
                <h3 className="timeline-stage">{event.stage}</h3>
                <p className="timeline-description">{event.description}</p>
                {event.details && (
                  <div className="timeline-details">{event.details}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AttackTimeline;