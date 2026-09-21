import React from 'react';
import { 
  MapPin, 
  Search, 
  Layers, 
  Wrench, 
  BarChart3, 
  PlusCircle, 
  Building2, 
  Zap, 
  CheckCircle2, 
  AlertTriangle,
  RefreshCw
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, summaryStats, onOpenReportModal, onRefresh, loading }) {
  return (
    <header className="site-header">
      {/* Top Banner Ticker */}
      <div className="top-ticker">
        <div className="ticker-content">
          <span className="ticker-badge">MIT-WPU LIVE INFRA</span>
          <span className="ticker-item">
            <span className="dot dot-green"></span>
            <strong>{summaryStats?.summary?.vacant_rooms ?? '--'}</strong> / {summaryStats?.summary?.total_rooms ?? '--'} Classrooms Vacant
          </span>
          <span className="ticker-separator">•</span>
          <span className="ticker-item">
            <span className="dot dot-blue"></span>
            <strong>{summaryStats?.labs?.vacant ?? '--'}</strong> / {summaryStats?.labs?.total ?? '--'} Labs Available Now
          </span>
          <span className="ticker-separator">•</span>
          <span className="ticker-item">
            <span className="dot dot-amber"></span>
            <strong>{summaryStats?.infrastructure?.open_issues ?? 0}</strong> Active Maintenance Tasks
          </span>
          {summaryStats?.infrastructure?.energy_alerts > 0 && (
            <>
              <span className="ticker-separator">•</span>
              <span className="ticker-item text-amber-400">
                <Zap size={13} className="inline mr-1" />
                {summaryStats.infrastructure.energy_alerts} Vacant Rooms with Power Active
              </span>
            </>
          )}
        </div>
        <button 
          onClick={onRefresh} 
          className={`ticker-refresh-btn ${loading ? 'spinning' : ''}`}
          title="Refresh live campus data"
        >
          <RefreshCw size={13} />
          <span>Sync Status</span>
        </button>
      </div>

      {/* Main Navbar */}
      <div className="navbar-container">
        {/* Brand Logo & Title */}
        <div className="brand-section" onClick={() => setActiveTab('map')} role="button" tabIndex={0}>
          <div className="brand-logo-shield">
            <span className="shield-icon">🏛️</span>
            <div className="shield-glow"></div>
          </div>
          <div className="brand-info">
            <div className="brand-title-wrap">
              <span className="brand-title">MIT-WPU</span>
              <span className="brand-tag">INFRASTRUCTURE OS</span>
            </div>
            <span className="brand-subtitle">World Peace University Campus • Space & Lab Vacancy</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="nav-tabs">
          <button 
            className={`nav-tab-btn ${activeTab === 'map' ? 'active' : ''}`}
            onClick={() => setActiveTab('map')}
          >
            <MapPin size={17} />
            <span>Campus Map</span>
          </button>

          <button 
            className={`nav-tab-btn ${activeTab === 'finder' ? 'active' : ''}`}
            onClick={() => setActiveTab('finder')}
          >
            <Search size={17} />
            <span>Space Finder</span>
            <span className="badge-pill bg-emerald">{summaryStats?.summary?.vacant_rooms ?? 0} Free</span>
          </button>

          <button 
            className={`nav-tab-btn ${activeTab === 'buildings' ? 'active' : ''}`}
            onClick={() => setActiveTab('buildings')}
          >
            <Layers size={17} />
            <span>Building & Floors</span>
          </button>

          <button 
            className={`nav-tab-btn ${activeTab === 'issues' ? 'active' : ''}`}
            onClick={() => setActiveTab('issues')}
          >
            <Wrench size={17} />
            <span>Facility Issues</span>
            {summaryStats?.infrastructure?.open_issues > 0 && (
              <span className="badge-pill bg-amber">{summaryStats.infrastructure.open_issues}</span>
            )}
          </button>

          <button 
            className={`nav-tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            <BarChart3 size={17} />
            <span>Analytics</span>
          </button>
        </nav>

        {/* Action Button */}
        <div className="nav-actions">
          <button 
            className="btn-report-issue"
            onClick={onOpenReportModal}
          >
            <PlusCircle size={16} />
            <span>Report Facility Issue</span>
          </button>
        </div>
      </div>
    </header>
  );
}
