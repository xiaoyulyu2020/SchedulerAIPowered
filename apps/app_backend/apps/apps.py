from django.apps import AppConfig
from django.db.models.signals import post_migrate
from django.dispatch import receiver
from .utils import *
from .decision_tree import *
import sys
class AppsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps'
    
    def ready(self):
        post_migrate.connect(self.run_on_startup, sender=self)
        
    def run_on_startup(self, **kwargs):
        # Once the backend running, it will check the csv and update the headers
        update_existing_config_headers()
        sys.stdout.flush()
