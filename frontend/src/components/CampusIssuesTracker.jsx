import React, { useState } from 'react';
import { 
  Wrench, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Filter, 
  Plus, 
  Tv, 
  Monitor, 
  Wind, 
  Wifi, 
  Zap, 
  Layers,
  Search,
  UserCheck
} from 'lucide-react';

const CATEGORY_ICONS = {
  projector_av: Tv,
  workstation_pc: Monitor,
  ac_cooling: Wind,
  network_wifi: Wifi,
  electrical_power: Zap,
  furniture: Layers,
  lab_equipment: Wrench,
  cleanliness: CheckCircle2,
  other: AlertTriangle,
};

export default function CampusIssuesTracker({ 
  issues, 
  buildings, 
  onOpenReportModal, 
  onResolveIssue,
  onAssignTechnician 
}) {
  const [statusTab, setStatusTab] = useState('all'); // all, open, in_progress, resolved
  const [selectedBuilding, setSelectedBuilding] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [search, setSearch] = useState('');

  const filteredIssues = issues.filter(issue => {
    if (statusTab !== 'all' && issue.status !== statusTab) return false;
    if (selectedBuilding !== 'all' && issue.building_code !== selectedBuilding) return false;
    if (selectedPriority !== 'all' && issue.priority !== selectedPriority) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const match = `${issue.ticket_id} ${issue.title} ${issue.description} ${issue.room_number} ${issue.building_name}`.toLowerCase();
      if (!match.includes(q)) return false;
    }
    return true;
  });

  const openCount = issues.filter(i => i.status === 'open').length;
  const inProgressCount = issues.filter(i => i.status === 'in_progress').length;
  const resolvedCount = issues.filter(i => i.status === 'resolved').length;

  return (
    <div className="issues-tracker-container">
      {/* Tracker Header */}
      <div className="tracker-hero-bar">
        <div className="tracker-hero-left">
          <div className="tracker-icon-badge">
            <Wrench size={24} />
          </div>
          <div>
            <h2 className="tracker-title">Campus Infrastructure Maintenance</h2>
            <p className="tracker-subtitle">
              Monitor, track, and resolve facility issues across all MIT-WPU academic blocks.
            </p>
          </div>
        </div>

        <button 
          onClick={() => onOpenReportModal()} 
          className="btn-primary"
        >
          <Plus size={16} />
          <span>Report Facility Issue</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="tracker-kpi-grid">
        <div className={`tracker-kpi-card ${statusTab === 'open' ? 'active' : ''}`} onClick={() => setStatusTab('open')}>
          <div className="kpi-icon-box bg-red">
            <AlertTriangle size={20} />
          </div>
          <div>
            <span className="kpi-value text-red-400">{openCount}</span>
            <span className="kpi-label">Open / Pending Review</span>
          </div>
        </div>

        <div className={`tracker-kpi-card ${statusTab === 'in_progress' ? 'active' : ''}`} onClick={() => setStatusTab('in_progress')}>
          <div className="kpi-icon-box bg-blue">
            <Clock size={20} />
          </div>
          <div>
            <span className="kpi-value text-blue-400">{inProgressCount}</span>
            <span className="kpi-label">Technician Assigned</span>
          </div>
        </div>

        <div className={`tracker-kpi-card ${statusTab === 'resolved' ? 'active' : ''}`} onClick={() => setStatusTab('resolved')}>
          <div className="kpi-icon-box bg-emerald">
            <CheckCircle2 size={20} />
          </div>
          <div>
            <span className="kpi-value text-emerald-400">{resolvedCount}</span>
            <span className="kpi-label">Resolved Issues</span>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="tracker-controls-bar">
        <div className="status-tabs-group">
          <button 
            className={`status-tab-btn ${statusTab === 'all' ? 'active' : ''}`}
            onClick={() => setStatusTab('all')}
          >
            All Tickets ({issues.length})
          </button>
          <button 
            className={`status-tab-btn ${statusTab === 'open' ? 'active' : ''}`}
            onClick={() => setStatusTab('open')}
          >
            Open ({openCount})
          </button>
          <button 
            className={`status-tab-btn ${statusTab === 'in_progress' ? 'active' : ''}`}
            onClick={() => setStatusTab('in_progress')}
          >
            In Progress ({inProgressCount})
          </button>
          <button 
            className={`status-tab-btn ${statusTab === 'resolved' ? 'active' : ''}`}
            onClick={() => setStatusTab('resolved')}
          >
            Resolved ({resolvedCount})
          </button>
        </div>

        <div className="tracker-filters-right">
          <div className="search-wrap-sm">
            <Search size={14} className="search-icon" />
            <input 
              type="text"
              placeholder="Search ticket, room or equipment..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="search-input-sm"
            />
          </div>

          <select 
            value={selectedBuilding} 
            onChange={e => setSelectedBuilding(e.target.value)}
            className="filter-select-sm"
          >
            <option value="all">All Blocks</option>
            {buildings.map(b => (
              <option key={b.id} value={b.code}>{b.short_name || b.name}</option>
            ))}
          </select>

          <select 
            value={selectedPriority} 
            onChange={e => setSelectedPriority(e.target.value)}
            className="filter-select-sm"
          >
            <option value="all">All Priorities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* Issues Table / Cards List */}
      <div className="issues-tracker-list">
        {filteredIssues.length > 0 ? (
          filteredIssues.map((issue) => {
            const CatIcon = CATEGORY_ICONS[issue.category] || Wrench;

            return (
              <div key={issue.id} className={`issue-row-card priority-${issue.priority}`}>
                <div className="issue-row-icon">
                  <CatIcon size={20} />
                </div>

                <div className="issue-row-main">
                  <div className="issue-row-header">
                    <span className="issue-code">{issue.ticket_id}</span>
                    <span className="issue-room-badge">{issue.building_code} • {issue.room_number}</span>
                    <span className={`issue-priority-badge priority-${issue.priority}`}>
                      {issue.priority_display || issue.priority}
                    </span>
                    <span className={`issue-status-badge status-${issue.status}`}>
                      {issue.status_display || issue.status}
                    </span>
                    <span className="issue-date">{new Date(issue.created_at).toLocaleString()}</span>
                  </div>

                  <h4 className="issue-row-title">{issue.title}</h4>
                  <p className="issue-row-desc">{issue.description}</p>

                  <div className="issue-row-footer">
                    <div className="reporter-info">
                      <span>Reported by: <strong>{issue.reported_by_name}</strong></span>
                    </div>

                    {issue.assigned_technician && (
                      <div className="assigned-info">
                        <UserCheck size={14} />
                        <span>Assigned to: <strong>{issue.assigned_technician}</strong></span>
                      </div>
                    )}

                    {issue.resolution_notes && (
                      <div className="resolution-notes-chip">
                        <span>Notes: {issue.resolution_notes}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="issue-row-actions">
                  {issue.status !== 'resolved' ? (
                    <button 
                      onClick={() => onResolveIssue(issue.id)}
                      className="btn-mark-resolved"
                    >
                      <CheckCircle2 size={15} />
                      <span>Resolve</span>
                    </button>
                  ) : (
                    <span className="text-emerald-400 font-medium text-xs flex items-center gap-1">
                      <CheckCircle2 size={14} /> Resolved
                    </span>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="empty-state-view">
            <CheckCircle2 size={42} className="text-emerald-400 mb-2" />
            <h3>No issues found matching your filter</h3>
            <p>All facilities in the selected blocks are running in optimal condition.</p>
          </div>
        )}
      </div>
    </div>
  );
}
