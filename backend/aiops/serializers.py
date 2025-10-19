# backend/aiops/serializers.py
from rest_framework import serializers
from .models import StudyPacket

class StudyPacketSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudyPacket
        fields = "__all__"
        read_only_fields = ("status", "payload", "created_by", "created_at", "approved_at")
