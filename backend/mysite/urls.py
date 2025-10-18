"""
URL configuration for mysite project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

# urlpatterns = [
#     path('admin/', admin.site.urls),
# ]

# backend/urls.py
from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from courses.views import CourseViewSet
from submissions.views import PainPointViewSet
from analytics.views import AnalyticsViewSet
from aiops.views import StudyPacketViewSet
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

router = DefaultRouter()
router.register(r"courses", CourseViewSet, basename="courses")
router.register(r"pain-points", PainPointViewSet, basename="painpoints")
router.register(r"analytics", AnalyticsViewSet, basename="analytics")
router.register(r"study-packets", StudyPacketViewSet, basename="studypackets")

urlpatterns = [
  path("admin/", admin.site.urls),
  path("api/v1/auth/token/", TokenObtainPairView.as_view()),
  path("api/v1/auth/token/refresh/", TokenRefreshView.as_view()),
  path("api/v1/", include(router.urls)),
]
