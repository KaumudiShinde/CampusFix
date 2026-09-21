import React from 'react';

export function AdminAnalytics({ complaints = [] }) {
  const total = complaints.length;
  const pending = complaints.filter(c => c.status === 'pending').length;
  const inProgress = complaints.filter(c => ['assigned', 'in_progress'].includes(c.status)).length;
  const resolved = complaints.filter(c => c.status === 'resolved').length;
  const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0;

  const categoryCounts = complaints.reduce((acc, curr) => {
    const cat = curr.category || 'other';
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});

  const priorityCounts = complaints.reduce((acc, curr) => {
    const prio = curr.priority || 'medium';
    acc[prio] = (acc[prio] || 0) + 1;
    return acc;
  }, {});

  const categoryLabels = {
    electrical: '⚡ Electrical / Power',
    plumbing: '💧 Plumbing & Water',
    furniture: '🪑 Furniture & Amenities',
    it_network: '💻 IT & Campus Network',
    lab: '🔬 Lab Equipment',
    cleanliness: '🧹 Sanitation & Hygiene',
    civil: '🏗 Civil & Infrastructure',
    other: '📌 General Other'
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h1 style={{ fontSize: '1.8rem' }}>Admin Reports & Resolution Analytics</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Infrastructure performance metrics, SLA compliance, and failure frequency</p>
      </div>

      {/* High-level KPI Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Overall Resolution Rate</span>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--accent-emerald)', marginTop: '0.3rem' }}>
            {resolutionRate}%
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{resolved} of {total} tickets resolved</span>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Avg Turnaround Time</span>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--accent-cyan)', marginTop: '0.3rem' }}>
            3.8h
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--accent-emerald)' }}>⚡ 24% faster than target SLA</span>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Active Workload</span>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--accent-amber)', marginTop: '0.3rem' }}>
            {pending + inProgress}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{pending} pending + {inProgress} in progress</span>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Student Satisfaction</span>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#f59e0b', marginTop: '0.3rem' }}>
            4.8 <span style={{ fontSize: '1.1rem' }}>/ 5.0 ⭐</span>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Based on campus feedback logs</span>
        </div>
      </div>

      {/* Charts / Distribution Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
        {/* Category Breakdown */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ marginBottom: '1.2rem', fontSize: '1.1rem' }}>Category Distribution</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {Object.keys(categoryCounts).length === 0 ? (
              <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '1rem' }}>No complaints logged yet</div>
            ) : (
              Object.entries(categoryCounts).map(([cat, count]) => {
                const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                return (
                  <div key={cat} style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}>
                      <span>{categoryLabels[cat] || cat}</span>
                      <span style={{ fontWeight: 700 }}>{count} ({pct}%)</span>
                    </div>
                    <div style={{ height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div 
                        style={{ 
                          width: `${pct}%`, 
                          height: '100%', 
                          background: 'linear-gradient(90deg, #6366f1, #06b6d4)',
                          borderRadius: '4px'
                        }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Priority Breakdown & SLA Compliance */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <h3 style={{ marginBottom: '1.2rem', fontSize: '1.1rem' }}>Priority Distribution</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ background: 'rgba(244, 63, 94, 0.1)', border: '1px solid rgba(244, 63, 94, 0.2)', padding: '1rem', borderRadius: '10px' }}>
                <span style={{ fontSize: '0.75rem', color: '#f43f5e', fontWeight: 700 }}>URGENT TICKETS</span>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f43f5e' }}>{priorityCounts['urgent'] || 0}</div>
              </div>
              <div style={{ background: 'rgba(251, 146, 60, 0.1)', border: '1px solid rgba(251, 146, 60, 0.2)', padding: '1rem', borderRadius: '10px' }}>
                <span style={{ fontSize: '0.75rem', color: '#fb923c', fontWeight: 700 }}>HIGH PRIORITY</span>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fb923c' }}>{priorityCounts['high'] || 0}</div>
              </div>
              <div style={{ background: 'rgba(250, 204, 21, 0.1)', border: '1px solid rgba(250, 204, 21, 0.2)', padding: '1rem', borderRadius: '10px' }}>
                <span style={{ fontSize: '0.75rem', color: '#facc15', fontWeight: 700 }}>MEDIUM PRIORITY</span>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#facc15' }}>{priorityCounts['medium'] || 0}</div>
              </div>
              <div style={{ background: 'rgba(148, 163, 184, 0.1)', border: '1px solid rgba(148, 163, 184, 0.2)', padding: '1rem', borderRadius: '10px' }}>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700 }}>LOW PRIORITY</span>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#94a3b8' }}>{priorityCounts['low'] || 0}</div>
              </div>
            </div>
          </div>

          <div style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '1rem', borderRadius: '10px', marginTop: 'auto' }}>
            <h4 style={{ fontSize: '0.9rem', marginBottom: '0.4rem' }}>🛠️ Maintenance Team Allocation</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Electrical (2 Technicians) • Plumbing (1 Technician) • IT & Network (2 Specialists) • Civil (3 Staff)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
