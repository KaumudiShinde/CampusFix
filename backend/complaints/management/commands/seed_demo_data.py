from django.core.management.base import BaseCommand
from complaints.models import Department, Building, Room


class Command(BaseCommand):
    help = "Seed demo campus data for testing"

    def handle(self, *args, **kwargs):

        # Department
        department, _ = Department.objects.get_or_create(
            code="CSE",
            defaults={
                "name": "Computer Science and Engineering",
                "head_name": "Dr. Demo Faculty",
            },
        )

        # Building
        building, _ = Building.objects.get_or_create(
            code="CAMPUS-01",
            defaults={
                "name": "Main Academic Block",
                "short_name": "Main Block",
                "wing_or_zone": "Central Campus",
                "total_floors": 5,
                "description": "Demo building created by seed command.",
            },
        )

        building.primary_departments.add(department)

        # Rooms
        rooms = [
            {
                "room_number": "S-101",
                "name": "Smart Classroom 101",
                "floor_number": 1,
                "room_type": "smart_classroom",
                "capacity": 60,
            },
            {
                "room_number": "S-102",
                "name": "Computer Lab 102",
                "floor_number": 1,
                "room_type": "computer_lab",
                "capacity": 50,
            },
            {
                "room_number": "S-201",
                "name": "AI Lab 201",
                "floor_number": 2,
                "room_type": "ai_gpu_lab",
                "capacity": 40,
            },
        ]

        for room_data in rooms:
            room, created = Room.objects.get_or_create(
                building=building,
                room_number=room_data["room_number"],
                defaults={
                    **room_data,
                    "department": department,
                },
            )

            if created:
                self.stdout.write(
                    self.style.SUCCESS(
                        f"Created room: {room.room_number}"
                    )
                )
            else:
                self.stdout.write(
                    f"Room already exists: {room.room_number}"
                )

        self.stdout.write(
            self.style.SUCCESS("Demo data seeding completed successfully.")
        )