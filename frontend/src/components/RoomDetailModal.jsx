import React, { useState } from 'react';
import { 
  X, 
  Tv, 
  Monitor, 
  Wind, 
  Wifi, 
  Users, 
  Cpu, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Calendar, 
  Layers, 
  Sparkles, 
  ShieldCheck, 
  Wrench,
  Activity,
  Plus
} from 'lucide-react';

export default function RoomDetailModal({ 
  room, 
  onClose, 
  onToggleStatus, 
  onOpenReportIssue,
  onResolveIssue
}) {
  const [activeTab, setActiveTab] = useState('overview'); // overview, schedule, issues
  const [customActivity, setCustomActivity] = useState(room?.current_activity || '');
  const [customInstructor, setCustomInstructor] = useState(room?.current_instructor || '');
  const [customNextTime, setCustomNextTime] = useState(room?.next_available_time || '');
  const [isUpdating, setIsUpdating] = useState(false);

  if (!room) return null;

  const isVacant = room.current_status === 'vacant';

  const handleStatusChange = async (newStatus) => {
    setIsUpdating(true);
    try {
      await onToggleStatus(room, newStatus, {
        activity: customActivity,
        instructor: customInstructor,
        next_available: customNextTime
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-container room-detail-modal" onClick={e => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-title-group">
            <div className="modal-badge-row">
              <span className="badge-building">{room.building_name || room.building_code}</span>
              <span className="badge-floor">{room.floor_number === 0 ? 'Ground Floor' : `Floor ${room.floor_number}`}</span>
              <span className={`status-pill status-${room.current_status}`}>
                {room.current_status?.toUpperCase()}
              </span>
            </div>
            <h2 className="modal-room-title">{room.room_number}: {room.name || room.room_type_display}</h2>
          </div>

          <button onClick={onClose} className="modal-close-btn" aria-label="Close">
            <X size={20} />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="modal-tabs">
          <button 
            className={`modal-tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview & Status
          </button>
          <button 
            className={`modal-tab ${activeTab === 'schedule' ? 'active' : ''}`}
            onClick={() => setActiveTab('schedule')}
          >
            <Calendar size={14} className="inline mr-1" />
            Timetable ({room.schedules?.length || 0})
          </button>
          <button 
            className={`modal-tab ${activeTab === 'issues' ? 'active' : ''}`}
            onClick={() => setActiveTab('issues')}
          >
            <Wrench size={14} className="inline mr-1" />
            Maintenance & Issues ({room.issues?.length || 0})
          </button>
        </div>

        {/* Modal Content */}
        <div className="modal-body">
          {activeTab === 'overview' && (
            <div className="overview-section">
              {/* Quick Status Controller Bar */}
              <div className="status-control-box">
                <span className="control-label">Live Space Status:</span>
                <div className="status-toggle-buttons">
                  <button 
                    className={`status-choice-btn ${room.current_status === 'vacant' ? 'active green' : ''}`}
                    onClick={() => handleStatusChange('vacant')}
                    disabled={isUpdating}
                  >
                    <CheckCircle2 size={16} />
                    <span>Set Vacant / Free</span>
                  </button>

                  <button 
                    className={`status-choice-btn ${room.current_status === 'occupied' ? 'active blue' : ''}`}
                    onClick={() => handleStatusChange('occupied')}
                    disabled={isUpdating}
                  >
                    <Activity size={16} />
                    <span>Set In Session</span>
                  </button>

                  <button 
                    className={`status-choice-btn ${room.current_status === 'reserved' ? 'active amber' : ''}`}
                    onClick={() => handleStatusChange('reserved')}
                    disabled={isUpdating}
                  >
                    <Clock size={16} />
                    <span>Set Reserved</span>
                  </button>

                  <button 
                    className={`status-choice-btn ${room.current_status === 'maintenance' ? 'active red' : ''}`}
                    onClick={() => handleStatusChange('maintenance')}
                    disabled={isUpdating}
                  >
                    <AlertTriangle size={16} />
                    <span>Maintenance</span>
                  </button>
                </div>

                {room.current_status !== 'vacant' && (
                  <div className="custom-activity-inputs">
                    <div className="input-group">
                      <label>Active Subject / Activity:</label>
                      <input 
                        type="text" 
                        placeholder="e.g. CS-301 Cloud Computing Lab"
                        value={customActivity}
                        onChange={e => setCustomActivity(e.target.value)}
                        className="modal-text-input"
                      />
                    </div>
                    <div className="input-row">
                      <div className="input-group">
                        <label>Faculty / In-Charge:</label>
                        <input 
                          type="text" 
                          placeholder="e.g. Prof. Verma"
                          value={customInstructor}
                          onChange={e => setCustomInstructor(e.target.value)}
                          className="modal-text-input"
                        />
                      </div>
                      <div className="input-group">
                        <label>Expected Free At:</label>
                        <input 
                          type="text" 
                          placeholder="e.g. Available at 02:00 PM"
                          value={customNextTime}
                          onChange={e => setCustomNextTime(e.target.value)}
                          className="modal-text-input"
                        />
                      </div>
                    </div>
                    <button 
                      onClick={() => handleStatusChange(room.current_status)}
                      className="btn-update-details"
                      disabled={isUpdating}
                    >
                      Update Current Session Details
                    </button>
                  </div>
                )}
              </div>

              {/* Space Specifications & Equipment Health */}
              <div className="equipment-spec-card">
                <h4 className="section-subtitle">Room Specifications & Equipment Health</h4>
                <div className="spec-grid">
                  <div className="spec-item">
                    <Users size={18} className="text-primary-400" />
                    <div>
                      <span className="spec-val">{room.capacity} Students</span>
                      <span className="spec-lbl">Seating Capacity</span>
                    </div>
                  </div>

                  <div className="spec-item">
                    <Monitor size={18} className="text-purple-400" />
                    <div>
                      <span className="spec-val">{room.workstations_count || '0'} Terminals</span>
                      <span className="spec-lbl">Computer Workstations</span>
                    </div>
                  </div>

                  <div className="spec-item">
                    <Wind size={18} className={room.has_ac ? 'text-emerald-400' : 'text-slate-500'} />
                    <div>
                      <span className="spec-val">{room.has_ac ? 'Active & Working' : 'Non-AC'}</span>
                      <span className="spec-lbl">Air Conditioning</span>
                    </div>
                  </div>

                  <div className="spec-item">
                    <Tv size={18} className={room.has_projector ? 'text-emerald-400' : 'text-slate-500'} />
                    <div>
                      <span className="spec-val">{room.has_projector ? 'HD Projector OK' : 'No Projector'}</span>
                      <span className="spec-lbl">AV Projection</span>
                    </div>
                  </div>

                  <div className="spec-item">
                    <Sparkles size={18} className={room.has_smart_board ? 'text-amber-400' : 'text-slate-500'} />
                    <div>
                      <span className="spec-val">{room.has_smart_board ? 'Installed' : 'Standard Board'}</span>
                      <span className="spec-lbl">Interactive SmartBoard</span>
                    </div>
                  </div>

                  <div className="spec-item">
                    <Wifi size={18} className="text-blue-400" />
                    <div>
                      <span className="spec-val">Wi-Fi 6 AP Online</span>
                      <span className="spec-lbl">Campus Network</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Energy Alert Notice */}
              {room.energy_mode_active && isVacant && (
                <div className="energy-notice-box">
                  <div className="flex items-center gap-2 text-amber-400 font-medium">
                    <AlertTriangle size={18} />
                    <span>Energy Optimization Alert</span>
                  </div>
                  <p className="text-sm text-slate-300 mt-1">
                    This room is currently marked vacant, but power sensors indicate lights/HVAC are still running.
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'schedule' && (
            <div className="schedule-section">
              <h4 className="section-subtitle">Today's Class & Lab Schedule</h4>
              {room.schedules && room.schedules.length > 0 ? (
                <div className="schedule-timeline">
                  {room.schedules.map((item, idx) => (
                    <div key={idx} className="timeline-row">
                      <div className="time-badge">
                        <Clock size={13} />
                        <span>{item.start_time} - {item.end_time}</span>
                      </div>
                      <div className="timeline-content">
                        <span className="timeline-title">{item.title}</span>
                        <div className="timeline-meta">
                          <span className="faculty-chip">{item.faculty_name}</span>
                          {item.batch_info && <span className="batch-chip">{item.batch_info}</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-tab-state">
                  <Calendar size={32} className="text-slate-500 mb-2" />
                  <p>No recurring lectures scheduled for this room today.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'issues' && (
            <div className="issues-section">
              <div className="issues-header-bar">
                <h4 className="section-subtitle">Logged Infrastructure Issues</h4>
                <button 
                  className="btn-add-issue-inline"
                  onClick={() => onOpenReportIssue(room)}
                >
                  <Plus size={14} />
                  <span>Log Issue for {room.room_number}</span>
                </button>
              </div>

              {room.issues && room.issues.length > 0 ? (
                <div className="issues-list">
                  {room.issues.map((issue) => (
                    <div key={issue.id} className={`issue-card-item priority-${issue.priority}`}>
                      <div className="issue-card-top">
                        <div className="issue-info-left">
                          <span className="issue-ticket-code">{issue.ticket_id}</span>
                          <span className={`issue-priority-pill priority-${issue.priority}`}>
                            {issue.priority_display || issue.priority}
                          </span>
                          <span className={`issue-status-pill status-${issue.status}`}>
                            {issue.status_display || issue.status}
                          </span>
                        </div>
                        <span className="issue-time">{new Date(issue.created_at).toLocaleDateString()}</span>
                      </div>

                      <h5 className="issue-title-text">{issue.title}</h5>
                      <p className="issue-desc-text">{issue.description}</p>

                      {issue.assigned_technician && (
                        <div className="issue-assigned-tag">
                          <span>Technician: <strong>{issue.assigned_technician}</strong></span>
                        </div>
                      )}

                      {issue.status !== 'resolved' && (
                        <div className="issue-actions-row">
                          <button 
                            className="btn-resolve-issue-sm"
                            onClick={() => onResolveIssue(issue.id)}
                          >
                            <CheckCircle2 size={13} />
                            <span>Mark Resolved</span>
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-tab-state">
                  <ShieldCheck size={36} className="text-emerald-400 mb-2" />
                  <p className="text-emerald-300 font-medium">All Equipment & Facilities Working</p>
                  <p className="text-slate-400 text-xs">No active maintenance issues logged for this room.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="modal-footer">
          <button onClick={() => onOpenReportIssue(room)} className="btn-secondary">
            <Wrench size={15} />
            <span>Report Equipment Issue</span>
          </button>

          <button onClick={onClose} className="btn-primary">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
