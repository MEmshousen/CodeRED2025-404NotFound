from django.db import models
from django.conf import settings
from courses.models import Course

class StudyPacket(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="study_packets")
    status = models.CharField(max_length=20, default="PENDING")  # PENDING/READY/APPROVED/SENT
    payload = models.JSONField(default=dict, blank=True)         # quizzes/flashcards/summaries
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    approved_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"StudyPacket(course={self.course_id}, status={self.status})"
