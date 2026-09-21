# pyrefly: ignore [missing-import]
from django.urls import path
# pyrefly: ignore [missing-import]
from .views import (
    BuildingListView, BuildingDetailView,
    RoomListView, RoomDetailView, RoomToggleStatusView,
    InfrastructureIssueListView, InfrastructureIssueDetailView,
    CampusAnalyticsView, RoomDataIngestionView
)

urlpatterns = [
    path('buildings/', BuildingListView.as_view(), name='building-list'),
    path('buildings/<int:pk>/', BuildingDetailView.as_view(), name='building-detail'),
    path('rooms/', RoomListView.as_view(), name='room-list'),
    path('rooms/<int:pk>/', RoomDetailView.as_view(), name='room-detail'),
    path('rooms/<int:pk>/toggle-status/', RoomToggleStatusView.as_view(), name='room-toggle-status'),
    path('infrastructure-issues/', InfrastructureIssueListView.as_view(), name='issue-list'),
    path('infrastructure-issues/<int:pk>/', InfrastructureIssueDetailView.as_view(), name='issue-detail'),
    path('analytics/campus-summary/', CampusAnalyticsView.as_view(), name='campus-analytics'),
    path('ingest/room/<int:pk>/', RoomDataIngestionView.as_view(), name='room-data-ingestion'),
]