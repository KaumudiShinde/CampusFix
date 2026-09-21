import React, { useState } from 'react';
import { ComplaintCard } from '../components/ComplaintCard';

export function ComplaintsList({ complaints, onUpvote, onUpdateStatus, userRole }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  const filtered = complaints.filter(item => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = !term || 
                          (item.title && item.title.toLowerCase().includes(term)) || 
                          (item.description && item.description.toLowerCase().includes(term)) ||
                          (item.ticket_id && item.ticket_id.toLowerCase().includes(term)) ||
                          (item.location_building && item.location_building.toLowerCase().includes(term)) ||
                          (item.room_number && item.room_number.toLowerCase().includes(term));
                          
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || 
                          (statusFilter === 'in_progress' ? ['assigned', 'in_progress'].includes(item.status) : item.status === statusFilter);
    const matchesPriority = priorityFilter === 'all' || item.priority === priorityFilter;

    return matchesSearch && matchesCategory && matchesStatus && matchesPriority;
  });

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h1 style={{ fontSize: '1.8rem' }}>Infrastructure Complaints Directory</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Search, filter, and track issues across all campus buildings ({filtered.length} tickets found)</p>
      </div>

      {/* Filter Bar */}
      <div className="glass-panel" style={{ padding: '1.2rem 1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <input 
          type="text" 
          className="form-input" 
          placeholder="🔍 Search title, building, room, or ticket ID..."
          style={{ flex: '1 1 250px' }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select 
          className="form-select"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          style={{ flex: '0 1 180px' }}
        >
          <option value="all">All Categories</option>
          <option value="electrical">⚡ Electrical</option>
          <option value="plumbing">💧 Plumbing</option>
          <option value="furniture">🪑 Furniture</option>
          <option value="it_network">💻 IT & Wi-Fi</option>
          <option value="lab">🔬 Lab Equipment</option>
          <option value="cleanliness">🧹 Housekeeping</option>
          <option value="civil">🏗 Civil Structure</option>
          <option value="other">📌 Other</option>
        </select>

        <select 
          className="form-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ flex: '0 1 160px' }}
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="resolved">Resolved</option>
        </select>

        <select 
          className="form-select"
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          style={{ flex: '0 1 150px' }}
        >
          <option value="all">All Priorities</option>
          <option value="urgent">Urgent</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>

        {(searchTerm || categoryFilter !== 'all' || statusFilter !== 'all' || priorityFilter !== 'all') && (
          <button 
            className="btn btn-secondary btn-sm"
            onClick={() => {
              setSearchTerm('');
              setCategoryFilter('all');
              setStatusFilter('all');
              setPriorityFilter('all');
            }}
          >
            Clear Filters
          </button>
        )}
      </div>

      <div className="complaints-grid">
        {filtered.map(c => (
          <ComplaintCard 
            key={c.id} 
            complaint={c} 
            onUpvote={onUpvote} 
            onUpdateStatus={onUpdateStatus} 
            userRole={userRole}
          />
        ))}
        {filtered.length === 0 && (
          <div className="glass-panel" style={{ gridColumn: '1 / -1', padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔍</div>
            <h3>No complaints found</h3>
            <p style={{ fontSize: '0.85rem', marginTop: '0.3rem' }}>Try clearing filters or changing search keywords.</p>
          </div>
        )}
      </div>
    </div>
  );
}
