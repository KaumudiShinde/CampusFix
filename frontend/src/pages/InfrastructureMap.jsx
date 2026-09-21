import React, { useState } from 'react';

const DEFAULT_BUILDINGS = [
  { id: 'Central Block', name: 'Central Block (Auditorium, Admin & Library)', zone: 'North Zone', maintainer: 'Estate Maintenance & IT' },
  { id: 'Tech Block B', name: 'Tech Block B (CS, IT & AI Labs)', zone: 'West Zone', maintainer: 'IT & Electrical Division' },
  { id: 'Science Wing', name: 'Science Wing (Physics & Chemistry Depts)', zone: 'East Zone', maintainer: 'Sanitation & Civil Works' },
  { id: 'Academic Block 1', name: 'Academic Block 1 (Lecture Halls 101-205)', zone: 'South Zone', maintainer: 'General Maintenance' },
  { id: 'Student Hostel Block A', name: 'Student Hostel Block A (Boys & Mess)', zone: 'Residential Zone', maintainer: 'Hostel Infrastructure' },
  { id: 'Student Hostel Block B', name: 'Student Hostel Block B (Girls)', zone: 'Residential Zone', maintainer: 'Hostel Infrastructure' },
];

export function InfrastructureMap({ complaints = [] }) {
  const [selectedBuilding, setSelectedBuilding] = useState(null);

  // Group real complaints by building
  const buildingStats = DEFAULT_BUILDINGS.map(b => {
    const buildingComplaints = complaints.filter(c => 
      c.location_building && c.location_building.toLowerCase().includes(b.id.toLowerCase().split(' ')[0])
    );
    const openIssues = buildingComplaints.filter(c => ['pending', 'assigned', 'in_progress'].includes(c.status)).length;
    const resolvedIssues = buildingComplaints.filter(c => c.status === 'resolved').length;
    return {
      ...b,
      openIssues,
      resolvedIssues,
      complaints: buildingComplaints,
      status: openIssues > 2 ? 'critical' : openIssues > 0 ? 'warning' : 'healthy'
    };
  });

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem' }}>Campus Infrastructure Health Map</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Real-time facility status and maintenance load by campus block</p>
        </div>
        <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Status Legend:</span>
          <span className="badge badge-resolved" style={{ fontSize: '0.7rem' }}>● Healthy (0 issues)</span>
          <span className="badge badge-pending" style={{ fontSize: '0.7rem' }}>● Attention (1-2 issues)</span>
          <span className="badge badge-rejected" style={{ fontSize: '0.7rem' }}>● High Load (3+ issues)</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {buildingStats.map(b => {
          const badgeClass = b.status === 'critical' ? 'badge-rejected' : b.status === 'warning' ? 'badge-pending' : 'badge-resolved';
          const badgeLabel = b.status === 'critical' ? 'High Load' : b.status === 'warning' ? 'Attention' : 'Operational';

          return (
            <div 
              key={b.id} 
              className="glass-panel" 
              style={{ 
                padding: '1.5rem', 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '1rem',
                borderLeft: b.status === 'critical' ? '4px solid #f43f5e' : b.status === 'warning' ? '4px solid #f59e0b' : '4px solid #10b981'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent-cyan)' }}>{b.zone}</span>
                  <h3 style={{ fontSize: '1.1rem', marginTop: '0.2rem' }}>🏢 {b.name}</h3>
                </div>
                <span className={`badge ${badgeClass}`}>
                  {badgeLabel}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem', background: 'rgba(15, 23, 42, 0.5)', padding: '1rem', borderRadius: '10px' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Active Tickets</span>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: b.openIssues > 0 ? 'var(--accent-amber)' : 'var(--text-secondary)' }}>
                    {b.openIssues}
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Resolved Tickets</span>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>
                    {b.resolvedIssues}
                  </div>
                </div>
              </div>

              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: 'auto' }}>
                <strong>Responsible:</strong> {b.maintainer}
              </div>

              {b.complaints.length > 0 && (
                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.8rem' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Recent Building Ticket:</span>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: '0.2rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {b.complaints[0].title}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
