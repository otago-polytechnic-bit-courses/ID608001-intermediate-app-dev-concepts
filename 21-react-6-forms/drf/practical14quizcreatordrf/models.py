from django.contrib.auth.models import AbstractUser
from django.db import models
from requests import exceptions, get 

def fetch_categories():
    try:
        req = get('https://opentdb.com/api_category.php')
        res = req.json()
        data = res['trivia_categories']
        categories = [tuple(d.values()) for d in data]
        converted_categories = [tuple((str(c[0]), c[1])) for c in categories]
        return converted_categories
    except exceptions.ConnectionError as conn_err:
        print(conn_err)

class User(AbstractUser):
    username = models.CharField(max_length=25, unique=True, blank=False)
    email = models.EmailField(unique=True, blank=False)
    first_name = models.CharField(max_length=200, blank=False)
    last_name = models.CharField(max_length=200, blank=False)

    def __str__(self):
        return self.username

class Quiz(models.Model):
    CATEGORIES = [(' ', 'Any Category'),
                ('9', 'General Knowledge'),
                ('18', 'Science: Computers'),
                ('21', 'Sport'),
                ('22', 'Geography'),
                ('27', 'Animals')]
    DIFFICULTIES = [(' ', 'Any Difficulty'),
                    ('easy', 'Easy'),
                    ('medium', 'Medium'),
                    ('hard', 'Hard')]
    creator = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=200, null=False)
    category = models.CharField(max_length=200, choices=CATEGORIES, null=False)
    difficulty = models.CharField(max_length=200, choices=DIFFICULTIES, null=False)

    def __str__(self):
        return self.name