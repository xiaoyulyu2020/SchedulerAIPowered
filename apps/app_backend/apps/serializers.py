from rest_framework import serializers
from .models import *

class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = "__all__"

class ScheduleHistorySerilizer(serializers.ModelSerializer):
    class Meta:
        model = ScheduleHistory
        fields = "__all__"

class InHolidaySerializer(serializers.ModelSerializer):
    class Meta:
        model = InHoliday
        fields = "__all__"
