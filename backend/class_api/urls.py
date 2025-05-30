from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CourseViewSet, ClassSectionViewSet, StudentViewSet, GradeViewSet

router = DefaultRouter()
router.register(r'courses', CourseViewSet)
router.register(r'sections', ClassSectionViewSet)
router.register(r'students', StudentViewSet)
router.register(r'grades', GradeViewSet)

urlpatterns = [
    path('', include(router.urls)),
] 