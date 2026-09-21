const API_BASE = '/api';

export const api = {
  // Buildings
  async getBuildings() {
    try {
      const res = await fetch(`${API_BASE}/buildings/`);
      if (!res.ok) throw new Error('Failed to fetch buildings');
      return await res.json();
    } catch (err) {
      console.warn('API Error (getBuildings), falling back:', err);
      throw err;
    }
  },

  async getBuildingDetail(id) {
    const res = await fetch(`${API_BASE}/buildings/${id}/`);
    if (!res.ok) throw new Error('Failed to fetch building details');
    return await res.json();
  },

  // Rooms
  async getRooms(params = {}) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        query.append(key, val);
      }
    });
    const url = `${API_BASE}/rooms/${query.toString() ? `?${query.toString()}` : ''}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch rooms');
    return await res.json();
  },

  async getRoomDetail(id) {
    const res = await fetch(`${API_BASE}/rooms/${id}/`);
    if (!res.ok) throw new Error('Failed to fetch room detail');
    return await res.json();
  },

  async toggleRoomStatus(roomId, data) {
    const res = await fetch(`${API_BASE}/rooms/${roomId}/toggle-status/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update room status');
    return await res.json();
  },

  // Infrastructure Issues
  async getIssues(params = {}) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        query.append(key, val);
      }
    });
    const url = `${API_BASE}/infrastructure-issues/${query.toString() ? `?${query.toString()}` : ''}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch issues');
    return await res.json();
  },

  async reportIssue(data) {
    const res = await fetch(`${API_BASE}/infrastructure-issues/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to submit issue report');
    return await res.json();
  },

  async updateIssueStatus(issueId, data) {
    const res = await fetch(`${API_BASE}/infrastructure-issues/${issueId}/`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update issue');
    return await res.json();
  },

  // Campus Analytics
  async getCampusAnalytics() {
    const res = await fetch(`${API_BASE}/analytics/campus-summary/`);
    if (!res.ok) throw new Error('Failed to fetch campus analytics');
    return await res.json();
  },

  // Real-Time Data Ingestion (used by Person 3 / IoT sensors / scripts)
  async ingestRoomData(roomId, { occupancy, engagement }) {
    const res = await fetch(`${API_BASE}/ingest/room/${roomId}/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ occupancy, engagement }),
    });
    if (!res.ok) throw new Error('Failed to ingest room data');
    return await res.json();
  },
};
