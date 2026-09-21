import React, { useState } from 'react';
import { 
  X, 
  Wrench, 
  Tv, 
  Monitor, 
  Wind, 
  Wifi, 
  Zap, 
  Layers, 
  AlertTriangle,
  Building2,
  CheckCircle2
} from 'lucide-react';

const CATEGORIES = [
  { id: 'projector_av', label: 'Projector & AV System', icon: Tv },
  { id: 'workstation_pc', label: 'Workstations / Computers', icon: Monitor },
  { id: 'ac_cooling', label: 'AC & Ventilation', icon: Wind },
  { id: 'network_wifi', label: 'Wi-Fi & LAN Network', icon: Wifi },
  { id: 'electrical_power', label: 'Power & Lights', icon: Zap },
  { id: 'furniture', label: 'Chairs & Furniture', icon: Layers },
  { id: 'lab_equipment', label: 'Lab Hardware / Kits', icon: Wrench },
  { id: 'other', label: 'Other Facility Issue', icon: AlertTriangle },
];

export default function ReportIssueModal({ 
  rooms, 
  buildings, 
  presetRoom, 
  onClose, 
  onSubmitIssue 
}) {
  const [selectedRoomId, setSelectedRoomId] = useState(presetRoom?.id || (rooms[0]?.id || ''));
  const [category, setCategory] = useState('projector_av');
  const [priority, setPriority] = useState('medium');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [reporterName, setReporterName] = useState('MIT-WPU Faculty / Student');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !selectedRoomId) {
      alert('Please fill all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmitIssue({
        room: selectedRoomId,
        category,
        priority,
        title,
        description,
        reported_by_name: reporterName,
      });
      onClose();
    } catch (err) {
      alert('Failed to log issue: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-container report-issue-modal" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-group">
            <span className="badge-pill bg-amber">FACILITY MAINTENANCE TICKET</span>
            <h2 className="modal-room-title">Report Infrastructure / Lab Issue</h2>
          </div>

          <button onClick={onClose} className="modal-close-btn">
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="modal-body">
          {/* Target Room */}
          <div className="form-group">
            <label className="form-label">Select Room / Lab *</label>
            <select 
              value={selectedRoomId} 
              onChange={e => setSelectedRoomId(e.target.value)}
              className="modal-select"
              required
            >
              {rooms.map(r => (
                <option key={r.id} value={r.id}>
                  {r.building_code} • {r.room_number} - {r.name || r.room_type_display} (Floor {r.floor_number})
                </option>
              ))}
            </select>
          </div>

          {/* Issue Category Grid */}
          <div className="form-group">
            <label className="form-label">Issue Category *</label>
            <div className="category-select-grid">
              {CATEGORIES.map(cat => {
                const Icon = cat.icon;
                const isSelected = category === cat.id;
                return (
                  <button
                    type="button"
                    key={cat.id}
                    className={`category-btn ${isSelected ? 'active' : ''}`}
                    onClick={() => setCategory(cat.id)}
                  >
                    <Icon size={16} />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Priority Level */}
          <div className="form-group">
            <label className="form-label">Priority Level *</label>
            <div className="priority-select-row">
              {[
                { id: 'low', label: 'Low (Non-urgent)', color: 'text-slate-400' },
                { id: 'medium', label: 'Medium (Standard)', color: 'text-blue-400' },
                { id: 'high', label: 'High (Disrupts Class)', color: 'text-amber-400' },
                { id: 'critical', label: 'Critical (Lab Offline)', color: 'text-red-400' },
              ].map(p => (
                <button
                  type="button"
                  key={p.id}
                  className={`priority-btn ${priority === p.id ? `active priority-${p.id}` : ''}`}
                  onClick={() => setPriority(p.id)}
                >
                  <span className={`priority-dot priority-${p.id}`}></span>
                  <span>{p.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Issue Title */}
          <div className="form-group">
            <label className="form-label">Issue Headline / Title *</label>
            <input 
              type="text" 
              placeholder="e.g. HDMI Cable missing / Projector lamp error"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="modal-text-input"
              required
            />
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label">Detailed Description *</label>
            <textarea 
              rows={3}
              placeholder="Provide exact details for technicians (e.g. which row, error codes, specific symptoms)..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="modal-textarea"
              required
            />
          </div>

          {/* Reporter Name */}
          <div className="form-group">
            <label className="form-label">Reported By</label>
            <input 
              type="text" 
              value={reporterName}
              onChange={e => setReporterName(e.target.value)}
              className="modal-text-input"
            />
          </div>

          {/* Actions */}
          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Logging Ticket...' : 'Submit Maintenance Ticket'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
