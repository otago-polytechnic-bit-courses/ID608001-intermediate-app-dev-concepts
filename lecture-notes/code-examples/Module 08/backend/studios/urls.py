from rest_framework.routers import DefaultRouter
from .views import StudioViewSet, StudioClassViewSet, BookingViewSet

router = DefaultRouter()
router.register("studios", StudioViewSet)
router.register("classes", StudioClassViewSet)
router.register("bookings", BookingViewSet)

urlpatterns = router.urls