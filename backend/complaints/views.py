# pyrefly: ignore [missing-import]
from rest_framework.views import APIView
# pyrefly: ignore [missing-import]
from rest_framework.response import Response
# pyrefly: ignore [missing-import]
from rest_framework import status
# pyrefly: ignore [missing-import]
from django.db.models import Count, Q
# pyrefly: ignore [missing-import]
from django.utils import timezone
# pyrefly: ignore [missing-import]
from .models import Building, Room, RoomSchedule, InfrastructureIssue, Department
# pyrefly: ignore [missing-import]
from .serializers import (
    BuildingListSerializer, BuildingDetailSerializer,
    RoomListSerializer, RoomDetailSerializer,
    InfrastructureIssueSerializer, DepartmentSerializer
)

class BuildingListView(APIView):
    def get(self, request):
        buildings = Building.objects.all().order_by('code')
        serializer = BuildingListSerializer(buildings, many=True)
        return Response(serializer.data)

class BuildingDetailView(APIView):
    def get(self, request, pk):
        try:
            building = Building.objects.get(pk=pk)
        except Building.DoesNotExist:
            return Response({"error": "Building not found"}, status=status.HTTP_404_NOT_FOUND)
        serializer = BuildingDetailSerializer(building)
        return Response(serializer.data)

class RoomListView(APIView):
    def get(self, request):
        rooms = Room.objects.select_related('building').all()

        # Query Filters
        building_id = request.query_params.get('building')
        building_code = request.query_params.get('building_code')
        floor = request.query_params.get('floor')
        room_status = request.query_params.get('status')
        room_type = request.query_params.get('type')
        min_capacity = request.query_params.get('min_capacity')
        has_ac = request.query_params.get('has_ac')
        has_projector = request.query_params.get('has_projector')
        has_smart_board = request.query_params.get('has_smart_board')
        is_lab = request.query_params.get('is_lab')
        search = request.query_params.get('search')

        if building_id:
            rooms = rooms.filter(building_id=building_id)
        if building_code:
            rooms = rooms.filter(building__code__iexact=building_code)
        if floor is not None and floor != '':
            rooms = rooms.filter(floor_number=int(floor))
        if room_status:
            rooms = rooms.filter(current_status=room_status)
        if room_type:
            rooms = rooms.filter(room_type=room_type)
        if min_capacity:
            rooms = rooms.filter(capacity__gte=int(min_capacity))
        if has_ac == 'true':
            rooms = rooms.filter(has_ac=True)
        if has_projector == 'true':
            rooms = rooms.filter(has_projector=True)
        if has_smart_board == 'true':
            rooms = rooms.filter(has_smart_board=True)
        if is_lab == 'true':
            rooms = rooms.filter(room_type__in=['computer_lab', 'ai_gpu_lab', 'hardware_lab', 'mechanical_lab', 'science_lab'])
        if search:
            rooms = rooms.filter(
                Q(room_number__icontains=search) |
                Q(name__icontains=search) |
                Q(building__name__icontains=search) |
                Q(current_activity__icontains=search)
            )

        serializer = RoomListSerializer(rooms, many=True)
        return Response(serializer.data)

class RoomDetailView(APIView):
    def get(self, request, pk):
        try:
            room = Room.objects.select_related('building').prefetch_related('schedules', 'issues').get(pk=pk)
        except Room.DoesNotExist:
            return Response({"error": "Room not found"}, status=status.HTTP_404_NOT_FOUND)
        serializer = RoomDetailSerializer(room)
        return Response(serializer.data)

class RoomToggleStatusView(APIView):
    def post(self, request, pk):
        try:
            room = Room.objects.get(pk=pk)
        except Room.DoesNotExist:
            return Response({"error": "Room not found"}, status=status.HTTP_404_NOT_FOUND)

        new_status = request.data.get('status')
        if new_status not in ['vacant', 'occupied', 'reserved', 'maintenance']:
            return Response({"error": "Invalid status value"}, status=status.HTTP_400_BAD_REQUEST)

        room.current_status = new_status
        if new_status == 'vacant':
            room.current_activity = ""
            room.current_instructor = ""
            room.next_available_time = "Now Available"
        elif new_status == 'occupied':
            room.current_activity = request.data.get('activity', 'In Session / Faculty Scheduled')
            room.current_instructor = request.data.get('instructor', 'MIT-WPU Faculty')
            room.next_available_time = request.data.get('next_available', 'In 1 Hour')
        elif new_status == 'reserved':
            room.current_activity = request.data.get('activity', 'Reserved for Event / Meeting')
        elif new_status == 'maintenance':
            room.current_activity = request.data.get('activity', 'Under Facility Maintenance')

        room.save()
        serializer = RoomDetailSerializer(room)
        return Response(serializer.data)

