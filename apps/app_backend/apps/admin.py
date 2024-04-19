from django.contrib import admin
from .models import *

admin.site.register(Employee)
admin.site.register(Date)
admin.site.register(ScheduleHistory)
admin.site.register(InHoliday)