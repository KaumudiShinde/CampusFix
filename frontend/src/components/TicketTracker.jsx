import React from 'react';

const STATUS_STAGES = [
  { key: 'pending', label: 'Pending Review', icon: '📋', color: '#f59e0b' },
  { key: 'assigned', label: 'Assigned to Staff', icon: '👷', color: '#6366f1' },
  { key: 'in_progress', label: 'In Progress', icon: '⚙️', color: '#06b6d4' },
  { key: 'resolved', label: 'Resolved', icon: '✅', color: '#10b981' },
];

const REJECTED_STAGE = { key: 'rejected', label: 'Rejected', icon: '❌', color: '#f43f5e' };

function getStageIndex(status) {
  if (status === 'rejected') return -1;
  return STATUS_STAGES.findIndex(s => s.key === status);
}

function getProgress(status) {
  if (status === 'rejected') return 0;
  const idx = STATUS_STAGES.findIndex(s => s.key === status);
  if (idx === -1) return 0;
  return Math.round(((idx + 1) / STATUS_STAGES.length) * 100);
}

function formatDate(ts) {
  if (!ts) return '';
  return new Date(ts).toLocaleString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
}

const CATEGORY_LABELS = {
  electrical: '⚡ Electrical / Power',
  plumbing: '🚿 Plumbing & Water',
  furniture: '🪑 Furniture',
  it_network: '💻 IT & Network',
  lab: '🔬 Lab Equipment',
  cleanliness: '🧹 Hygiene',
  civil: '🏗️ Civil / Structure',
  other: '🔧 Other',
};

export function TicketTracker({ complaint }) {
  if (!complaint) return null;

  const isRejected = complaint.status === 'rejected';
  const progress = getProgress(complaint.status);
  const currentIdx = getStageIndex(complaint.status);
  const stages = isRejected ? [...STATUS_STAGES, REJECTED_STAGE] : STATUS_STAGES;

  const logs = complaint.logs || [];

  // Build a map: status_to -> log entries
  const logsByStatus = {};
  logs.forEach(log => {
    if (!logsByStatus[log.status_to]) logsByStatus[log.status_to] = [];
    logsByStatus[log.status_to].push(log);
  });

  return (
    <div className="tracker-root">
      {/* Header */}
      <div className="tracker-header">
        <div className="tracker-ticket-id">
          <span className="tracker-ticket-badge">Ticket</span>
          <span className="tracker-ticket-num">{complaint.ticket_id}</span>
        </div>
        <div className={`badge badge-${complaint.status}`}>
          {complaint.status.replace('_', ' ').toUpperCase()}
        </div>
      </div>

      {/* Info row */}
      <div className="tracker-info-grid">
        <div className="tracker-info-item">
          <span className="tracker-info-label">Category</span>
          <span className="tracker-info-value">{CATEGORY_LABELS[complaint.category] || complaint.category}</span>
        </div>
        <div className="tracker-info-item">
          <span className="tracker-info-label">Location</span>
          <span className="tracker-info-value">{complaint.location_building} {complaint.room_number && `· Room ${complaint.room_number}`}</span>
        </div>
        <div className="tracker-info-item">
          <span className="tracker-info-label">Filed By</span>
          <span className="tracker-info-value">{complaint.complainant_name || 'Student'}</span>
        </div>
        <div className="tracker-info-item">
          <span className="tracker-info-label">Assigned To</span>
          <span className="tracker-info-value">{complaint.assigned_staff_name || 'Unassigned'}</span>
        </div>
        <div className="tracker-info-item">
          <span className="tracker-info-label">Submitted</span>
          <span className="tracker-info-value">{formatDate(complaint.created_at)}</span>
        </div>
        {complaint.resolved_at && (
          <div className="tracker-info-item">
            <span className="tracker-info-label">Resolved</span>
            <span className="tracker-info-value" style={{ color: '#34d399' }}>{formatDate(complaint.resolved_at)}</span>
          </div>
        )}
      </div>

      {/* Description */}
      <div className="tracker-desc">
        <h4 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Description</h4>
        <p style={{ fontSize: '0.95rem', lineHeight: 1.6 }}>{complaint.description}</p>
      </div>

      {/* Progress bar */}
      {!isRejected && (
        <div className="tracker-progress-section">
          <div className="tracker-progress-header">
            <span>Overall Progress</span>
            <span className="tracker-progress-pct">{progress}%</span>
          </div>
          <div className="tracker-progress-track">
            <div
              className="tracker-progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Timeline */}
      <div className="tracker-timeline">
        <h3 className="tracker-timeline-title">📍 Progress Timeline</h3>
        <div className="tracker-steps">
          {stages.map((stage, i) => {
            let stepState = 'upcoming'; // 'done' | 'active' | 'upcoming' | 'rejected'
            if (isRejected && stage.key === 'rejected') {
              stepState = 'rejected';
            } else if (isRejected) {
              stepState = 'upcoming';
            } else if (i < currentIdx) {
              stepState = 'done';
            } else if (i === currentIdx) {
              stepState = 'active';
            }

            const stageLogs = logsByStatus[stage.key] || [];

            return (
              <div key={stage.key} className={`tracker-step tracker-step-${stepState}`}>
                {/* Connector line */}
                {i < stages.length - 1 && (
                  <div className={`tracker-step-line ${stepState === 'done' ? 'done' : ''}`} />
                )}

                {/* Step icon */}
                <div
                  className="tracker-step-icon"
                  style={{
                    background: stepState === 'done' || stepState === 'active' || stepState === 'rejected'
                      ? `linear-gradient(135deg, ${stage.color}cc, ${stage.color}66)`
                      : 'rgba(255,255,255,0.05)',
                    borderColor: stepState === 'done' || stepState === 'active' || stepState === 'rejected'
                      ? stage.color
                      : 'rgba(255,255,255,0.15)',
                    boxShadow: stepState === 'active'
                      ? `0 0 18px ${stage.color}66`
                      : 'none',
                  }}
                >
                  <span style={{ fontSize: '1.1rem' }}>
                    {stepState === 'done' ? '✓' : stage.icon}
                  </span>
                </div>

                {/* Step content */}
                <div className="tracker-step-content">
                  <div className="tracker-step-label" style={{ color: stepState === 'upcoming' ? 'var(--text-muted)' : stage.color }}>
                    {stage.label}
                    {stepState === 'active' && (
                      <span className="tracker-active-badge">● CURRENT</span>
                    )}
                  </div>

                  {/* Log entries for this stage */}
                  {stageLogs.length > 0 && stageLogs.map((log, li) => (
                    <div key={li} className="tracker-log-entry">
                      <div className="tracker-log-meta">
                        <span className="tracker-log-user">
                          {log.updated_by_name || 'System'}
                          {log.updated_by_role && (
                            <span className="tracker-log-role">{log.updated_by_role}</span>
                          )}
                        </span>
                        <span className="tracker-log-time">{formatDate(log.timestamp)}</span>
                      </div>
                      {log.comment && (
                        <div className="tracker-log-comment">💬 {log.comment}</div>
                      )}
                    </div>
                  ))}

                  {stepState === 'upcoming' && (
                    <div className="tracker-step-pending">Awaiting this stage...</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Resolution notes */}
      {complaint.resolution_notes && (
        <div className="tracker-resolution">
          <h4>📝 Resolution Notes</h4>
          <p>{complaint.resolution_notes}</p>
        </div>
      )}
    </div>
  );
}

export default TicketTracker;
