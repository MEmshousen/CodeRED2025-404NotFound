from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets, permissions, decorators, response, status
from .models import Course, Enrollment
from .serializers import CourseSerializer, EnrollmentSerializer

class IsTeacher(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role=="TEACHER"

class CourseViewSet(viewsets.ModelViewSet):
    serializer_class = CourseSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Course.objects.all()

    def get_queryset(self):
        u = self.request.user
        if u.role=="TEACHER":
            return Course.objects.filter(professor=u)
        return Course.objects.filter(enrollments__student=u).distinct()

    def perform_create(self, serializer):
        return serializer.save(professor=self.request.user)

    @decorators.action(detail=True, methods=["post"], permission_classes=[permissions.IsAuthenticated])
    def join(self, request, pk=None):
        course = self.get_object()
        Enrollment.objects.get_or_create(course=course, student=request.user)
        return response.Response({"ok": True})
