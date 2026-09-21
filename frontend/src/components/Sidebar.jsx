import React from 'react';

export function Sidebar({ activeTab, setActiveTab, userRole }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'complaints', label: 'All Complaints', icon: '📝' },
    { id: 'track', label: 'Track Ticket', icon: '🔍' },
    { id: 'map', label: 'Campus Infrastructure', icon: '🏢' },
    { id: 'analytics', label: 'Admin Reports', icon: '📈' },
  ];

  return (
    <aside className="glass-panel" style={{
      width: '240px',
      borderRadius: 0,
      borderTop: 'none',
      borderBottom: 'none',
      borderLeft: 'none',
      padding: '1.5rem 1rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem'
    }}>
      <div style={{ padding: '0 0.5rem 1rem 0.5rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        Navigation
      </div>
      {navItems.map((item) => {
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.8rem',
              padding: '0.75rem 1rem',
              borderRadius: '10px',
              border: 'none',
              background: isActive ? 'var(--primary-light)' : 'transparent',
              color: isActive ? '#818cf8' : 'var(--text-secondary)',
              fontWeight: isActive ? 700 : 500,
              fontSize: '0.9rem',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'var(--transition)'
            }}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        );
      })}

      <div style={{ marginTop: 'auto', padding: '1rem', background: 'rgba(99, 102, 241, 0.08)', borderRadius: '12px', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
        <h4 style={{ fontSize: '0.85rem', marginBottom: '0.2rem' }}>Need Urgent Help?</h4>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Campus Emergency Maintenance Helpline</p>
        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>📞 Ext: 4401 / 4402</span>
      </div>
    </aside>
  );
}
