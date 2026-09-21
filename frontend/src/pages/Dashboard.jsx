import React from 'react';
import { StatCard } from '../components/StatCard';
import { ComplaintCard } from '../components/ComplaintCard';

export function Dashboard({ complaints, onUpvote, onUpdateStatus, userRole, onOpenModal }) {
  const total = complaints.length;
  const pending = complaints.filter(c => c.status === 'pending').length;
  const inProgress = complaints.filter(c => ['assigned', 'in_progress'].includes(c.status)).length;
  const resolved = complaints.filter(c => c.status === 'resolved').length;

  const recentComplaints = complaints.slice(0, 4);

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem' }}>Campus Infrastructure Overview</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Real-time complaint tracking & facility health metrics</p>
        </div>
        <button className="btn btn-primary" onClick={onOpenModal}>
          + Register Complaint
        </button>
      </div>

      <div className="stats-grid">
        <StatCard title="Total Tickets" value={total} icon="📋" color="var(--primary)" trend="12%" />
        <StatCard title="Pending Review" value={pending} icon="⏳" color="var(--accent-amber)" />
        <StatCard title="Under Maintenance" value={inProgress} icon="⚙️" color="var(--accent-cyan)" />
        <StatCard title="Resolved Issues" value={resolved} icon="✅" color="var(--accent-emerald)" trend="94% resolution rate" />
      </div>

      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2>Recent Infrastructure Tickets</h2>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Showing latest {recentComplaints.length} tickets</span>
        </div>

        <div className="complaints-grid">
          {recentComplaints.map(complaint => (
            <ComplaintCard 
              key={complaint.id} 
              complaint={complaint} 
              onUpvote={onUpvote}
              onUpdateStatus={onUpdateStatus}
              userRole={userRole}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
