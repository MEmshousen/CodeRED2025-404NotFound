from rest_framework import serializers
from .models import PainPoint

class PainPointTeacherReadSerializer(serializers.ModelSerializer):
    class Meta:
        model = PainPoint
        exclude = ("author",)  # hide author from teachers

class PainPointSerializer(serializers.ModelSerializer):
    class Meta:
        model = PainPoint
        fields = "__all__"
        read_only_fields = ("author",)
