# 🏫 CampusFix

### Smart Campus Infrastructure & Complaint Management System

**CampusFix** is a smart campus management platform designed to help students and campus administrators monitor infrastructure, report maintenance issues, track room availability, and view real-time campus analytics from a centralized dashboard.

The system combines a **React frontend** with a **Django REST API backend** to provide an interactive and responsive campus management experience.

---

## 🚀 Features

### 🗺️ Interactive Campus Map

* View campus buildings through an interactive map.
* Select individual buildings to explore their details.
* View building occupancy and infrastructure information.
* Uses **Leaflet** for map visualization.

### 🏢 Building & Room Management

* View all campus buildings.
* View rooms available within each building.
* Display room capacity, floor, facilities, and current status.
* Track room states such as:

  * Vacant
  * Occupied
  * Reserved
  * Maintenance

### 🔎 Vacant Room Finder

* Find currently available rooms.
* Filter rooms based on different parameters.
* View room details before selecting a room.
* Quickly identify rooms suitable for academic or campus activities.

### 🛠️ Complaint & Infrastructure Issue Management

Students and users can report campus infrastructure problems such as:

* Electrical issues
* Plumbing problems
* Furniture damage
* IT/Network problems
* AC and facility problems
* Other infrastructure-related issues

Each complaint can contain:

* Ticket ID
* Issue title
* Description
* Location
* Category
* Priority
* Status
* Assigned technician
* Resolution notes

### 📊 Campus Analytics

The dashboard provides campus-level statistics including:

* Total rooms
* Vacant rooms
* Occupied rooms
* Room occupancy rate
* Vacancy rate
* Laboratory statistics
* Classroom statistics
* Open infrastructure issues
* Critical issues
* Energy alerts
* Building-wise breakdown

### 📡 Real-Time Room Monitoring

The system supports real-time room data ingestion.

Room data such as:

* Occupancy
* Engagement score

can be sent to the Django backend through an API.

The React frontend automatically refreshes campus data every **5 seconds** to keep the dashboard updated.

### 🔔 Notifications

The application provides toast notifications for actions such as:

* Successful issue submission
* Room status updates
* Issue resolution
* API errors

---

## 🛠️ Tech Stack

### Frontend

* **React.js**
* **Vite**
* **JavaScript**
* **Leaflet**
* **Lucide React**
* HTML5
* CSS3

### Backend

* **Python**
* **Django**
* **Django REST Framework**
* Django CORS Headers

### Database

* **SQLite**

### Development Tools

* Git
* GitHub
* VS Code
* npm
* Python Virtual Environment

---

## 🏗️ System Architecture

```text
                    ┌─────────────────────┐
                    │     CampusFix       │
                    │   React Frontend    │
                    │     Port: 3000      │
                    └──────────┬──────────┘
                               │
                               │ REST API
                               ▼
                    ┌─────────────────────┐
                    │   Django REST API   │
                    │     Port: 8000      │
                    └──────────┬──────────┘
                               │
                 ┌─────────────┼─────────────┐
                 │             │             │
                 ▼             ▼             ▼
          ┌────────────┐ ┌────────────┐ ┌──────────────┐
          │   Rooms    │ │ Complaints │ │  Analytics   │
          └────────────┘ └────────────┘ └──────────────┘
                               │
                               ▼
                       ┌──────────────┐
                       │   SQLite DB  │
                       └──────────────┘

                 Sensor / IoT Data
                        │
                        ▼
                Room Data API
                        │
                        ▼
                  Django Backend
```

---

## 📁 Project Structure

```text
CampusFix/
│
├── backend/
│   ├── backend/
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   │
│   ├── complaints/
│   │   ├── migrations/
│   │   ├── management/
│   │   ├── admin.py
│   │   ├── apps.py
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── urls.py
│   │   └── views.py
│   │
│   ├── manage.py
│   ├── requirements.txt
│   ├── simulate_sensors.py
│   └── db.sqlite3
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   └── mockData.js
│   │   ├── App.jsx
│   │   └── index.css
│   │
│   ├── package.json
│   └── vite.config.js
│
├── package.json
├── .gitignore
└── README.md
```

---

## 🔗 REST API Endpoints

| Endpoint                           | Method | Purpose                        |
| ---------------------------------- | ------ | ------------------------------ |
| `/api/buildings/`                  | GET    | Retrieve all campus buildings  |
| `/api/buildings/<id>/`             | GET    | Retrieve building details      |
| `/api/rooms/`                      | GET    | Retrieve campus rooms          |
| `/api/rooms/<id>/`                 | GET    | Retrieve room details          |
| `/api/rooms/<id>/toggle-status/`   | POST   | Update room status             |
| `/api/infrastructure-issues/`      | GET    | Retrieve infrastructure issues |
| `/api/infrastructure-issues/`      | POST   | Report a new issue             |
| `/api/infrastructure-issues/<id>/` | PATCH  | Update an issue                |
| `/api/analytics/campus-summary/`   | GET    | Retrieve campus analytics      |
| `/api/ingest/room/<id>/`           | POST   | Ingest room occupancy data     |

