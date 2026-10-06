import React, { useState, useEffect, useCallback, useRef } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';

import Navbar from './components/Navbar';
import CampusMap from './components/CampusMap';
import BuildingView from './components/BuildingView';
import VacantFinder from './components/VacantFinder';
import CampusIssuesTracker from './components/CampusIssuesTracker';
import CampusAnalytics from './components/CampusAnalytics';
import RoomDetailModal from './components/RoomDetailModal';
import ReportIssueModal from './components/ReportIssueModal';

import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import { logout, getCurrentUser } from './services/auth';

import { api } from './services/api';
import {
  CheckCircle2,
  AlertTriangle,
  LogOut,
  User,
} from 'lucide-react';


function Dashboard() {
  const navigate = useNavigate();
  const [currentUser] = useState(() => getCurrentUser());
  const [activeTab, setActiveTab] = useState('map');
  const [buildings, setBuildings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [issues, setIssues] = useState([]);
  const [analytics, setAnalytics] = useState(null);

  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [inspectedRoom, setInspectedRoom] = useState(null);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [presetRoomForReport, setPresetRoomForReport] = useState(null);

  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const pollingRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  // Show Toast
  const showToast = (msg, type = 'success') => {
    setToastMessage({ text: msg, type });

    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Silent background refresh
  const silentRefresh = useCallback(async (currentBuildingId) => {
    try {
      const [
        buildingsData,
        roomsData,
        issuesData,
        analyticsData,
      ] = await Promise.all([
        api.getBuildings(),
        api.getRooms(),
        api.getIssues(),
        api.getCampusAnalytics(),
      ]);

      setBuildings(buildingsData);
      setRooms(roomsData);
      setIssues(issuesData);
      setAnalytics(analyticsData);
      setLastUpdated(new Date());

      if (currentBuildingId) {
        const detailed = await api.getBuildingDetail(currentBuildingId);
        setSelectedBuilding(detailed);
      }
    } catch (err) {
      console.warn('Background refresh failed:', err);
    }
  }, []);

  // Fetch all campus data
  const loadData = useCallback(async () => {
    setLoading(true);

    try {
      const [
        buildingsData,
        roomsData,
        issuesData,
        analyticsData,
      ] = await Promise.all([
        api.getBuildings(),
        api.getRooms(),
        api.getIssues(),
        api.getCampusAnalytics(),
      ]);

      setBuildings(buildingsData);
      setRooms(roomsData);
      setIssues(issuesData);
      setAnalytics(analyticsData);
      setLastUpdated(new Date());

      // Keep selected building synced
      if (selectedBuilding) {
        const updated = buildingsData.find(
          (b) => b.id === selectedBuilding.id
        );

        if (updated) {
          const detailed = await api.getBuildingDetail(updated.id);
          setSelectedBuilding(detailed);
        }
      }
    } catch (err) {
      console.error('Error fetching campus data:', err);
      showToast(
        'Error loading campus data from server',
        'error'
      );
    } finally {
      setLoading(false);
    }
  }, [selectedBuilding?.id]);

  // Initial load
  useEffect(() => {
    loadData();
  }, []);

  // Real-time polling every 5 seconds
  useEffect(() => {
    pollingRef.current = setInterval(() => {
      setSelectedBuilding((prev) => {
        silentRefresh(prev?.id);
        return prev;
      });
    }, 5000);

    return () => clearInterval(pollingRef.current);
  }, [silentRefresh]);

  // Building selection
  const handleSelectBuilding = async (building) => {
    try {
      const detailed = await api.getBuildingDetail(building.id);

      setSelectedBuilding(detailed);
      setActiveTab('buildings');
    } catch (err) {
      console.error(err);

      setSelectedBuilding(building);
      setActiveTab('buildings');
    }
  };

  // Inspect room
  const handleInspectRoom = async (room) => {
    try {
      const detailed = await api.getRoomDetail(room.id);
      setInspectedRoom(detailed);
    } catch (err) {
      setInspectedRoom(room);
    }
  };

  // Toggle room status
  const handleToggleRoomStatus = async (
    room,
    newStatus,
    extraData = {}
  ) => {
    try {
      const updated = await api.toggleRoomStatus(room.id, {
        status: newStatus,
        ...extraData,
      });

      setRooms((prev) =>
        prev.map((r) =>
          r.id === room.id
            ? { ...r, ...updated }
            : r
        )
      );

      if (
        inspectedRoom &&
        inspectedRoom.id === room.id
      ) {
        setInspectedRoom((prev) => ({
          ...prev,
          ...updated,
        }));
      }

      loadData();

      showToast(
        `Updated ${room.room_number} to ${newStatus.toUpperCase()}`
      );
    } catch (err) {
      showToast(
        'Failed to update room status: ' +
          err.message,
        'error'
      );
    }
  };

  // Report issue
  const handleReportIssue = async (issueData) => {
    try {
      const created = await api.reportIssue(issueData);

      showToast(
        `Logged maintenance ticket ${created.ticket_id} for ${created.room_number}`
      );

      loadData();
    } catch (err) {
      throw err;
    }
  };

  // Resolve issue
  const handleResolveIssue = async (issueId) => {
    try {
      await api.updateIssueStatus(issueId, {
        status: 'resolved',
      });

      showToast(
        'Maintenance task marked as Resolved'
      );

      loadData();

      if (inspectedRoom) {
        handleInspectRoom(inspectedRoom);
      }
    } catch (err) {
      showToast(
        'Failed to update issue status',
        'error'
      );
    }
  };

  // Open report modal
  const handleOpenReportModal = (room = null) => {
    setPresetRoomForReport(room);
    setReportModalOpen(true);
  };

  return (
    <div className="app-root">

      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`toast-notification ${toastMessage.type}`}
        >
          {toastMessage.type === 'error' ? (
            <AlertTriangle size={16} />
          ) : (
            <CheckCircle2 size={16} />
          )}

          <span>
            {toastMessage.text}
          </span>
        </div>
      )}

      {/* Live Update Indicator */}
      {lastUpdated && (
        <div
          style={{
            position: 'fixed',
            bottom: '16px',
            left: '16px',
            zIndex: 999,
            background: '#0f172a',
            border: '1px solid #1e293b',
            borderRadius: '8px',
            padding: '6px 12px',
            fontSize: '11px',
            color: '#64748b',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: '#10b981',
              display: 'inline-block',
              animation: 'pulse 2s infinite',
            }}
          />

          LIVE · Updated{' '}
          {lastUpdated.toLocaleTimeString()}
        </div>
      )}

      {/* Live User Session & Logout Bar */}
      <div className="auth-user-bar">
        <div className="auth-user-badge">
          <User size={13} />
          <span>User: <strong>{currentUser?.email || currentUser?.name || 'Authorized Member'}</strong></span>
        </div>
        <button
          className="auth-logout-btn"
          onClick={handleLogout}
          title="Sign out of CampusFix"
        >
          <LogOut size={13} />
          <span>Logout</span>
        </button>
      </div>

      {/* Main Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        summaryStats={analytics}
        onOpenReportModal={() =>
          handleOpenReportModal()
        }
        onRefresh={loadData}
        loading={loading}
      />

      {/* Main Content */}
      <main className="main-content-container">

        {activeTab === 'map' && (
          <CampusMap
            buildings={buildings}
            onSelectBuilding={handleSelectBuilding}
            onOpenReportModal={handleOpenReportModal}
          />
        )}

        {activeTab === 'finder' && (
          <VacantFinder
            rooms={rooms}
            buildings={buildings}
            onInspectRoom={handleInspectRoom}
            onToggleRoomStatus={
              handleToggleRoomStatus
            }
            onReportIssue={
              handleOpenReportModal
            }
          />
        )}

        {activeTab === 'buildings' && (
          <BuildingView
            building={
              selectedBuilding ||
              (buildings.length > 0
                ? buildings[0]
                : null)
            }
            buildings={buildings}
            onBackToMap={() =>
              setActiveTab('map')
            }
            onSelectBuilding={
              handleSelectBuilding
            }
            onInspectRoom={
              handleInspectRoom
            }
            onToggleRoomStatus={
              handleToggleRoomStatus
            }
            onReportIssue={
              handleOpenReportModal
            }
          />
        )}

        {activeTab === 'issues' && (
          <CampusIssuesTracker
            issues={issues}
            buildings={buildings}
            onOpenReportModal={() =>
              handleOpenReportModal()
            }
            onResolveIssue={
              handleResolveIssue
            }
          />
        )}

        {activeTab === 'analytics' && (
          <CampusAnalytics
            analytics={analytics}
            buildings={buildings}
            rooms={rooms}
          />
        )}

      </main>

      {/* Room Detail Modal */}
      {inspectedRoom && (
        <RoomDetailModal
          room={inspectedRoom}
          onClose={() =>
            setInspectedRoom(null)
          }
          onToggleStatus={
            handleToggleRoomStatus
          }
          onOpenReportIssue={
            handleOpenReportModal
          }
          onResolveIssue={
            handleResolveIssue
          }
        />
      )}

      {/* Report Issue Modal */}
      {reportModalOpen && (
        <ReportIssueModal
          rooms={rooms}
          buildings={buildings}
          presetRoom={presetRoomForReport}
          onClose={() => {
            setReportModalOpen(false);
            setPresetRoomForReport(null);
          }}
          onSubmitIssue={handleReportIssue}
        />
      )}

    </div>
  );
}


// Main Application
export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Login */}
        <Route
          path="/login"
          element={<Login />}
        />

        {/* Public Registration */}
        <Route
          path="/register"
          element={<Register />}
        />

        {/* Protected CampusFix Dashboard */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Any unknown URL */}
        <Route
          path="*"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}