# backend/analytics/views.py
from rest_framework import viewsets, decorators
from rest_framework.response import Response
from submissions.models import PainPoint
from django.utils import timezone
from collections import Counter

class AnalyticsViewSet(viewsets.ViewSet):
    """
    Provides lightweight analytics data for a given course.
    Teachers can use this to see confusion spikes or top pain points.
    """

    @decorators.action(detail=False, methods=["get"])
    def course(self, request):
        course_id = request.query_params.get("course")
        if not course_id:
            return Response({"error": "Missing course ID"}, status=400)

        now = timezone.now()
        window_start = now - timezone.timedelta(minutes=15)

        qs = PainPoint.objects.filter(course_id=course_id, created_at__gte=window_start)
        top_topics = Counter([pp.topic or "general" for pp in qs]).most_common(5)

        payload = {
            "course_id": course_id,
            "count_last_15m": qs.count(),
            "top_topics": top_topics,
            "total_submissions": PainPoint.objects.filter(course_id=course_id).count(),
        }
        return Response(payload)
