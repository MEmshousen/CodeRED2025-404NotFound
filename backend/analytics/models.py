# Create your models here.
from django.db import models
from courses.models import Course

class ConfusionSnapshot(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="confusion_snapshots")
    window_start = models.DateTimeField()
    window_end = models.DateTimeField()
    count = models.IntegerField(default=0)
    top_topics = models.JSONField(default=list, blank=True)  # ["recursion", "matrix mult"]
    summary = models.TextField(blank=True)  # AI-generated
    created_at = models.DateTimeField(auto_now_add=True)
