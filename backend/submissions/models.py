# Create your models here.
from django.db import models
from django.conf import settings
from courses.models import Course

class PainPoint(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="pain_points")
    # we keep author but don't expose to teachers in API to preserve anonymity
    author = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, on_delete=models.SET_NULL, related_name="pain_points")
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    # optional simple topic tag
    topic = models.CharField(max_length=120, blank=True)

class StudyPacket(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="study_packets")
    status = models.CharField(max_length=20, default="PENDING") # PENDING/READY/APPROVED/SENT
    payload = models.JSONField(default=dict, blank=True) # quizzes/flashcards/summaries
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    approved_at = models.DateTimeField(null=True, blank=True)