class InfrastructureIssueListView(APIView):
    def get(self, request):
        issues = InfrastructureIssue.objects.select_related('room', 'room__building').all().order_by('-created_at')
        
        status_filter = request.query_params.get('status')
        building_code = request.query_params.get('building')
        priority = request.query_params.get('priority')
        category = request.query_params.get('category')

        if status_filter:
            issues = issues.filter(status=status_filter)
        if building_code:
            issues = issues.filter(room__building__code__iexact=building_code)
        if priority:
            issues = issues.filter(priority=priority)
        if category:
            issues = issues.filter(category=category)

        serializer = InfrastructureIssueSerializer(issues, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = InfrastructureIssueSerializer(data=request.data)
        if serializer.is_valid():
            issue = serializer.save()
            # If critical priority, optionally update room status
            if issue.priority == 'critical':
                issue.room.current_status = 'maintenance'
                issue.room.save()
            return Response(InfrastructureIssueSerializer(issue).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class InfrastructureIssueDetailView(APIView):
    def patch(self, request, pk):
        try:
            issue = InfrastructureIssue.objects.get(pk=pk)
        except InfrastructureIssue.DoesNotExist:
            return Response({"error": "Issue not found"}, status=status.HTTP_404_NOT_FOUND)

        new_status = request.data.get('status')
        if new_status:
            issue.status = new_status
            if new_status == 'resolved':
                issue.resolved_at = timezone.now()
        
        if 'assigned_technician' in request.data:
            issue.assigned_technician = request.data.get('assigned_technician')
        if 'resolution_notes' in request.data:
            issue.resolution_notes = request.data.get('resolution_notes')
            
        issue.save()
        return Response(InfrastructureIssueSerializer(issue).data)

class CampusAnalyticsView(APIView):
    def get(self, request):
        total_rooms = Room.objects.count()
        vacant_rooms = Room.objects.filter(current_status='vacant').count()
        occupied_rooms = Room.objects.filter(current_status='occupied').count()
        maintenance_rooms = Room.objects.filter(current_status='maintenance').count()
        reserved_rooms = Room.objects.filter(current_status='reserved').count()

        # Labs breakdown
        labs = Room.objects.filter(room_type__in=['computer_lab', 'ai_gpu_lab', 'hardware_lab', 'mechanical_lab', 'science_lab'])
        total_labs = labs.count()
        vacant_labs = labs.filter(current_status='vacant').count()
        occupied_labs = labs.filter(current_status='occupied').count()

        # Classrooms breakdown
        classrooms = Room.objects.filter(room_type__in=['smart_classroom', 'lecture_hall', 'seminar_hall'])
        total_classrooms = classrooms.count()
        vacant_classrooms = classrooms.filter(current_status='vacant').count()

        # Issues
        open_issues = InfrastructureIssue.objects.filter(status__in=['open', 'in_progress']).count()
        critical_issues = InfrastructureIssue.objects.filter(status__in=['open', 'in_progress'], priority='critical').count()

        # Energy Alert (vacant rooms with energy_mode_active)
        energy_alerts_count = Room.objects.filter(current_status='vacant', energy_mode_active=True).count()

        # Buildings breakdown
        buildings_data = []
        for b in Building.objects.all():
            b_total = b.rooms.count()
            b_vacant = b.rooms.filter(current_status='vacant').count()
            b_issues = b.rooms.filter(issues__status__in=['open', 'in_progress']).distinct().count()
            buildings_data.append({
                'id': b.id,
                'name': b.name,
                'code': b.code,
                'total_rooms': b_total,
                'vacant_rooms': b_vacant,
                'occupancy_rate': round(((b_total - b_vacant) / b_total * 100) if b_total > 0 else 0),
                'active_issues': b_issues,
            })

        return Response({
            'campus_name': 'MIT World Peace University (MIT-WPU), Pune',
            'summary': {
                'total_rooms': total_rooms,
                'vacant_rooms': vacant_rooms,
                'occupied_rooms': occupied_rooms,
                'maintenance_rooms': maintenance_rooms,
                'reserved_rooms': reserved_rooms,
                'occupancy_rate': round((occupied_rooms / total_rooms * 100) if total_rooms > 0 else 0),
                'vacancy_rate': round((vacant_rooms / total_rooms * 100) if total_rooms > 0 else 0),
            },
            'labs': {
                'total': total_labs,
                'vacant': vacant_labs,
                'occupied': occupied_labs,
                'occupancy_rate': round((occupied_labs / total_labs * 100) if total_labs > 0 else 0),
            },
            'classrooms': {
                'total': total_classrooms,
                'vacant': vacant_classrooms,
                'occupied': total_classrooms - vacant_classrooms,
            },
            'infrastructure': {
                'open_issues': open_issues,
                'critical_issues': critical_issues,
                'energy_alerts': energy_alerts_count,
            },
            'buildings_breakdown': buildings_data
        })

class RoomDataIngestionView(APIView):
    def post(self, request, pk):
        try:
            room = Room.objects.get(pk=pk)
        except Room.DoesNotExist:
            return Response({"error": "Room not found"}, status=status.HTTP_404_NOT_FOUND)
        
        occupancy = request.data.get('occupancy')
        engagement = request.data.get('engagement')
        
        if occupancy is not None:
            room.current_occupancy = int(occupancy)
        if engagement is not None:
            room.engagement_score = float(engagement)
            
        room.last_sensor_update = timezone.now()
        room.save()
        
        return Response({
            "status": "success", 
            "room_id": room.id, 
            "occupancy": room.current_occupancy, 
            "engagement": room.engagement_score
        })
