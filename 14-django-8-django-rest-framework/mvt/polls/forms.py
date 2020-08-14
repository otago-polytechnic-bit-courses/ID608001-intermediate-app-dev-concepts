from django.contrib.auth import forms
from .models import User

class SignupForm(forms.UserCreationForm):
    class Meta:
        model = User
        fields = ['username', 'first_name', 'last_name', 'email']