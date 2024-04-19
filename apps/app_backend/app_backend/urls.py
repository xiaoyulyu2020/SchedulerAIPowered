from django.contrib import admin
from django.urls import path, include

# base url. home/ url will extent to the apps's urls. Any url in apps, will be add home/* as default.
urlpatterns = [
    path('admin/', admin.site.urls),
    path('home/', include('apps.urls'))
]
