# CampusFix API Documentation

## Base URL

```text
http://127.0.0.1:8000/api

Buildings
Get all buildings
GET /api/buildings/

Returns a list of campus buildings.

Get building details
GET /api/buildings/<id>/

Returns details of a specific building.

Rooms
Get all rooms
GET /api/rooms/

Returns a list of campus rooms.

Get room details
GET /api/rooms/<id>/

Returns details of a specific room.

Toggle room status
POST /api/rooms/<id>/toggle-status/

Updates the status of a specific room.

Infrastructure Issues
Get all infrastructure issues
GET /api/infrastructure-issues/

Returns a list of reported infrastructure issues.

Create an infrastructure issue
POST /api/infrastructure-issues/

Creates a new infrastructure issue.

Get issue details
GET /api/infrastructure-issues/<id>/

Returns details of a specific infrastructure issue.

Campus Analytics
Get campus summary
GET /api/analytics/campus-summary/

Returns campus-wide analytics and statistics.

Sensor Data
Send room sensor data
POST /api/ingest/room/<id>/

Sends sensor information for a specific room.

Example request:

{
    "occupancy": 35,
    "engagement": 82.5
}

Example successful response:

{
    "status": "success",
    "room_id": 1,
    "occupancy": 35,
    "engagement": 82.5
}
Demo Data

Demo data can be created using:

python manage.py seed_demo_data

The command creates sample departments, buildings and rooms for development and testing.

Sensor Simulator

The sensor simulator is located at:

backend/simulate_sensors.py

Run it from the backend directory:

python simulate_sensors.py

The simulator periodically sends sensor data to the room data ingestion API.


### Save it

Press:

```text
Ctrl + S