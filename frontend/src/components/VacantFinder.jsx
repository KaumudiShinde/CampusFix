import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Sparkles, 
  Building2, 
  Monitor, 
  Tv, 
  Wind, 
  Users, 
  Cpu, 
  CheckCircle2, 
  RotateCcw,
  Layers,
  ArrowUpDown
} from 'lucide-react';
import RoomCard from './RoomCard';

export default function VacantFinder({ 
  rooms, 
  buildings, 
  onInspectRoom, 
  onToggleRoomStatus, 
  onReportIssue 
}) {
  const [search, setSearch] = useState('');
  const [selectedBuilding, setSelectedBuilding] = useState('all');
  const [selectedType, setSelectedType] = useState('all'); // all, lab, classroom, seminar
  const [minCapacity, setMinCapacity] = useState(0);
  const [requireAC, setRequireAC] = useState(false);
  const [requireProjector, setRequireProjector] = useState(false);
  const [requireSmartBoard, setRequireSmartBoard] = useState(false);
  const [requireWorkstations, setRequireWorkstations] = useState(false);
  const [onlyVacant, setOnlyVacant] = useState(true);
  const [sortBy, setSortBy] = useState('vacant_first'); // vacant_first, capacity_desc, name_asc

  // Filtered and Sorted Rooms
  const filteredRooms = useMemo(() => {
    return rooms.filter(r => {
      // Vacancy Filter
      if (onlyVacant && r.current_status !== 'vacant') return false;

      // Building Filter
      if (selectedBuilding !== 'all') {
        if (r.building_code !== selectedBuilding && String(r.building) !== String(selectedBuilding)) {
          return false;
        }
      }

      // Space Type Filter
      if (selectedType === 'lab') {
        if (!['computer_lab', 'ai_gpu_lab', 'hardware_lab', 'mechanical_lab', 'science_lab'].includes(r.room_type)) {
          return false;
        }
      } else if (selectedType === 'classroom') {
        if (!['smart_classroom', 'lecture_hall'].includes(r.room_type)) return false;
      } else if (selectedType === 'seminar') {
        if (!['seminar_hall', 'auditorium'].includes(r.room_type)) return false;
      }

      // Capacity
      if (minCapacity > 0 && r.capacity < minCapacity) return false;

      // Amenities
      if (requireAC && !r.has_ac) return false;
      if (requireProjector && !r.has_projector) return false;
      if (requireSmartBoard && !r.has_smart_board) return false;
      if (requireWorkstations && (!r.workstations_count || r.workstations_count === 0)) return false;

      // Search Query
      if (search.trim()) {
        const q = search.toLowerCase();
        const fullStr = `${r.room_number} ${r.name} ${r.building_name} ${r.building_code} ${r.room_type_display} ${r.current_activity || ''}`.toLowerCase();
        if (!fullStr.includes(q)) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'vacant_first') {
        if (a.current_status === 'vacant' && b.current_status !== 'vacant') return -1;
        if (a.current_status !== 'vacant' && b.current_status === 'vacant') return 1;
        return a.room_number.localeCompare(b.room_number);
      }
      if (sortBy === 'capacity_desc') return b.capacity - a.capacity;
      if (sortBy === 'name_asc') return a.room_number.localeCompare(b.room_number);
      return 0;
    });
  }, [
    rooms, 
    search, 
    selectedBuilding, 
    selectedType, 
    minCapacity, 
    requireAC, 
    requireProjector, 
    requireSmartBoard, 
    requireWorkstations, 
    onlyVacant, 
    sortBy
  ]);

  const vacantCount = filteredRooms.filter(r => r.current_status === 'vacant').length;

  const resetFilters = () => {
    setSearch('');
    setSelectedBuilding('all');
    setSelectedType('all');
    setMinCapacity(0);
    setRequireAC(false);
    setRequireProjector(false);
    setRequireSmartBoard(false);
    setRequireWorkstations(false);
    setOnlyVacant(true);
    setSortBy('vacant_first');
  };

  return (
    <div className="finder-container">
      {/* Search & Filter Header Card */}
      <div className="finder-control-panel">
        <div className="finder-header-row">
          <div className="finder-title-group">
            <h2 className="finder-title">Smart Campus Space & Lab Finder</h2>
            <p className="finder-subtitle">
              Locate available classrooms, computing clusters, and seminar halls across MIT-WPU in real time.
            </p>
          </div>

          <div className="finder-results-badge">
            <span className="results-count text-emerald-400">{vacantCount}</span>
            <span className="results-label">Spaces Available Now</span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="finder-search-row">
          <div className="search-bar-wrap">
            <Search size={18} className="search-icon" />
            <input 
              type="text"
              placeholder="Search by room number (e.g. R-101, S-204), lab type, or equipment..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="finder-search-input"
            />
            {search && (
              <button onClick={() => setSearch('')} className="clear-btn">✕</button>
            )}
          </div>

          <div className="quick-toggle-vacant">
            <label className="toggle-label">
              <input 
                type="checkbox"
                checked={onlyVacant}
                onChange={e => setOnlyVacant(e.target.checked)}
                className="checkbox-custom"
              />
              <span className="toggle-text">Show Vacant Only</span>
            </label>
          </div>
        </div>

        {/* Filter Controls Grid */}
        <div className="filter-controls-grid">
          {/* Building Select */}
          <div className="filter-item">
            <label className="filter-label">Building / Block</label>
            <select 
              value={selectedBuilding} 
              onChange={e => setSelectedBuilding(e.target.value)}
              className="filter-select"
            >
              <option value="all">All MIT-WPU Blocks</option>
              {buildings.map(b => (
                <option key={b.id} value={b.code}>
                  {b.short_name || b.name}
                </option>
              ))}
            </select>
          </div>

          {/* Space Type */}
          <div className="filter-item">
            <label className="filter-label">Space Category</label>
            <select 
              value={selectedType} 
              onChange={e => setSelectedType(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Space Types</option>
              <option value="lab">Computer & Research Labs</option>
              <option value="classroom">Smart Classrooms & Lecture Halls</option>
              <option value="seminar">Auditoriums & Seminar Halls</option>
            </select>
          </div>

          {/* Min Capacity */}
          <div className="filter-item">
            <label className="filter-label">Min Seating: {minCapacity > 0 ? `${minCapacity}+ seats` : 'Any'}</label>
            <div className="capacity-buttons">
              {[0, 30, 50, 70, 100].map(cap => (
                <button
                  key={cap}
                  className={`cap-btn ${minCapacity === cap ? 'active' : ''}`}
                  onClick={() => setMinCapacity(cap)}
                >
                  {cap === 0 ? 'Any' : `${cap}+`}
                </button>
              ))}
            </div>
          </div>

          {/* Sort By */}
          <div className="filter-item">
            <label className="filter-label">Sort Order</label>
            <select 
              value={sortBy} 
              onChange={e => setSortBy(e.target.value)}
              className="filter-select"
            >
              <option value="vacant_first">Vacant First</option>
              <option value="capacity_desc">Capacity (High to Low)</option>
              <option value="name_asc">Room Number (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Amenity Feature Chips */}
        <div className="amenity-toggles-row">
          <span className="amenity-row-label">Required Equipment:</span>
          
          <button 
            className={`amenity-toggle-chip ${requireWorkstations ? 'active' : ''}`}
            onClick={() => setRequireWorkstations(!requireWorkstations)}
          >
            <Monitor size={14} />
            <span>Computer PCs</span>
          </button>

          <button 
            className={`amenity-toggle-chip ${requireAC ? 'active' : ''}`}
            onClick={() => setRequireAC(!requireAC)}
          >
            <Wind size={14} />
            <span>Air Conditioning</span>
          </button>

          <button 
            className={`amenity-toggle-chip ${requireProjector ? 'active' : ''}`}
            onClick={() => setRequireProjector(!requireProjector)}
          >
            <Tv size={14} />
            <span>HD Projector</span>
          </button>

          <button 
            className={`amenity-toggle-chip ${requireSmartBoard ? 'active' : ''}`}
            onClick={() => setRequireSmartBoard(!requireSmartBoard)}
          >
            <Sparkles size={14} />
            <span>Smart Board</span>
          </button>

          <button 
            onClick={resetFilters}
            className="btn-reset-filters"
            title="Clear all filters"
          >
            <RotateCcw size={13} />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Results Header */}
      <div className="finder-results-bar">
        <span>Found <strong>{filteredRooms.length}</strong> matching rooms & labs:</span>
      </div>

      {/* Room Cards Grid */}
      <div className="rooms-grid">
        {filteredRooms.length > 0 ? (
          filteredRooms.map(room => (
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
            <Building2 size={40} className="text-slate-500 mb-2" />
            <h4>No available spaces match your criteria</h4>
            <p>Try lowering capacity requirements or unchecking equipment filters.</p>
            <button onClick={resetFilters} className="btn-secondary mt-3">
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
