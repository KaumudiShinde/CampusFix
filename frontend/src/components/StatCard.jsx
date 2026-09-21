import React from 'react';

export function StatCard({ title, value, icon, color = 'var(--primary)', trend }) {
  return (
    <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{title}</span>
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '10px',
          background: `rgba(${color.includes('var') ? '99, 102, 241' : '16, 185, 129'}, 0.15)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: color,
          fontSize: '1.2rem'
        }}>
          {icon}
        </div>
      </div>
      <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
        {value}
      </div>
      {trend && (
        <div style={{ fontSize: '0.75rem', color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <span>↑</span> {trend} vs last week
        </div>
      )}
    </div>
  );
}
