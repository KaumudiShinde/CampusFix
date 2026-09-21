import React, { useState } from 'react';

export function NewComplaintModal({ isOpen, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'electrical',
    location_building: 'Central Block',
    room_number: '',
    priority: 'medium',
    complainant_name: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description) return;
    onSubmit(formData);
    onClose();
    setFormData({
      title: '',
      description: '',
      category: 'electrical',
      location_building: 'Central Block',
      room_number: '',
      priority: 'medium',
      complainant_name: ''
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content glass-panel animate-fade-in">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2>Submit Infrastructure Complaint</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Issue Title</label>
            <input 
              className="form-input" 
              type="text" 
              placeholder="e.g. Projector power fault in Seminar Hall 2" 
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select 
                className="form-select"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="electrical">⚡ Electrical / Power</option>
                <option value="plumbing">💧 Plumbing & Water</option>
                <option value="furniture">🪑 Furniture & Amenities</option>
                <option value="it_network">💻 IT & Wi-Fi Network</option>
                <option value="lab">🔬 Lab Equipment</option>
                <option value="cleanliness">🧹 Hygiene / Housekeeping</option>
                <option value="civil">🏗 Civil & Structure</option>
                <option value="other">📌 Other</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Priority Level</label>
              <select 
                className="form-select"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent / Emergency</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Building / Block</label>
              <input 
                className="form-input" 
                type="text" 
                placeholder="e.g. Tech Block B" 
                value={formData.location_building}
                onChange={(e) => setFormData({ ...formData, location_building: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Room / Lab Number</label>
              <input 
                className="form-input" 
                type="text" 
                placeholder="e.g. Lab 304" 
                value={formData.room_number}
                onChange={(e) => setFormData({ ...formData, room_number: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Your Name / Student ID (Optional)</label>
            <input 
              className="form-input" 
              type="text" 
              placeholder="e.g. Rahul Sharma (CS2024-042)" 
              value={formData.complainant_name}
              onChange={(e) => setFormData({ ...formData, complainant_name: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Detailed Description</label>
            <textarea 
              className="form-textarea" 
              rows="4"
              placeholder="Provide exact details of the broken asset or issue..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            ></textarea>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Submit Ticket</button>
          </div>
        </form>
      </div>
    </div>
  );
}
