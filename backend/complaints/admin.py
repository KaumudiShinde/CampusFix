# pyrefly: ignore [missing-import]
from django.contrib import admin
# pyrefly: ignore [missing-import]
from .models import Department, Building, Room, RoomSchedule, InfrastructureIssue

@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ('name', 'code', 'head_name')
    search_fields = ('name', 'code')

@admin.register(Building)
class BuildingAdmin(admin.ModelAdmin):
    list_display = ('name', 'code', 'total_floors', 'wing_or_zone', 'created_at')
    search_fields = ('name', 'code')

@admin.register(Room)
class RoomAdmin(admin.ModelAdmin):
    list_display = ('room_number', 'building', 'floor_number', 'room_type', 'capacity', 'current_status', 'has_ac', 'has_projector')
    list_filter = ('building', 'floor_number', 'room_type', 'current_status', 'has_ac', 'has_projector')
    search_fields = ('room_number', 'name', 'building__name')

@admin.register(RoomSchedule)
class RoomScheduleAdmin(admin.ModelAdmin):
    list_display = ('room', 'day', 'start_time', 'end_time', 'title', 'faculty_name')
    list_filter = ('day',)
    search_fields = ('title', 'faculty_name', 'room__room_number')

@admin.register(InfrastructureIssue)
class InfrastructureIssueAdmin(admin.ModelAdmin):
    list_display = ('ticket_id', 'room', 'title', 'category', 'priority', 'status', 'reported_by_name', 'created_at')
    list_filter = ('category', 'priority', 'status')
    search_fields = ('ticket_id', 'title', 'room__room_number')
