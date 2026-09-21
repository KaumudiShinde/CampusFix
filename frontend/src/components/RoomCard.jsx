import React from 'react';
import { 
  Monitor, 
  Tv, 
  Wind, 
  Wifi, 
  Users, 
  Cpu, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Layers, 
  Sparkles,
  Zap,
  MoreVertical,
  Activity
} from 'lucide-react';

const TYPE_CONFIG = {
  smart_classroom: { label: 'Smart Classroom', color: '#3b82f6', icon: Tv },
  lecture_hall: { label: 'Lecture Theatre', color: '#6366f1', icon: Users },
  computer_lab: { label: 'Computer Lab', color: '#8b5cf6', icon: Monitor },
  ai_gpu_lab: { label: 'AI Supercomputing Lab', color: '#ec4899', icon: Cpu },
  hardware_lab: { label: 'IoT & Hardware Lab', color: '#f59e0b', icon: Cpu },
  mechanical_lab: { label: 'Robotics & Mechanical', color: '#10b981', icon: Cpu },
  science_lab: { label: 'Research Lab', color: '#06b6d4', icon: Sparkles },
  seminar_hall: { label: 'Seminar Hall', color: '#eab308', icon: Users },
  auditorium: { label: 'Auditorium', color: '#ef4444', icon: Users },
};

const STATUS_CONFIG = {
  vacant: { label: 'VACANT / AVAILABLE', class: 'status-vacant', dotColor: '#10b981' },
  occupied: { label: 'IN SESSION', class: 'status-occupied', dotColor: '#3b82f6' },
  reserved: { label: 'RESERVED', class: 'status-reserved', dotColor: '#f59e0b' },
  maintenance: { label: 'MAINTENANCE', class: 'status-maintenance', dotColor: '#ef4444' },
};

export default function RoomCard({ room, onInspect, onToggleStatus, onReportIssue }) {
  const typeInfo = TYPE_CONFIG[room.room_type] || TYPE_CONFIG.smart_classroom;
  const statusInfo = STATUS_CONFIG[room.current_status] || STATUS_CONFIG.vacant;
  const TypeIcon = typeInfo.icon;

  const isVacant = room.current_status === 'vacant';

  return (
    <div className={`room-card ${statusInfo.class}`}>
      {/* Top Header */}
      <div className="room-card-header">
        <div className="room-identity">
          <span className="room-number">{room.room_number}</span>
          <span className="room-building-code">{room.building_code || room.building_name}</span>
        </div>

        <div className={`room-status-badge ${statusInfo.class}`}>
          <span className="status-dot"></span>
          <span>{statusInfo.label}</span>
        </div>
      </div>

      {/* Room Name & Type */}
      <div className="room-card-body">
        <div className="room-type-tag" style={{ color: typeInfo.color, borderColor: `${typeInfo.color}30`, backgroundColor: `${typeInfo.color}15` }}>
          <TypeIcon size={13} />
          <span>{room.name || typeInfo.label}</span>
        </div>

        {/* Current Activity / Session Info */}
        <div className="room-session-info">
          {isVacant ? (
            <div className="session-vacant">
              <CheckCircle size={15} className="text-emerald-400" />
              <div>
                <span className="session-title text-emerald-300">Free to Use</span>
                <span className="session-sub">{room.next_available_time || 'Available now for lectures/study'}</span>
              </div>
            </div>
          ) : (
            <div className="session-occupied">
              <Activity size={15} className={room.current_status === 'maintenance' ? 'text-red-400' : 'text-blue-400'} />
              <div>
                <span className="session-title">{room.current_activity || 'In Session'}</span>
                {room.current_instructor && (
                  <span className="session-sub">{room.current_instructor}</span>
                )}
                {room.next_available_time && (
                  <span className="session-time-chip">
                    <Clock size={11} /> {room.next_available_time}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Specs & Amenities */}
        <div className="room-amenities-row">
          <div className="amenity-chip" title="Seating Capacity">
            <Users size={13} />
            <span>{room.capacity} seats</span>
          </div>

          {room.workstations_count > 0 && (
            <div className="amenity-chip highlight" title="Computer Terminals">
              <Monitor size={13} />
              <span>{room.workstations_count} PCs</span>
            </div>
          )}

          {room.has_ac && (
            <div className="amenity-chip" title="Air Conditioned">
              <Wind size={13} />
              <span>AC</span>
            </div>
          )}

          {room.has_projector && (
            <div className="amenity-chip" title="HD Projector">
              <Tv size={13} />
              <span>Projector</span>
            </div>
          )}

          {room.has_smart_board && (
            <div className="amenity-chip" title="Interactive Smart Board">
              <Sparkles size={13} />
              <span>SmartBoard</span>
            </div>
          )}
        </div>

        {/* Live Sensor Data */}
        {!isVacant && room.last_sensor_update && (
          <div className="room-live-data" style={{ marginTop: '12px', padding: '10px', backgroundColor: '#1e293b', borderRadius: '8px', border: '1px solid #334155' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '12px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Users size={12} /> Live Occupancy
              </span>
              <strong style={{ fontSize: '13px', color: '#e2e8f0' }}>{room.current_occupancy} / {room.capacity}</strong>
            </div>
            <div style={{ width: '100%', height: '4px', backgroundColor: '#334155', borderRadius: '2px', marginBottom: '12px' }}>
              <div style={{ height: '100%', backgroundColor: (room.current_occupancy / room.capacity) > 0.8 ? '#ef4444' : '#3b82f6', width: `${Math.min(100, (room.current_occupancy / room.capacity) * 100)}%`, borderRadius: '2px' }}></div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '12px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Activity size={12} /> Engagement
              </span>
              <strong style={{ fontSize: '13px', color: room.engagement_score > 70 ? '#10b981' : '#f59e0b' }}>{room.engagement_score}%</strong>
            </div>
            <div style={{ width: '100%', height: '4px', backgroundColor: '#334155', borderRadius: '2px' }}>
              <div style={{ height: '100%', backgroundColor: room.engagement_score > 70 ? '#10b981' : '#f59e0b', width: `${room.engagement_score}%`, borderRadius: '2px' }}></div>
            </div>
          </div>
        )}
        
        {/* Alerts & Issue Indicators */}
        {room.active_issues_count > 0 && (
          <div className="room-issue-banner">
            <AlertTriangle size={13} className="text-amber-400" />
            <span>{room.active_issues_count} Facility Issue Logged</span>
          </div>
        )}

        {room.energy_mode_active && isVacant && (
          <div className="room-energy-warning">
            <Zap size={13} className="text-amber-400" />
            <span>Power & AC Running while Vacant</span>
          </div>
        )}
      </div>

      {/* Card Action Buttons */}
      <div className="room-card-footer">
        <button 
          className="btn-card-secondary"
          onClick={() => onInspect(room)}
        >
          Details & Schedule
        </button>

        <button 
          className={`btn-card-toggle ${isVacant ? 'btn-occupy' : 'btn-release'}`}
          onClick={() => onToggleStatus(room, isVacant ? 'occupied' : 'vacant')}
        >
          {isVacant ? 'Check-In' : 'Set Vacant'}
        </button>
      </div>
    </div>
  );
}
