# pyrefly: ignore [missing-import]
from django.db import models
# pyrefly: ignore [missing-import]
from django.contrib.auth.models import User
import uuid

class Department(models.Model):
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=20, unique=True)
    head_name = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return f"{self.name} ({self.code})"

class Building(models.Model):
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=30, unique=True)  # e.g., SARASWATI, RAMANUJAN, CHANAKYA
    short_name = models.CharField(max_length=50, blank=True) # e.g. Saraswati Block
    wing_or_zone = models.CharField(max_length=50, default="Central Campus")
    total_floors = models.PositiveIntegerField(default=5)
    description = models.TextField(blank=True, null=True)
    primary_departments = models.ManyToManyField(Department, blank=True, related_name='buildings')
    
    # Real GPS Coordinates (MIT-WPU Kothrud Campus)
    latitude = models.FloatField(default=18.5186, help_text="GPS Latitude")
    longitude = models.FloatField(default=73.8153, help_text="GPS Longitude")

    # Campus Map coordinates (percentage on 2D map: 0-100)
    map_x = models.FloatField(default=50.0, help_text="X position percentage on campus map (0-100)")
    map_y = models.FloatField(default=50.0, help_text="Y position percentage on campus map (0-100)")
    map_width = models.FloatField(default=12.0)
    map_height = models.FloatField(default=10.0)
    building_icon = models.CharField(max_length=50, default="Building2") # Icon name
    color_accent = models.CharField(max_length=20, default="#3b82f6") # Hex color

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.code})"

    @property
    def total_rooms_count(self):
        return self.rooms.count()

    @property
    def vacant_rooms_count(self):
        return self.rooms.filter(current_status='vacant').count()

    @property
    def occupied_rooms_count(self):
        return self.rooms.filter(current_status='occupied').count()

    @property
    def active_issues_count(self):
        return self.rooms.filter(issues__status__in=['open', 'in_progress']).distinct().count()

class Room(models.Model):
    ROOM_TYPE_CHOICES = (
        ('smart_classroom', 'Smart Classroom'),
        ('lecture_hall', 'Lecture Theatre / Hall'),
        ('computer_lab', 'Computer & Software Lab'),
        ('ai_gpu_lab', 'AI / High Performance Computing Lab'),
        ('hardware_lab', 'Electronics & IoT Lab'),
        ('mechanical_lab', 'Robotics & Mechanical Lab'),
        ('science_lab', 'Physics / Chemistry Research Lab'),
        ('seminar_hall', 'Seminar & Conference Hall'),
        ('auditorium', 'Auditorium'),
    )

    STATUS_CHOICES = (
        ('vacant', 'Vacant / Available'),
        ('occupied', 'In Session / Occupied'),
        ('reserved', 'Reserved'),
        ('maintenance', 'Under Maintenance'),
    )

    building = models.ForeignKey(Building, on_delete=models.CASCADE, related_name='rooms')
    room_number = models.CharField(max_length=20) # e.g. "S-204", "R-301", "C-102"
    name = models.CharField(max_length=100, blank=True) # e.g. "Advanced AI & Deep Learning Lab"
    floor_number = models.IntegerField(default=0, help_text="0 for Ground, 1 for 1st floor, etc.")
    room_type = models.CharField(max_length=30, choices=ROOM_TYPE_CHOICES, default='smart_classroom')
    capacity = models.PositiveIntegerField(default=60)
    
    # Live Status
    current_status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='vacant')
    current_activity = models.CharField(max_length=200, blank=True, null=True, help_text="e.g. CS-301 Operating Systems (Prof. Verma)")
    current_instructor = models.CharField(max_length=100, blank=True, null=True)
    next_available_time = models.CharField(max_length=100, blank=True, null=True, help_text="e.g. Available at 01:15 PM")
    current_occupancy = models.PositiveIntegerField(default=0, help_text="Live count of students present")
    engagement_score = models.FloatField(default=0.0, help_text="Live engagement percentage 0-100")
    last_sensor_update = models.DateTimeField(null=True, blank=True, help_text="Last time real sensor data was received")
    
    # Infrastructure Amenities & Equipment Details
    has_ac = models.BooleanField(default=True)
    has_projector = models.BooleanField(default=True)
    has_smart_board = models.BooleanField(default=False)
    has_wifi = models.BooleanField(default=True)
    has_sound_system = models.BooleanField(default=True)
    workstations_count = models.PositiveIntegerField(default=0, help_text="Number of computer terminals if lab")
    power_backup = models.BooleanField(default=True)
    energy_mode_active = models.BooleanField(default=False, help_text="True if room is vacant but lights/AC are running")

    department = models.ForeignKey(Department, on_delete=models.SET_NULL, null=True, blank=True, related_name='rooms')
    last_status_updated = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['building', 'floor_number', 'room_number']
        unique_together = ('building', 'room_number')

    def __str__(self):
        return f"{self.building.code} - {self.room_number} ({self.name or self.get_room_type_display()})"

