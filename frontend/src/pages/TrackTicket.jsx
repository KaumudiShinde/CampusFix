import React, { useState } from 'react';
import { TicketTracker } from '../components/TicketTracker';
import { api } from '../services/api';

export function TrackTicket({ complaints = [] }) {
  const [ticketId, setTicketId] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!ticketId.trim()) return;
    setError('');
    setResult(null);
    setLoading(true);
    try {
      const complaint = await api.getComplaintByTicketId(ticketId.trim().toUpperCase());
      setResult(complaint);
    } catch (err) {
      setError(err.message || 'Ticket not found. Check your Ticket ID and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Page header */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '0.4rem' }}>
          <span className="gradient-text">🔍 Track Your Ticket</span>
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Enter your ticket ID to see real-time status updates and progress timeline
        </p>
      </div>

      {/* Search form */}
      <form onSubmit={handleSearch} className="track-search-form glass-panel">
        <div className="track-search-inner">
          <div className="track-search-icon">🎫</div>
          <input
            className="track-search-input"
            placeholder="Enter Ticket ID (e.g. CMP-A1B2C3)"
            value={ticketId}
            onChange={e => { setTicketId(e.target.value); setError(''); }}
          />
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading || !ticketId.trim()}
          >
            {loading ? <span className="login-spinner" /> : 'Track →'}
          </button>
        </div>
        {error && (
          <div className="track-error">⚠️ {error}</div>
        )}
      </form>

      {/* Result */}
      {result && (
        <div className="animate-fade-in" style={{ marginTop: '2rem' }}>
          <TicketTracker complaint={result} />
        </div>
      )}

      {/* Recent tickets (from passed complaints) */}
      {!result && complaints.length > 0 && (
        <div style={{ marginTop: '2.5rem' }}>
          <h3 style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '1rem', fontWeight: 600 }}>
            📌 Recent Complaints — Click to Track
          </h3>
          <div className="track-recent-grid">
            {complaints.slice(0, 8).map(c => (
              <button
                key={c.id}
                className="track-recent-card glass-panel"
                onClick={() => {
                  setTicketId(c.ticket_id || '');
                  setResult(c);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                <div className="track-recent-top">
                  <span className="track-recent-id">{c.ticket_id || 'N/A'}</span>
                  <span className={`badge badge-${c.status}`} style={{ fontSize: '0.65rem', padding: '0.15rem 0.5rem' }}>
                    {c.status?.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
                <div className="track-recent-title">{c.title}</div>
                <div className="track-recent-meta">
                  {c.location_building}
                  {c.category && <span className="track-recent-dot">·</span>}
                  <span>{c.category?.replace('_', ' ')}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default TrackTicket;
