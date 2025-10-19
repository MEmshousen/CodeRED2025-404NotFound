from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    class Role(models.TextChoices):
        TEACHER = "TEACHER", "Teacher"
        STUDENT = "STUDENT", "Student"
    role = models.CharField(max_length=10, choices=Role.choices, default=Role.STUDENT)
    display_name = models.CharField(max_length=120, blank=True)
