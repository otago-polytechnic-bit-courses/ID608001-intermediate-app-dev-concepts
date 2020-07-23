from django.contrib import admin, auth
from django.contrib.auth.admin import UserAdmin
from .models import User, Question, Choice

admin.site.register(User, UserAdmin)
admin.site.register(Question)
admin.site.register(Choice)