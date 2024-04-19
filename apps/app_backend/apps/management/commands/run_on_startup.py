# myapp/management/commands/run_on_startup.py
from datetime import datetime
from django.core.management.base import BaseCommand
from apps.views import deleteFromHolidayIfEnd

class Command(BaseCommand):
    def handle(self, *args, **options):
        today = datetime.now().strftime('%Y-%m-%d')
        deleteFromHolidayIfEnd(today)
        self.stdout.write(self.style.SUCCESS('Function executed successfully.'))
