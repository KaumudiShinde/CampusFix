import React, { useState, useEffect, useRef } from 'react';
import { 
  Building2, 
  Cpu, 
  Terminal, 
  Briefcase, 
  Landmark, 
  Palette, 
  Mic2, 
  BookOpen, 
  Trophy, 
  AlertTriangle, 
  CheckCircle2, 
  Users, 
  Layers, 
  ArrowRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Compass,
  Zap,
  Info,
  Sparkles,
  Map as MapIcon,
  Navigation,
  ExternalLink,
  LocateFixed,
  Footprints,
  Clock,
  Layers as LayersIcon
} from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const ICON_MAP = {
  Building2: Building2,
  Cpu: Cpu,
  Terminal: Terminal,
  Briefcase: Briefcase,
  Landmark: Landmark,
  Palette: Palette,
  Mic2: Mic2,
  BookOpen: BookOpen,
  Trophy: Trophy,
  Sparkles: Sparkles,
};

// MIT-WPU Campus Center & Key Waypoints (Kothrud, Pune)
const MIT_CENTER = [18.5186, 73.8153];
const GATE_1_PAUD_ROAD = [18.5202, 73.8155];

export default function CampusMap({ buildings, onSelectBuilding, onOpenReportModal }) {
  const [mapMode, setMapMode] = useState('geo'); // 'geo' (Leaflet/Google Satellite/OSM) or 'blueprint' (2.5D schematic)
  const [tileLayerType, setTileLayerType] = useState('satellite'); // 'satellite', 'dark', 'streets'
  const [filter, setFilter] = useState('all'); // all, vacant, labs, issues
  const [hoveredBuilding, setHoveredBuilding] = useState(null);
  const [selectedForNavigation, setSelectedForNavigation] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [navigationRoute, setNavigationRoute] = useState(null);

  const leafletMapRef = useRef(null);
  const mapContainerRef = useRef(null);
  const markersRef = useRef([]);
  const routePolylineRef = useRef(null);

  // Filter logic
  const filteredBuildings = buildings.filter(b => {
    if (filter === 'vacant') return b.vacant_rooms > 0;
    if (filter === 'issues') return b.active_issues > 0;
    if (filter === 'labs') return ['VYAS', 'RAMANUJAN', 'SARASWATI', 'ATRI', 'ARYABHATTA'].includes(b.code);
    return true;
  });

  const getStatusColor = (b) => {
    if (b.active_issues > 0) return '#f59e0b';
    if (b.vacant_rooms > 2) return '#10b981';
    return '#3b82f6';
  };

  // Initialize and update Leaflet Geo Map
  useEffect(() => {
    if (mapMode !== 'geo' || !mapContainerRef.current) return;

    if (!leafletMapRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: MIT_CENTER,
        zoom: 17,
        maxZoom: 20,
        minZoom: 15,
        zoomControl: false,
      });

      L.control.zoom({ position: 'bottomright' }).addTo(map);
      leafletMapRef.current = map;
    }

    const map = leafletMapRef.current;

    // Tile layers configuration
    map.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) {
        map.removeLayer(layer);
      }
    });

    let tileUrl = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
    let attribution = '&copy; OpenStreetMap contributors &copy; CARTO';

    if (tileLayerType === 'satellite') {
      // Google Satellite Hybrid tiles
      tileUrl = 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}';
      attribution = '&copy; Google Maps';
    } else if (tileLayerType === 'dark') {
      // Dark Matter
      tileUrl = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
      attribution = '&copy; OpenStreetMap &copy; CARTO';
    }

    L.tileLayer(tileUrl, {
      maxZoom: 20,
      attribution,
    }).addTo(map);

    // Clear old markers
    markersRef.current.forEach(m => map.removeLayer(m));
    markersRef.current = [];

    // Add Gate 1 Pin
    const gateIcon = L.divIcon({
      className: 'custom-gate-pin',
      html: `<div class="gate-marker-badge">🚪 Gate 1 (Paud Rd)</div>`,
      iconSize: [120, 30],
      iconAnchor: [60, 15]
    });
    const gateMarker = L.marker(GATE_1_PAUD_ROAD, { icon: gateIcon }).addTo(map);
    markersRef.current.push(gateMarker);

    // Add Markers for all buildings
    filteredBuildings.forEach((b) => {
      if (!b.latitude || !b.longitude) return;

      const statusColor = getStatusColor(b);
      const isSelected = selectedForNavigation?.id === b.id;

      const customHtml = `
        <div class="leaflet-building-pin ${isSelected ? 'active-pin' : ''}" style="--accent-pin: ${statusColor};">
          <div class="pin-pulse"></div>
          <div class="pin-inner">
            <span class="pin-code">${b.code}</span>
            <span class="pin-vacant-chip">${b.vacant_rooms} Free</span>
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'custom-map-icon',
        html: customHtml,
        iconSize: [64, 40],
        iconAnchor: [32, 20],
      });

      const marker = L.marker([b.latitude, b.longitude], { icon: customIcon }).addTo(map);

      marker.on('click', () => {
        setHoveredBuilding(b);
      });

      markersRef.current.push(marker);
    });

    // Draw route if navigating
    if (routePolylineRef.current) {
      map.removeLayer(routePolylineRef.current);
      routePolylineRef.current = null;
    }

    if (navigationRoute && selectedForNavigation) {
      const latlngs = [
        GATE_1_PAUD_ROAD,
        [18.5190, 73.8154], // Campus Central Walkway waypoint
        [selectedForNavigation.latitude, selectedForNavigation.longitude]
      ];

      const polyline = L.polyline(latlngs, {
        color: '#38bdf8',
        weight: 5,
        opacity: 0.9,
        dashArray: '10, 10',
        lineCap: 'round',
      }).addTo(map);

      routePolylineRef.current = polyline;
      map.fitBounds(polyline.getBounds(), { padding: [60, 60] });
    }

  }, [mapMode, tileLayerType, filteredBuildings, selectedForNavigation, navigationRoute]);

  // Clean up Leaflet on unmount
  useEffect(() => {
    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, []);

  // Handle Get Directions to Building
  const handleStartNavigation = (b) => {
    setSelectedForNavigation(b);
    setHoveredBuilding(b);
    setNavigationRoute({
      start: 'Gate 1 (Paud Road)',
      destination: b.name,
      distance: '240 meters',
      walkTime: '3 mins walk',
      steps: [
        'Enter through MIT-WPU Main Entrance (Gate 1, Paud Road)',
        'Walk south along the Central Academic Walkway towards Peace Dome Plaza',
        `Reach ${b.short_name || b.name} on your ${b.map_x > 50 ? 'left' : 'right'}`
      ]
    });
    if (mapMode !== 'geo') setMapMode('geo');
  };

  const handleClearNavigation = () => {
    setSelectedForNavigation(null);
    setNavigationRoute(null);
    if (routePolylineRef.current && leafletMapRef.current) {
      leafletMapRef.current.removeLayer(routePolylineRef.current);
      routePolylineRef.current = null;
    }
  };

  return (
    <div className="campus-map-view">
      {/* Map Control Toolbar */}
      <div className="map-toolbar">
        <div className="toolbar-left">
          <div className="map-title-chip">
            <Compass size={18} className="text-primary-400" />
            <span>MIT-WPU Campus Map (Kothrud, Pune)</span>
          </div>

          {/* Mode Switcher */}
          <div className="map-mode-switch">
            <button 
              className={`mode-btn ${mapMode === 'geo' ? 'active' : ''}`}
              onClick={() => setMapMode('geo')}
            >
              <MapIcon size={14} />
              <span>Google Maps / GPS View</span>
            </button>
            <button 
              className={`mode-btn ${mapMode === 'blueprint' ? 'active' : ''}`}
              onClick={() => setMapMode('blueprint')}
            >
              <LayersIcon size={14} />
              <span>2.5D Blueprint View</span>
            </button>
          </div>

          {/* Geo Tile Switcher (when in Geo mode) */}
          {mapMode === 'geo' && (
            <div className="tile-layer-select">
              <button 
                className={`tile-btn ${tileLayerType === 'satellite' ? 'active' : ''}`}
                onClick={() => setTileLayerType('satellite')}
              >
                🛰️ Satellite
              </button>
              <button 
                className={`tile-btn ${tileLayerType === 'streets' ? 'active' : ''}`}
                onClick={() => setTileLayerType('streets')}
              >
                🗺️ Street Map
              </button>
              <button 
                className={`tile-btn ${tileLayerType === 'dark' ? 'active' : ''}`}
                onClick={() => setTileLayerType('dark')}
              >
                🌙 Dark Cyber
              </button>
            </div>
          )}

          <div className="filter-chips-group">
            <button 
              className={`filter-chip ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All Buildings ({buildings.length})
            </button>
            <button 
              className={`filter-chip ${filter === 'vacant' ? 'active' : ''}`}
              onClick={() => setFilter('vacant')}
            >
              <span className="dot dot-green"></span>
              Available Spaces
            </button>
            <button 
              className={`filter-chip ${filter === 'labs' ? 'active' : ''}`}
              onClick={() => setFilter('labs')}
            >
              <Cpu size={14} className="inline mr-1" />
              Specialized Labs
            </button>
            <button 
              className={`filter-chip ${filter === 'issues' ? 'active' : ''}`}
              onClick={() => setFilter('issues')}
            >
              <AlertTriangle size={14} className="inline mr-1 text-amber-400" />
              Facility Issues
            </button>
          </div>
        </div>

        <div className="toolbar-right">
          {mapMode === 'blueprint' && (
            <div className="zoom-controls">
              <button 
                className="zoom-btn"
                onClick={() => setZoomLevel(prev => Math.min(prev + 0.15, 1.4))}
                title="Zoom In"
              >
                <ZoomIn size={16} />
              </button>
              <button 
                className="zoom-btn"
                onClick={() => setZoomLevel(prev => Math.max(prev - 0.15, 0.85))}
                title="Zoom Out"
              >
                <ZoomOut size={16} />
              </button>
              <button 
                className="zoom-btn"
                onClick={() => setZoomLevel(1)}
                title="Reset View"
              >
                <Maximize2 size={16} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Map Content: Geo Map or Blueprint Map */}
      <div className="map-canvas-wrapper">
        {mapMode === 'geo' ? (
          <div className="leaflet-map-host" ref={mapContainerRef}></div>
        ) : (
          <div 
            className="map-canvas"
            style={{ transform: `scale(${zoomLevel})` }}
          >
            {/* Background Vector Blueprint Grid */}
            <svg className="map-svg-blueprint" viewBox="0 0 1200 800" preserveAspectRatio="none">
              <defs>
                <pattern id="campus-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255, 255, 255, 0.04)" strokeWidth="1" />
                </pattern>
                <radialGradient id="peace-dome-glow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="rgba(16, 185, 129, 0.25)" />
                  <stop offset="100%" stopColor="rgba(16, 185, 129, 0)" />
                </radialGradient>
                <linearGradient id="road-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="rgba(30, 41, 59, 0.8)" />
                  <stop offset="50%" stopColor="rgba(51, 65, 85, 0.9)" />
                  <stop offset="100%" stopColor="rgba(30, 41, 59, 0.8)" />
                </linearGradient>
              </defs>

              <rect width="1200" height="800" fill="url(#campus-grid)" />
              <rect x="30" y="30" width="1140" height="740" rx="24" fill="rgba(15, 23, 42, 0.6)" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="2" strokeDasharray="6 6" />

              {/* Main Spine Roads / Pathways */}
              <path d="M 600 40 L 600 760" stroke="url(#road-grad)" strokeWidth="34" strokeLinecap="round" />
              <path d="M 600 40 L 600 760" stroke="rgba(234, 179, 8, 0.4)" strokeWidth="2" strokeDasharray="14 12" />

              <path d="M 50 420 L 1150 420" stroke="url(#road-grad)" strokeWidth="30" strokeLinecap="round" />
              <path d="M 50 420 L 1150 420" stroke="rgba(234, 179, 8, 0.4)" strokeWidth="2" strokeDasharray="14 12" />

              {/* Campus Green Lawns & Peace Dome Lake */}
              <ellipse cx="600" cy="420" rx="140" ry="100" fill="url(#peace-dome-glow)" />
              <ellipse cx="600" cy="420" rx="90" ry="60" fill="rgba(6, 182, 212, 0.15)" stroke="rgba(6, 182, 212, 0.4)" strokeWidth="2" />
              <text x="600" y="425" textAnchor="middle" fill="rgba(255, 255, 255, 0.5)" fontSize="12" fontWeight="600" letterSpacing="2">CENTRAL WORLD PEACE PLAZA</text>

              {/* Campus Gates */}
              <g transform="translate(600, 25)">
                <rect x="-90" y="0" width="180" height="24" rx="6" fill="#1e293b" stroke="#3b82f6" strokeWidth="2" />
                <text x="0" y="16" textAnchor="middle" fill="#93c5fd" fontSize="11" fontWeight="700">GATE 1 • PAUD ROAD ENTRANCE</text>
              </g>

              <g transform="translate(45, 420)">
                <rect x="0" y="-30" width="24" height="60" rx="4" fill="#1e293b" stroke="#64748b" strokeWidth="1" />
                <text x="12" y="4" textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="600" transform="rotate(-90 12, 4)">GATE 2 (WEST)</text>
              </g>

              <g transform="translate(1155, 420)">
                <rect x="-24" y="-30" width="24" height="60" rx="4" fill="#1e293b" stroke="#64748b" strokeWidth="1" />
                <text x="-12" y="4" textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="600" transform="rotate(90 -12, 4)">GATE 3 (EAST)</text>
              </g>
            </svg>

            {/* Interactive Building Nodes Placed by Coordinates */}
            {filteredBuildings.map((b) => {
              const IconComponent = ICON_MAP[b.building_icon] || Building2;
              const isHovered = hoveredBuilding?.id === b.id;
              const vacancyPct = b.total_rooms > 0 ? Math.round((b.vacant_rooms / b.total_rooms) * 100) : 0;

              return (
                <div
                  key={b.id}
                  className={`building-node-card ${isHovered ? 'hovered' : ''}`}
                  style={{
                    left: `${b.map_x}%`,
                    top: `${b.map_y}%`,
                    transform: 'translate(-50%, -50%)',
                    '--accent-color': b.color_accent || '#3b82f6'
                  }}
                  onMouseEnter={() => setHoveredBuilding(b)}
                  onMouseLeave={() => setHoveredBuilding(null)}
                  onClick={() => onSelectBuilding(b)}
                  role="button"
                  tabIndex={0}
                >
                  <div className="node-glow-aura" style={{ background: b.color_accent }}></div>

                  <div className="node-header">
                    <div className="node-icon-wrap" style={{ background: `${b.color_accent}20`, color: b.color_accent }}>
                      <IconComponent size={20} />
                    </div>
                    <div className="node-title-group">
                      <span className="node-code">{b.code}</span>
                      <h4 className="node-name">{b.short_name || b.name}</h4>
                    </div>
                  </div>

                  <div className="node-metrics">
                    <div className="metric-item">
                      <span className="metric-label">Vacant</span>
                      <span className="metric-val text-emerald-400">
                        <strong>{b.vacant_rooms}</strong>/{b.total_rooms}
                      </span>
                    </div>
                    <div className="metric-item">
                      <span className="metric-label">Occupancy</span>
                      <span className="metric-val text-slate-300">
                        {100 - vacancyPct}%
                      </span>
                    </div>
                    <div className="metric-item">
                      <span className="metric-label">Floors</span>
                      <span className="metric-val text-slate-300">G+{b.total_floors}</span>
                    </div>
                  </div>

                  <div className="node-footer">
                    <div className="occupancy-mini-bar">
                      <div 
                        className="occupancy-fill" 
                        style={{ 
                          width: `${100 - vacancyPct}%`,
                          backgroundColor: vacancyPct > 40 ? '#10b981' : vacancyPct > 15 ? '#3b82f6' : '#f59e0b' 
                        }}
                      ></div>
                    </div>

                    <div className="node-tags-row">
                      {b.active_issues > 0 ? (
                        <span className="node-alert-pill">
                          <AlertTriangle size={12} />
                          {b.active_issues} Issue{b.active_issues > 1 ? 's' : ''}
                        </span>
                      ) : (
                        <span className="node-ok-pill">
                          <CheckCircle2 size={12} />
                          Operational
                        </span>
                      )}

                      <span className="node-action-prompt">
                        Explore <ArrowRight size={12} />
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Floating Navigation Route Guidance Panel */}
      {navigationRoute && (
        <div className="campus-navigation-card">
          <div className="nav-card-header">
            <div className="flex items-center gap-2">
              <Navigation size={18} className="text-primary-400 animate-pulse" />
              <h4 className="font-bold text-sm">Walking Route: {navigationRoute.destination}</h4>
            </div>
            <button onClick={handleClearNavigation} className="text-slate-400 hover:text-white text-xs">✕ Clear</button>
          </div>

          <div className="nav-stats-row">
            <span className="nav-stat-chip"><Footprints size={13} /> {navigationRoute.distance}</span>
            <span className="nav-stat-chip"><Clock size={13} /> {navigationRoute.walkTime}</span>
            <span className="nav-stat-chip bg-emerald">From {navigationRoute.start}</span>
          </div>

          <div className="nav-steps-list">
            {navigationRoute.steps.map((step, idx) => (
              <div key={idx} className="nav-step-item">
                <span className="step-num">{idx + 1}</span>
                <span className="step-text">{step}</span>
              </div>
            ))}
          </div>

          <div className="nav-card-actions">
            <a 
              href={`https://www.google.com/maps/dir/?api=1&destination=${selectedForNavigation?.latitude},${selectedForNavigation?.longitude}`}
              target="_blank" 
              rel="noopener noreferrer"
              className="btn-google-maps-ext"
            >
              <ExternalLink size={14} /> Open Live in Google Maps
            </a>
            <button onClick={() => onSelectBuilding(selectedForNavigation)} className="btn-open-floors-sm">
              View Floor Plans
            </button>
          </div>
        </div>
      )}

      {/* Floating Info / Selected Building Preview Sidebar */}
      {hoveredBuilding && !navigationRoute && (
        <div className="building-hover-preview">
          <div className="preview-header">
            <div className="preview-icon" style={{ color: hoveredBuilding.color_accent }}>
              {React.createElement(ICON_MAP[hoveredBuilding.building_icon] || Building2, { size: 22 })}
            </div>
            <div>
              <span className="preview-zone">{hoveredBuilding.wing_or_zone}</span>
              <h3 className="preview-title">{hoveredBuilding.name}</h3>
            </div>
          </div>

          <p className="preview-desc">{hoveredBuilding.description}</p>

          <div className="preview-stats-grid">
            <div className="stat-box">
              <span className="stat-box-num text-emerald-400">{hoveredBuilding.vacant_rooms}</span>
              <span className="stat-box-label">Vacant Rooms</span>
            </div>
            <div className="stat-box">
              <span className="stat-box-num text-blue-400">{hoveredBuilding.occupied_rooms}</span>
              <span className="stat-box-label">In Session</span>
            </div>
            <div className="stat-box">
              <span className="stat-box-num text-amber-400">{hoveredBuilding.active_issues}</span>
              <span className="stat-box-label">Active Issues</span>
            </div>
          </div>

          <div className="preview-actions-row">
            <button 
              className="btn-inspect-building"
              onClick={() => onSelectBuilding(hoveredBuilding)}
            >
              <span>Explore Floors & Rooms</span>
              <ArrowRight size={16} />
            </button>

            <button 
              className="btn-navigate-building"
              onClick={() => handleStartNavigation(hoveredBuilding)}
              title="Get walking directions on map"
            >
              <Navigation size={15} />
              <span>Directions</span>
            </button>
          </div>
        </div>
      )}

      {/* Campus Map Legend */}
      <div className="map-legend">
        <span className="legend-title">LIVE STATUS:</span>
        <div className="legend-item">
          <span className="legend-color bg-emerald-500"></span>
          <span>High Vacancy (&gt;40%)</span>
        </div>
        <div className="legend-item">
          <span className="legend-color bg-blue-500"></span>
          <span>In-Session / Normal</span>
        </div>
        <div className="legend-item">
          <span className="legend-color bg-amber-500"></span>
          <span>Facility Maintenance Task</span>
        </div>
        <div className="legend-item ml-auto text-slate-400">
          📍 MIT-WPU Kothrud, Paud Road, Pune 411038
        </div>
      </div>
    </div>
  );
}