class RoomSchedule(models.Model):
    DAY_CHOICES = (
        ('monday', 'Monday'),
        ('tuesday', 'Tuesday'),
        ('wednesday', 'Wednesday'),
        ('thursday', 'Thursday'),
        ('friday', 'Friday'),
        ('saturday', 'Saturday'),
    )

    room = models.ForeignKey(Room, on_delete=models.CASCADE, related_name='schedules')
    day = models.CharField(max_length=15, choices=DAY_CHOICES, default='monday')
    start_time = models.CharField(max_length=10, help_text="e.g. 09:00 AM")
    end_time = models.CharField(max_length=10, help_text="e.g. 11:00 AM")
    title = models.CharField(max_length=150) # e.g. "Object Oriented Programming Lab"
    faculty_name = models.CharField(max_length=100)
    batch_info = models.CharField(max_length=50, blank=True, help_text="e.g. B.Tech CSE Batch A3")

    def __str__(self):
        return f"{self.room.room_number}: {self.title} ({self.start_time}-{self.end_time})"

class InfrastructureIssue(models.Model):
    CATEGORY_CHOICES = (
        ('projector_av', 'Projector & AV System'),
        ('workstation_pc', 'Computer / Workstations / OS'),
        ('ac_cooling', 'Air Conditioning & Ventilation'),
        ('network_wifi', 'Wi-Fi & LAN Connectivity'),
        ('electrical_power', 'Power Outlets & Lighting'),
        ('furniture', 'Chairs, Benches & Whiteboards'),
        ('lab_equipment', 'Specialized Lab Hardware'),
        ('cleanliness', 'Housekeeping & Cleanliness'),
        ('other', 'Other Facility Issue'),
    )

    PRIORITY_CHOICES = (
        ('low', 'Low (Non-urgent)'),
        ('medium', 'Medium (Standard)'),
        ('high', 'High (Affects Lectures)'),
        ('critical', 'Critical (Immediate Attention)'),
    )

    STATUS_CHOICES = (
        ('open', 'Reported / Open'),
        ('in_progress', 'Technician Assigned / In Progress'),
        ('resolved', 'Resolved'),
        ('closed', 'Closed'),
    )

    ticket_id = models.CharField(max_length=30, unique=True, blank=True)
    room = models.ForeignKey(Room, on_delete=models.CASCADE, related_name='issues')
    title = models.CharField(max_length=200)
    description = models.TextField()
    category = models.CharField(max_length=30, choices=CATEGORY_CHOICES, default='other')
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='medium')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='open')
    
    reported_by_name = models.CharField(max_length=100, default="Faculty / Student")
    reported_by_email = models.CharField(max_length=100, blank=True)
    assigned_technician = models.CharField(max_length=100, blank=True, null=True)
    
    resolution_notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    resolved_at = models.DateTimeField(blank=True, null=True)

    def save(self, *args, **kwargs):
        if not self.ticket_id:
            self.ticket_id = f"MIT-INF-{uuid.uuid4().hex[:6].upper()}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"[{self.ticket_id}] {self.room.room_number} - {self.title} ({self.status})"
