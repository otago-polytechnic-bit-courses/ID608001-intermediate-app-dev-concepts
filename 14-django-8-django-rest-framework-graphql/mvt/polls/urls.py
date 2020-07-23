from django.contrib.auth import views as auth_views
from django.urls import include, path
from graphene_django.views import GraphQLView
from rest_framework import routers
from . import views

app_name = 'polls'

router = routers.DefaultRouter()
router.register(r'api/user', views.UserViewSet)
router.register(r'api/question', views.QuestionViewSet)
router.register(r'api/choice', views.ChoiceViewSet)

urlpatterns = [
    path('api/', include(router.urls), name='api'),
    path('graphql/', GraphQLView.as_view(graphiql=True)),
    path('accounts/signup/', views.SignupView.as_view(), name='signup'),
    path('accounts/login/', auth_views.LoginView.as_view(), name='login'),
    path('accounts/logout/', auth_views.LogoutView.as_view(), name='logout'),
    path('', views.IndexView.as_view(), name='index'), # /polls/
    path('<int:pk>/', views.DetailView.as_view(), name='detail'), # /polls/2/
    path('<int:pk>/results/', views.ResultsView.as_view(), name='results'), # /polls/2/results/
    path('<int:question_id>/vote/', views.vote, name='vote'), # /polls/2/vote/
]

urlpatterns += router.urls