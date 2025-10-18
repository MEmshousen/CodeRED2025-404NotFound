# Create your models here.
from django.db import models
from django.conf import settings

class Course(models.Model):
    code = models.CharField(max_length=50)       # e.g., CS101
    name = models.CharField(max_length=120)      # e.g., Intro to CS
    crn = models.CharField(max_length=50)        # Section ID
    professor = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="courses")
    created_at = models.DateTimeField(auto_now_add=True)

class Enrollment(models.Model):
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="enrollments")
    created_at = models.DateTimeField(auto_now_add=True)
    class Meta:
        unique_together = ("student","course")

class Material(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="materials")
    title = models.CharField(max_length=200)
    file = models.FileField(upload_to="materials/") # swap to Supabase/S3 in storage backend
    uploaded_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
