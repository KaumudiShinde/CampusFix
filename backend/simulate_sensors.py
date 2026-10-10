#!/usr/bin/env python3
# pyrefly: ignore [missing-import]
import requests
import random
import time

BASE_URL = "http://127.0.0.1:8000/api"
UPDATE_INTERVAL = 5


def get_all_rooms():
    try:
        response = requests.get(
            f"{BASE_URL}/rooms/",
            timeout=5
        )
        response.raise_for_status()
        return response.json()
    except Exception as error:
        print(f"[ERROR] Could not fetch rooms: {error}")
        return []


def check_sensor_anomalies(
    room_number,
    occupancy,
    capacity,
    engagement
):
    alerts = []

    if occupancy > capacity:
        alerts.append(
            f"[CRITICAL] {room_number}: "
            f"occupancy {occupancy} exceeds capacity {capacity}"
        )
    elif occupancy >= int(capacity * 0.90):
        alerts.append(
            f"[WARNING] {room_number}: "
            f"room is nearly full ({occupancy}/{capacity})"
        )

    if occupancy > 0 and engagement < 40:
        alerts.append(
            f"[WARNING] {room_number}: "
            f"low engagement detected ({engagement:.1f}%)"
        )

    return alerts


def push_sensor_data(
    room_id,
    occupancy,
    engagement
):
    try:
        payload = {
            "occupancy": occupancy,
            "engagement": round(engagement, 1)
        }
        response = requests.post(
            f"{BASE_URL}/ingest/room/{room_id}/",
            json=payload,
            timeout=5
        )
        if response.status_code == 200:
            data = response.json()
            print(
                f"  [OK] Room {room_id}: "
                f"{data['occupancy']} students, "
                f"{data['engagement']}% engagement"
            )
        else:
            print(
                f"  [WARN] Room {room_id}: "
                f"HTTP {response.status_code}"
            )
    except Exception as error:
        print(
            f"  [ERROR] Room {room_id}: {error}"
        )


def simulate():
    print("=" * 65)
    print(
        "  CampusFix Smart Sensor Simulator"
    )
    print(
        "  Occupancy + Engagement + Anomaly Detection"
    )
    print("=" * 65)

    while True:
        rooms = get_all_rooms()
        occupied_rooms = [
            room
            for room in rooms
            if room.get("current_status") == "occupied"
        ]

        if not occupied_rooms:
            print(
                "[INFO] No occupied rooms. "
                "Mark rooms as occupied first."
            )
        else:
            print(
                f"[INFO] Updating "
                f"{len(occupied_rooms)} occupied rooms..."
            )

            for room in occupied_rooms:
                room_id = room["id"]
                room_number = room.get(
                    "room_number",
                    f"Room {room_id}"
                )
                capacity = room.get(
                    "capacity",
                    60
                )
                occupancy = int(
                    capacity *
                    random.uniform(0.40, 0.98)
                )
                engagement = random.uniform(
                    35.0,
                    95.0
                )

                alerts = check_sensor_anomalies(
                    room_number,
                    occupancy,
                    capacity,
                    engagement
                )

                for alert in alerts:
                    print(f"  {alert}")

                push_sensor_data(
                    room_id,
                    occupancy,
                    engagement
                )

        print(
            f"[INFO] Next update in "
            f"{UPDATE_INTERVAL}s...\n"
        )
        time.sleep(UPDATE_INTERVAL)


if __name__ == "__main__":
    simulate()