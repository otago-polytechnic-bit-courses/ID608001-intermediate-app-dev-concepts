from django.urls import include, path
from rest_framework import routers
from . import views

app_name = 'practical14quizcreatordrf'

router = routers.DefaultRouter()
router.register(r'api/user', views.UserViewSet)
router.register(r'api/quiz', views.QuizViewSet)

urlpatterns = [
    path('api/', include(router.urls), name='api'),
]

urlpatterns += router.urls