import React, { useState } from 'react';
import { StatusBadge } from './StatusBadge';
import { TicketTracker } from './TicketTracker';

export function ComplaintCard({ complaint, onUpvote, onUpdateStatus, userRole }) {
  const [showTracker, setShowTracker] = useState(false);

  const categoryIcons = {
    electrical: '⚡',
    plumbing: '💧',
    furniture: '🪑',
    it_network: '💻',
    lab: '🔬',
    cleanliness: '🧹',
    civil: '🏗',
    other: '📌'
  };

  return (
    <>
      <div className="glass-panel animate-fade-in" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span style={{ fontSize: '1.4rem' }}>{categoryIcons[complaint.category] || '📌'}</span>
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>{complaint.ticket_id}</span>
              <h3 style={{ fontSize: '1.05rem', lineHeight: 1.3 }}>{complaint.title}</h3>
            </div>
          </div>
          <StatusBadge status={complaint.status} />
        </div>

        <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', flex: 1, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {complaint.description}
        </p>

        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <span>📍 {complaint.location_building} - {complaint.room_number}</span>
          <span className={`priority-${complaint.priority}`}>⚡ {complaint.priority?.toUpperCase()}</span>
        </div>

        {complaint.resolution_notes && (
          <div style={{ background: 'rgba(16, 185, 129, 0.08)', padding: '0.6rem 0.8rem', borderRadius: '8px', borderLeft: '3px solid var(--accent-emerald)', fontSize: '0.8rem' }}>
            <strong style={{ color: 'var(--accent-emerald)' }}>Resolution Note:</strong> {complaint.resolution_notes}
          </div>
        )}

        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.8rem', marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            By: {complaint.complainant_name}
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            {/* Track Progress button — visible to all */}
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setShowTracker(true)}
              title="Track ticket progress"
              style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
            >
              🔍 Track
            </button>

            {userRole === 'student' && (
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => onUpvote(complaint.id)}
                title="Upvote if you also face this issue"
              >
                👍 {complaint.upvotes}
              </button>
            )}

            {(userRole === 'staff' || userRole === 'admin') && complaint.status !== 'resolved' && (
              <div style={{ display: 'flex', gap: '0.4rem' }}>
                {complaint.status !== 'in_progress' && complaint.status !== 'assigned' && (
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => onUpdateStatus(complaint.id, 'in_progress')}
                    style={{ background: 'rgba(6, 182, 212, 0.15)', color: '#38bdf8' }}
                  >
                    In Progress
                  </button>
                )}
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => {
                    const notes = prompt('Enter resolution comments:');
                    if (notes !== null) onUpdateStatus(complaint.id, 'resolved', notes);
                  }}
                  style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
                >
                  Resolve
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tracker Modal */}
      {showTracker && (
        <div className="modal-overlay" onClick={() => setShowTracker(false)}>
          <div
            className="modal-content glass-panel"
            style={{ maxWidth: '700px', padding: '2rem' }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.2rem' }}>🔍 Ticket Progress</h2>
              <button
                onClick={() => setShowTracker(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.4rem' }}
              >
                ×
              </button>
            </div>
            <TicketTracker complaint={complaint} />
          </div>
        </div>
      )}
    </>
  );
}
