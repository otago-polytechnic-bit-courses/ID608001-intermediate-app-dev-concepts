from django.contrib import admin, auth
from django.contrib.auth.admin import UserAdmin
from .models import User, Quiz

admin.site.register(User, UserAdmin)
admin.site.register(Quiz)
