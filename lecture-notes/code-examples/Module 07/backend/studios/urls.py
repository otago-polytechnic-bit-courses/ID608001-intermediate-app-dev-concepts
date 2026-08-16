from rest_framework.routers import DefaultRouter
from .views import StudioViewSet, StudioClassViewSet

router = DefaultRouter()
router.register("studios", StudioViewSet)
router.register("classes", StudioClassViewSet)

urlpatterns = router.urls