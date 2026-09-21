import React from 'react';
import { 
  BarChart3, 
  PieChart, 
  Cpu, 
  Tv, 
  Zap, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingUp, 
  Building2,
  Users,
  ShieldAlert
} from 'lucide-react';

export default function CampusAnalytics({ analytics, buildings, rooms = [] }) {
  if (!analytics) {
    return <div className="loading-state">Loading campus analytics...</div>;
  }

  const { summary, labs, classrooms, infrastructure, buildings_breakdown } = analytics;

  // Compute live occupancy data from rooms with sensor updates
  const roomsWithLiveData = rooms.filter(r => r.last_sensor_update && r.current_status === 'occupied');
  const totalStudentsPresent = roomsWithLiveData.reduce((sum, r) => sum + (r.current_occupancy || 0), 0);
  const avgEngagement = roomsWithLiveData.length > 0
    ? Math.round(roomsWithLiveData.reduce((sum, r) => sum + (r.engagement_score || 0), 0) / roomsWithLiveData.length)
    : null;
  const hasLiveData = roomsWithLiveData.length > 0;

  return (
    <div className="analytics-container">
      {/* Header Banner */}
      <div className="analytics-hero">
        <div>
          <span className="analytics-badge">CAMPUS INTELLIGENCE</span>
          <h2 className="analytics-title">MIT-WPU Space Utilization & Facility Health</h2>
          <p className="analytics-sub">Real-time resource metrics, lab occupancy rates, and energy optimization.</p>
        </div>
      </div>

      {/* Main KPI Quad */}
      <div className="analytics-kpi-quad">
        <div className="analytics-card">
          <div className="card-top">
            <span className="card-lbl">Overall Vacancy Rate</span>
            <div className="card-icon-pill bg-emerald">
              <CheckCircle2 size={18} />
            </div>
          </div>
          <div className="card-body">
            <span className="big-stat text-emerald-400">{summary.vacancy_rate}%</span>
            <span className="stat-detail">
              <strong>{summary.vacant_rooms}</strong> of {summary.total_rooms} rooms available
            </span>
          </div>
          <div className="progress-bar-wrap">
            <div className="progress-fill bg-emerald-500" style={{ width: `${summary.vacancy_rate}%` }}></div>
          </div>
        </div>

        <div className="analytics-card">
          <div className="card-top">
            <span className="card-lbl">Lab Occupancy</span>
            <div className="card-icon-pill bg-purple">
              <Cpu size={18} />
            </div>
          </div>
          <div className="card-body">
            <span className="big-stat text-purple-400">{labs.occupancy_rate}%</span>
            <span className="stat-detail">
              <strong>{labs.occupied}</strong> of {labs.total} specialized labs in use
            </span>
          </div>
          <div className="progress-bar-wrap">
            <div className="progress-fill bg-purple-500" style={{ width: `${labs.occupancy_rate}%` }}></div>
          </div>
        </div>

        <div className="analytics-card">
          <div className="card-top">
            <span className="card-lbl">Facility Maintenance</span>
            <div className="card-icon-pill bg-amber">
              <AlertTriangle size={18} />
            </div>
          </div>
          <div className="card-body">
            <span className="big-stat text-amber-400">{infrastructure.open_issues}</span>
            <span className="stat-detail">
              {infrastructure.critical_issues > 0 ? (
                <strong className="text-red-400">{infrastructure.critical_issues} Critical</strong>
              ) : (
                <span>0 Critical</span>
              )} • All assigned to techs
            </span>
          </div>
          <div className="progress-bar-wrap">
            <div className="progress-fill bg-amber-500" style={{ width: `${Math.min(infrastructure.open_issues * 15, 100)}%` }}></div>
          </div>
        </div>

        <div className="analytics-card">
          <div className="card-top">
            <span className="card-lbl">Energy Saving Alerts</span>
            <div className="card-icon-pill bg-blue">
              <Zap size={18} />
            </div>
          </div>
          <div className="card-body">
            <span className="big-stat text-blue-400">{infrastructure.energy_alerts}</span>
            <span className="stat-detail">
              Vacant rooms with HVAC/lights active
            </span>
          </div>
          <div className="progress-bar-wrap">
            <div className="progress-fill bg-blue-500" style={{ width: `${infrastructure.energy_alerts * 25}%` }}></div>
          </div>
        </div>
      </div>

      {/* Live Sensor Data Row - only shown when real data exists */}
      {hasLiveData && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
          <div className="analytics-card" style={{ border: '1px solid #10b98140' }}>
            <div className="card-top">
              <span className="card-lbl" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#10b981', display: 'inline-block' }}></span>
                LIVE · Students Present
              </span>
              <div className="card-icon-pill bg-emerald"><Users size={18} /></div>
            </div>
            <div className="card-body">
              <span className="big-stat text-emerald-400">{totalStudentsPresent}</span>
              <span className="stat-detail">across {roomsWithLiveData.length} active classrooms</span>
            </div>
          </div>

          <div className="analytics-card" style={{ border: `1px solid ${avgEngagement > 70 ? '#10b98140' : '#f59e0b40'}` }}>
            <div className="card-top">
              <span className="card-lbl" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: avgEngagement > 70 ? '#10b981' : '#f59e0b', display: 'inline-block' }}></span>
                LIVE · Avg. Engagement
              </span>
              <div className="card-icon-pill bg-purple"><TrendingUp size={18} /></div>
            </div>
            <div className="card-body">
              <span className={`big-stat ${avgEngagement > 70 ? 'text-emerald-400' : 'text-amber-400'}`}>{avgEngagement}%</span>
              <span className="stat-detail">{avgEngagement > 70 ? 'Students are highly engaged' : 'Engagement could be improved'}</span>
            </div>
            <div className="progress-bar-wrap">
              <div style={{ height: '100%', backgroundColor: avgEngagement > 70 ? '#10b981' : '#f59e0b', width: `${avgEngagement}%`, borderRadius: '2px' }}></div>
            </div>
          </div>
        </div>
      )}

      {/* Buildings Breakdown Grid */}
      <div className="analytics-grid-row">
        {/* Building-wise Occupancy Comparison */}
        <div className="analytics-panel">
          <div className="panel-header">
            <Building2 size={18} className="text-primary-400" />
            <h3>Building-wise Space Availability</h3>
          </div>

          <div className="buildings-stat-list">
            {buildings_breakdown?.map((b) => {
              const freeRate = 100 - b.occupancy_rate;
              return (
                <div key={b.id} className="building-stat-row">
                  <div className="b-stat-info">
                    <span className="b-stat-code">{b.code}</span>
                    <span className="b-stat-name">{b.name}</span>
                    <span className="b-stat-free text-emerald-400">{b.vacant_rooms} Free</span>
                  </div>

                  <div className="b-stat-bar-container">
                    <div 
                      className="b-stat-bar-fill" 
                      style={{ 
                        width: `${b.occupancy_rate}%`,
                        backgroundColor: b.occupancy_rate > 70 ? '#3b82f6' : '#10b981'
                      }}
                    ></div>
                  </div>

                  <span className="b-stat-pct">{b.occupancy_rate}% occupied</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Space Category Distribution */}
        <div className="analytics-panel">
          <div className="panel-header">
            <PieChart size={18} className="text-purple-400" />
            <h3>Campus Resource Distribution</h3>
          </div>

          <div className="distribution-list">
            <div className="dist-item">
              <div className="dist-icon bg-blue">
                <Tv size={16} />
              </div>
              <div className="dist-content">
                <div className="dist-title-row">
                  <span className="dist-title">Smart Classrooms & Lecture Halls</span>
                  <span className="dist-count">{classrooms.total} total</span>
                </div>
                <div className="dist-bar">
                  <div className="dist-fill bg-blue-500" style={{ width: `${(classrooms.vacant / classrooms.total) * 100}%` }}></div>
                </div>
                <span className="dist-sub text-emerald-400">{classrooms.vacant} Vacant Right Now</span>
              </div>
            </div>

            <div className="dist-item">
              <div className="dist-icon bg-purple">
                <Cpu size={16} />
              </div>
              <div className="dist-content">
                <div className="dist-title-row">
                  <span className="dist-title">Computing & AI Research Labs</span>
                  <span className="dist-count">{labs.total} total</span>
                </div>
                <div className="dist-bar">
                  <div className="dist-fill bg-purple-500" style={{ width: `${(labs.vacant / labs.total) * 100}%` }}></div>
                </div>
                <span className="dist-sub text-emerald-400">{labs.vacant} Labs Available</span>
              </div>
            </div>

            <div className="dist-item">
              <div className="dist-icon bg-emerald">
                <Zap size={16} />
              </div>
              <div className="dist-content">
                <div className="dist-title-row">
                  <span className="dist-title">Green Energy Optimization</span>
                  <span className="dist-count">Smart Sensors</span>
                </div>
                <p className="dist-text">
                  Automated smart building sensors reduce electricity waste by flagging empty lecture halls with active climate control.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
