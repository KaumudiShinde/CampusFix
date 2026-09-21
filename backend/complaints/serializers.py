# pyrefly: ignore [missing-import]
from rest_framework import serializers
from .models import Department, Building, Room, RoomSchedule, InfrastructureIssue

class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = ['id', 'name', 'code', 'head_name']

class InfrastructureIssueSerializer(serializers.ModelSerializer):
    room_number = serializers.CharField(source='room.room_number', read_only=True)
    building_name = serializers.CharField(source='room.building.name', read_only=True)
    building_code = serializers.CharField(source='room.building.code', read_only=True)
    category_display = serializers.CharField(source='get_category_display', read_only=True)
    priority_display = serializers.CharField(source='get_priority_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = InfrastructureIssue
        fields = [
            'id', 'ticket_id', 'room', 'room_number', 'building_name', 'building_code',
            'title', 'description', 'category', 'category_display',
            'priority', 'priority_display', 'status', 'status_display',
            'reported_by_name', 'reported_by_email', 'assigned_technician',
            'resolution_notes', 'created_at', 'updated_at', 'resolved_at'
        ]

class RoomScheduleSerializer(serializers.ModelSerializer):
    day_display = serializers.CharField(source='get_day_display', read_only=True)

    class Meta:
        model = RoomSchedule
        fields = ['id', 'day', 'day_display', 'start_time', 'end_time', 'title', 'faculty_name', 'batch_info']

class RoomListSerializer(serializers.ModelSerializer):
    building_name = serializers.CharField(source='building.name', read_only=True)
    building_code = serializers.CharField(source='building.code', read_only=True)
    room_type_display = serializers.CharField(source='get_room_type_display', read_only=True)
    status_display = serializers.CharField(source='get_current_status_display', read_only=True)
    active_issues_count = serializers.SerializerMethodField()

    class Meta:
        model = Room
        fields = [
            'id', 'building', 'building_name', 'building_code', 'room_number', 'name',
            'floor_number', 'room_type', 'room_type_display', 'capacity',
            'current_status', 'status_display', 'current_activity', 'current_instructor',
            'next_available_time', 'has_ac', 'has_projector', 'has_smart_board',
            'has_wifi', 'has_sound_system', 'workstations_count', 'power_backup',
            'energy_mode_active', 'active_issues_count',
            'current_occupancy', 'engagement_score', 'last_sensor_update'
        ]

    def get_active_issues_count(self, obj):
        return obj.issues.filter(status__in=['open', 'in_progress']).count()

class RoomDetailSerializer(serializers.ModelSerializer):
    building_name = serializers.CharField(source='building.name', read_only=True)
    building_code = serializers.CharField(source='building.code', read_only=True)
    room_type_display = serializers.CharField(source='get_room_type_display', read_only=True)
    status_display = serializers.CharField(source='get_current_status_display', read_only=True)
    schedules = RoomScheduleSerializer(many=True, read_only=True)
    issues = InfrastructureIssueSerializer(many=True, read_only=True)
    active_issues = serializers.SerializerMethodField()

    class Meta:
        model = Room
        fields = [
            'id', 'building', 'building_name', 'building_code', 'room_number', 'name',
            'floor_number', 'room_type', 'room_type_display', 'capacity',
            'current_status', 'status_display', 'current_activity', 'current_instructor',
            'next_available_time', 'has_ac', 'has_projector', 'has_smart_board',
            'has_wifi', 'has_sound_system', 'workstations_count', 'power_backup',
            'energy_mode_active', 'schedules', 'issues', 'active_issues',
            'current_occupancy', 'engagement_score', 'last_sensor_update'
        ]

    def get_active_issues(self, obj):
        active = obj.issues.filter(status__in=['open', 'in_progress'])
        return InfrastructureIssueSerializer(active, many=True).data

class BuildingListSerializer(serializers.ModelSerializer):
    total_rooms = serializers.IntegerField(source='total_rooms_count', read_only=True)
    vacant_rooms = serializers.IntegerField(source='vacant_rooms_count', read_only=True)
    occupied_rooms = serializers.IntegerField(source='occupied_rooms_count', read_only=True)
    active_issues = serializers.IntegerField(source='active_issues_count', read_only=True)
    occupancy_percentage = serializers.SerializerMethodField()

    class Meta:
        model = Building
        fields = [
            'id', 'name', 'code', 'short_name', 'wing_or_zone', 'total_floors',
            'description', 'latitude', 'longitude', 'map_x', 'map_y', 'map_width', 'map_height',
            'building_icon', 'color_accent', 'total_rooms', 'vacant_rooms',
            'occupied_rooms', 'active_issues', 'occupancy_percentage'
        ]

    def get_occupancy_percentage(self, obj):
        total = obj.rooms.count()
        if total == 0:
            return 0
        occupied = obj.rooms.filter(current_status='occupied').count()
        return round((occupied / total) * 100)

class BuildingDetailSerializer(serializers.ModelSerializer):
    rooms = RoomListSerializer(many=True, read_only=True)
    total_rooms = serializers.IntegerField(source='total_rooms_count', read_only=True)
    vacant_rooms = serializers.IntegerField(source='vacant_rooms_count', read_only=True)
    occupied_rooms = serializers.IntegerField(source='occupied_rooms_count', read_only=True)
    active_issues = serializers.IntegerField(source='active_issues_count', read_only=True)
    floors_summary = serializers.SerializerMethodField()

    class Meta:
        model = Building
        fields = [
            'id', 'name', 'code', 'short_name', 'wing_or_zone', 'total_floors',
            'description', 'latitude', 'longitude', 'map_x', 'map_y', 'map_width', 'map_height',
            'building_icon', 'color_accent', 'total_rooms', 'vacant_rooms',
            'occupied_rooms', 'active_issues', 'floors_summary', 'rooms'
        ]

    def get_floors_summary(self, obj):
        result = []
        for floor in range(obj.total_floors + 1):
            floor_rooms = obj.rooms.filter(floor_number=floor)
            if floor_rooms.exists():
                result.append({
                    'floor_number': floor,
                    'floor_label': f"Ground Floor" if floor == 0 else f"Floor {floor}",
                    'total': floor_rooms.count(),
                    'vacant': floor_rooms.filter(current_status='vacant').count(),
                    'occupied': floor_rooms.filter(current_status='occupied').count(),
                    'maintenance': floor_rooms.filter(current_status='maintenance').count(),
                })
        return result