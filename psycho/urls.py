from django.urls import path
from psycho import views
from psycho.api import views as api_views
from rest_framework.routers import DefaultRouter

app_name = "psycho"

urlpatterns = []

# User URLs
urlpatterns += [
    path(
        "api/users/<int:pk>/",
        api_views.UserRetrieveUpdateDestroyView.as_view(),
        name="user-detail",
    ),
]

# AdminProfile URLs
urlpatterns += [
    path(
        "api/adminprofiles/",
        api_views.AdminProfileListCreateView.as_view(),
        name="adminprofile-list",
    ),
    path(
        "api/adminprofiles/<uuid:pk>/",
        api_views.AdminProfileRetrieveUpdateDestroyView.as_view(),
        name="adminprofile-detail",
    ),
]

# ApplicantProfile URLs
urlpatterns += [
    path(
        "api/applicants/",
        api_views.ApplicantProfileListCreateView.as_view(),
        name="applicant-list",
    ),
    path(
        "api/applicant/<uuid:pk>/",
        api_views.ApplicantProfileRetrieveUpdateDestroyView.as_view(),
        name="applicant-detail",
    ),
]

# Application URLs
router = DefaultRouter()
router.register(
    r"api/applications", api_views.ApplicationViewSet, basename="application"
)
urlpatterns += [
    path(
        "api/applications/<uuid:pk>/status_history",
        api_views.application_status_history,
        name="application-status-history",
    )
]

# Degree URLs
router.register(r"api/degrees", api_views.DegreeViewSet, basename="degree")

# CompositionCentre URLs
router.register(
    r"api/composition-centres",
    api_views.CompositionCentreViewSet,
    basename="compositioncentre",
)


urlpatterns += router.urls
