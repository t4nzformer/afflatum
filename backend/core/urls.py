from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from .views import (
    RegisterView,
    ProjectViewSet,
    CommentViewSet,
    LikeViewSet,
    UserProfileViewSet,
    my_profile,
    my_projects,  # new import
)

router = DefaultRouter()
router.register(r'projects', ProjectViewSet)
router.register(r'comments', CommentViewSet)
router.register(r'likes', LikeViewSet)
router.register(r'profiles', UserProfileViewSet)

urlpatterns = [
    path('profiles/me/', my_profile),
    path('projects/mine/', my_projects),  # new route
    path('', include(router.urls)),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', RegisterView.as_view(), name='register'),
]
