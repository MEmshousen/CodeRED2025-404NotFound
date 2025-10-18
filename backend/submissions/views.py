from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets, permissions
from rest_framework.response import Response
from .models import PainPoint
from .serializers import PainPointSerializer, PainPointTeacherReadSerializer
from courses.models import Course
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer

class PainPointViewSet(viewsets.ModelViewSet):
    queryset = PainPoint.objects.all()
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        if self.request.user.role=="TEACHER":
            return PainPointTeacherReadSerializer
        return PainPointSerializer

    def perform_create(self, serializer):
        pp = serializer.save(author=self.request.user)
        # broadcast to room over websockets
        layer = get_channel_layer()
        async_to_sync(layer.group_send)(
            f"course_{pp.course_id}",
            {"type": "confusion.update", "course_id": pp.course_id, "pain_point_id": pp.id}
        )

    def get_queryset(self):
        qs = super().get_queryset()
        course_id = self.request.query_params.get("course")
        if course_id:
            qs = qs.filter(course_id=course_id)
        # teachers only see in their courses; students only in enrolled courses
        u = self.request.user
        if u.role=="TEACHER":
            return qs.filter(course__professor=u)
        return qs.filter(course__enrollments__student=u).distinct()
