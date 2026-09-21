import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  ArrowLeft, 
  Layers, 
  Search, 
  Filter, 
  Monitor, 
  Tv, 
  Cpu, 
  CheckCircle2, 
  AlertTriangle, 
  Clock,
  Sparkles
} from 'lucide-react';
import RoomCard from './RoomCard';

export default function BuildingView({ 
  building, 
  buildings,
  onBackToMap, 
  onSelectBuilding, 
  onInspectRoom, 
  onToggleRoomStatus, 
  onReportIssue 
}) {
  const [selectedFloor, setSelectedFloor] = useState(0);
  const [roomFilter, setRoomFilter] = useState('all'); // all, vacant, occupied, labs, classrooms
  const [searchQuery, setSearchQuery] = useState('');

  // Reset floor when building changes
  useEffect(() => {
    setSelectedFloor(0);
    setRoomFilter('all');
    setSearchQuery('');
  }, [building?.id]);

  if (!building) {
    return (
      <div className="empty-state-view">
        <Building2 size={48} className="text-slate-500 mb-3" />
        <h3>Select a Building to Inspect</h3>
        <p>Choose any academic block from the top selector or return to the campus map.</p>
        <button onClick={onBackToMap} className="btn-primary mt-4">
          <ArrowLeft size={16} /> Open Campus Map
        </button>
      </div>
    );
  }

  // Extract rooms for selected building
  const allRooms = building.rooms || [];

  // Filter rooms by floor and criteria
  const floorRooms = allRooms.filter(r => {
    const matchesFloor = r.floor_number === selectedFloor;
    if (!matchesFloor) return false;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchText = `${r.room_number} ${r.name} ${r.current_activity || ''} ${r.current_instructor || ''}`.toLowerCase();
      if (!matchText.includes(q)) return false;
    }

    if (roomFilter === 'vacant') return r.current_status === 'vacant';
    if (roomFilter === 'occupied') return r.current_status === 'occupied';
    if (roomFilter === 'labs') return ['computer_lab', 'ai_gpu_lab', 'hardware_lab', 'mechanical_lab', 'science_lab'].includes(r.room_type);
    if (roomFilter === 'classrooms') return ['smart_classroom', 'lecture_hall', 'seminar_hall'].includes(r.room_type);
    if (roomFilter === 'issues') return r.active_issues_count > 0;

    return true;
  });

  // Calculate floor summary
  const floorTotal = allRooms.filter(r => r.floor_number === selectedFloor).length;
  const floorVacant = allRooms.filter(r => r.floor_number === selectedFloor && r.current_status === 'vacant').length;
  const floorOccupied = allRooms.filter(r => r.floor_number === selectedFloor && r.current_status === 'occupied').length;

  return (
    <div className="building-view-container">
      {/* Building Header Banner */}
      <div className="building-hero-banner" style={{ borderColor: `${building.color_accent || '#3b82f6'}40` }}>
        <div className="hero-top-row">
          <button onClick={onBackToMap} className="btn-back-map">
            <ArrowLeft size={16} />
            <span>Campus Map</span>
          </button>

          {/* Quick Building Dropdown Switcher */}
          <div className="building-quick-switcher">
            <span className="switcher-label">Switch Block:</span>
            <select 
              value={building.id} 
              onChange={(e) => {
                const target = buildings.find(b => b.id === parseInt(e.target.value));
                if (target) onSelectBuilding(target);
              }}
              className="building-select-dropdown"
            >
              {buildings.map(b => (
                <option key={b.id} value={b.id}>
                  {b.short_name || b.name} ({b.code})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="hero-main-content">
          <div className="hero-title-group">
            <div className="hero-code-badge" style={{ backgroundColor: `${building.color_accent || '#3b82f6'}20`, color: building.color_accent || '#60a5fa' }}>
              {building.code}
            </div>
            <div>
              <h1 className="hero-building-title">{building.name}</h1>
              <p className="hero-building-subtitle">{building.description || building.wing_or_zone}</p>
            </div>
          </div>

          <div className="hero-stats-cards">
            <div className="hero-stat-card">
              <span className="hero-stat-num text-emerald-400">{building.vacant_rooms}</span>
              <span className="hero-stat-label">Vacant Rooms</span>
            </div>
            <div className="hero-stat-card">
              <span className="hero-stat-num text-blue-400">{building.occupied_rooms}</span>
              <span className="hero-stat-label">In Session</span>
            </div>
            <div className="hero-stat-card">
              <span className="hero-stat-num text-purple-400">{building.total_rooms}</span>
              <span className="hero-stat-label">Total Rooms</span>
            </div>
            {building.active_issues > 0 && (
              <div className="hero-stat-card border-amber">
                <span className="hero-stat-num text-amber-400">{building.active_issues}</span>
                <span className="hero-stat-label">Maintenance</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floor Selector Tab Bar */}
      <div className="floor-navigation-bar">
        <div className="floor-tabs-list">
          <span className="floor-nav-label">
            <Layers size={16} />
            <span>Select Floor:</span>
          </span>

          {Array.from({ length: building.total_floors + 1 }).map((_, floorIdx) => {
            const countForFloor = allRooms.filter(r => r.floor_number === floorIdx).length;
            const vacantForFloor = allRooms.filter(r => r.floor_number === floorIdx && r.current_status === 'vacant').length;
            
            if (countForFloor === 0 && floorIdx > 0) return null;

            return (
              <button
                key={floorIdx}
                className={`floor-tab-btn ${selectedFloor === floorIdx ? 'active' : ''}`}
                onClick={() => setSelectedFloor(floorIdx)}
              >
                <span className="floor-name">{floorIdx === 0 ? 'Ground Floor' : `Floor ${floorIdx}`}</span>
                <span className="floor-mini-stat">
                  <span className="text-emerald-400">{vacantForFloor} Free</span> / {countForFloor}
                </span>
              </button>
            );
          })}
        </div>

        {/* Floor Quick Summary */}
        <div className="floor-summary-pill">
          <span>{selectedFloor === 0 ? 'Ground Floor' : `Floor ${selectedFloor}`} Overview: </span>
          <strong className="text-emerald-400">{floorVacant} Vacant</strong>
          <span className="mx-1">•</span>
          <strong className="text-blue-400">{floorOccupied} Occupied</strong>
          <span className="mx-1">•</span>
          <span>{floorTotal} Total Spaces</span>
        </div>
      </div>

      {/* Floor Room Filters & Search Bar */}
      <div className="room-filters-bar">
        <div className="search-input-wrap">
          <Search size={16} className="search-icon" />
          <input 
            type="text"
            placeholder={`Search rooms or lectures on ${selectedFloor === 0 ? 'Ground Floor' : `Floor ${selectedFloor}`}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="room-search-input"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="clear-search-btn">✕</button>
          )}
        </div>

        <div className="filter-button-group">
          <button 
            className={`btn-subfilter ${roomFilter === 'all' ? 'active' : ''}`}
            onClick={() => setRoomFilter('all')}
          >
            All Spaces ({floorTotal})
          </button>
          <button 
            className={`btn-subfilter ${roomFilter === 'vacant' ? 'active' : ''}`}
            onClick={() => setRoomFilter('vacant')}
          >
            <span className="dot dot-green"></span>
            Vacant Only ({floorVacant})
          </button>
          <button 
            className={`btn-subfilter ${roomFilter === 'labs' ? 'active' : ''}`}
            onClick={() => setRoomFilter('labs')}
          >
            <Cpu size={14} />
            Labs
          </button>
          <button 
            className={`btn-subfilter ${roomFilter === 'classrooms' ? 'active' : ''}`}
            onClick={() => setRoomFilter('classrooms')}
          >
            <Tv size={14} />
            Classrooms
          </button>
          <button 
            className={`btn-subfilter ${roomFilter === 'issues' ? 'active' : ''}`}
            onClick={() => setRoomFilter('issues')}
          >
            <AlertTriangle size={14} className="text-amber-400" />
            Issues Logged
          </button>
        </div>
      </div>

      {/* Room Cards Grid */}
      <div className="rooms-grid">
        {floorRooms.length > 0 ? (
          floorRooms.map(room => (
            <RoomCard 
              key={room.id}
              room={room}
              onInspect={onInspectRoom}
              onToggleStatus={onToggleRoomStatus}
              onReportIssue={onReportIssue}
            />
          ))
        ) : (
          <div className="no-rooms-message">
            <Building2 size={36} className="text-slate-500 mb-2" />
            <h4>No matching rooms found on this floor</h4>
            <p>Try clearing filters or switching to another floor.</p>
            <button 
              onClick={() => { setRoomFilter('all'); setSearchQuery(''); }}
              className="btn-secondary mt-2"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
