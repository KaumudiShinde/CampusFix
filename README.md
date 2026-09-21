# College Campus Complaint & Space Management System

A real-time campus infrastructure monitoring system for MIT-WPU.
Tracks classroom occupancy, student engagement, and facility issues.

---

## Team Structure (3-Person Division)

| Person | Role | Folder Ownership |
|--------|------|-----------------|
| Person 1 | Backend Architect (Django) | backend/ |
| Person 2 | Frontend Engineer (React) | frontend/ |
| Person 3 | Data / IoT Integration | backend/simulate_sensors.py |

---

## How to Run

### 1. Backend (Person 1 owns)
`ash
cd backend
python -m venv venv
venv\Scripts\activate         # Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
`

### 2. Frontend (Person 2 owns)
`ash
cd frontend
npm install
npm run dev
# Open: http://localhost:3000
`

### 3. Sensor Simulator (Person 3 owns)
`ash
cd backend
venv\Scripts\python.exe simulate_sensors.py
# This pushes real-time occupancy + engagement data to the backend
`

---

## GitHub Workflow (How to commit one-by-one safely)

### Setup (Person 1 does this ONCE)
1. Create repo on github.com
2. git init
3. git add .
4. git commit -m "Initial project setup"
5. git branch -M main
6. git remote add origin https://github.com/<your-username>/<repo-name>.git
7. git push -u origin main
8. Invite Person 2 and Person 3 as collaborators

### Daily Workflow for EVERYONE
`ash
# 1. Always sync before starting work
git pull origin main

# 2. Create your own branch
git checkout -b your-feature-name
# Examples:
#   git checkout -b backend-room-api
#   git checkout -b frontend-live-dashboard
#   git checkout -b sensor-simulation

# 3. Make your changes, then commit
git add .
git commit -m "Short description of what you did"

# 4. Push your branch
git push origin your-feature-name

# 5. Go to GitHub → Open a Pull Request → Ask teammate to review
# 6. After review/approval → Merge to main
`

### GOLDEN RULE
> NEVER commit directly to 'main'. Always use a branch.

---

## Real-Time Data Flow

`
Sensors / simulate_sensors.py
         ↓  POST /api/ingest/room/<id>/
Django Backend (port 8000)
         ↓  GET /api/rooms/ (every 5 seconds)
React Frontend (port 3000)
         ↓  Live UI update
`

---

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| /api/buildings/ | GET | All buildings |
| /api/rooms/ | GET | All rooms with live data |
| /api/ingest/room/<id>/ | POST | Push sensor data |
| /api/analytics/campus-summary/ | GET | Campus stats |
