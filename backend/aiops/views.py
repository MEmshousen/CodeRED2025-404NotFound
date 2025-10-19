# backend/aiops/views.py
from rest_framework import viewsets, permissions, decorators
from rest_framework.response import Response
from django.utils import timezone

from .models import StudyPacket
from .serializers import StudyPacketSerializer

class StudyPacketViewSet(viewsets.ModelViewSet):
    queryset = StudyPacket.objects.all().select_related("course", "created_by")
    serializer_class = StudyPacketSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        u = self.request.user
        if getattr(u, "role", None) == "TEACHER":
            return self.queryset.filter(course__professor=u)
        return self.queryset.filter(course__enrollments__student=u).distinct()

    def perform_create(self, serializer):
        # keep it simple first; add Celery later
        packet = serializer.save(created_by=self.request.user, status="PENDING")
        return packet

    @decorators.action(detail=True, methods=["post"])
    def approve(self, request, pk=None):
        pkt = self.get_object()
        pkt.status = "APPROVED"
        pkt.approved_at = timezone.now()
        pkt.save(update_fields=["status", "approved_at"])
        return Response({"ok": True})