---

# ⚙️ Installation & Setup

## 1. Clone the Repository

```bash
git clone https://github.com/<your-username>/CampusFix.git
cd CampusFix
```

---

## 2. Setup Backend

Navigate to the backend directory:

```bash
cd backend
```

Create a Python virtual environment:

```bash
python -m venv venv
```

### Windows

```bash
venv\Scripts\activate
```

### macOS/Linux

```bash
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Run database migrations:

```bash
python manage.py migrate
```

Start the Django server:

```bash
python manage.py runserver
```

The backend will run at:

```text
http://127.0.0.1:8000/
```

---

# 💻 Frontend Setup

Open a new terminal and navigate to the frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the React development server:

```bash
npm run dev
```

The frontend will be available at:

```text
http://localhost:3000
```

---

# 📡 Sensor Simulation

CampusFix includes a sensor simulation script for generating room occupancy and engagement data.

From the backend directory:

```bash
python simulate_sensors.py
```

The simulated data is sent to:

```text
POST /api/ingest/room/<room_id>/
```

This allows the application to demonstrate how real-time IoT/sensor data could be integrated into the campus management system.

---

# 🔄 Real-Time Data Flow

```text
Room Sensors / Sensor Simulator
              │
              │ Occupancy + Engagement
              ▼
       Django REST API
              │
              ▼
          SQLite DB
              │
              │ GET requests
              ▼
        React Frontend
              │
              ▼
       Live Campus Dashboard
```

The frontend periodically polls the backend to retrieve updated room, building, issue, and analytics information.

---

# 🧩 Main Modules

## 1. Campus Map

Provides a visual representation of campus buildings and allows users to select buildings for further information.

## 2. Room Management

Displays:

* Room number
* Room type
* Capacity
* Floor
* Current status
* Current occupancy
* Facilities
* Instructor/activity information

## 3. Issue Management

Users can report infrastructure issues and administrators/staff can track and update their status.

Possible issue statuses include:

```text
Open
Assigned
In Progress
Resolved
```

## 4. Analytics Dashboard

Provides a centralized overview of campus infrastructure and room utilization.

## 5. Real-Time Monitoring

Room occupancy and engagement data can be continuously updated using the sensor ingestion API.

---

# 🎯 Project Objectives

The main objectives of CampusFix are:

* To digitize campus infrastructure management.
* To simplify reporting of maintenance issues.
* To improve visibility of unresolved complaints.
* To monitor classroom and room availability.
* To provide centralized campus analytics.
* To support real-time occupancy monitoring.
* To improve communication between students and campus administration.
* To provide a scalable foundation for future IoT-based campus monitoring.

---

# 🌟 Future Enhancements

The following features can be added in future versions:

* 🔐 Student and administrator authentication
* 📱 Mobile application
* 🔔 Email and push notifications
* 🤖 AI-based complaint classification
* 🧠 Predictive maintenance
* 📈 Advanced analytics and reporting
* 📷 Image upload for complaints
* 🗺️ Improved indoor campus navigation
* 🔌 Integration with real IoT sensors
* ☁️ Cloud deployment
* 🧑‍💼 Role-based access control
* 📊 Export analytics reports as PDF/Excel

---

# 👥 Team Structure

CampusFix can be developed using a three-member team structure:

| Role                 | Responsibility                                       |
| -------------------- | ---------------------------------------------------- |
| Backend Developer    | Django REST API, database, backend logic             |
| Frontend Developer   | React UI, dashboard, maps and user interaction       |
| Data / IoT Developer | Sensor simulation, room data ingestion and analytics |

---

# 🔒 Security Considerations

Future production deployment should include:

* Secure authentication
* Role-based authorization
* Password hashing
* API authentication
* Input validation
* HTTPS
* Secure environment variables
* Database access controls

---

# 📌 Project Status

**Status:** 🚧 Active Development

CampusFix currently provides the core campus monitoring, room management, infrastructure issue tracking, analytics, and sensor-data integration functionality.

---

## 📄 License

This project is developed for **educational and academic purposes**.

---

## 👨‍💻 Contributors

Developed as a collaborative academic project.

**CampusFix — Making Campus Management Smarter, Faster & More Connected.** 🏫✨
