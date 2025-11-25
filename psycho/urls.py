from django.urls import path
from psycho import views
from psycho.api import views as api_views
from rest_framework.routers import DefaultRouter
from django.conf import settings

UPDATE_SERVICE_TOKEN = settings.WEBHOOK_UPDATE_SERVICE_ACCESS_TOKEN

app_name = "psycho"

urlpatterns = [
    path(
        "preview/<uuid:applicant_id>/<str:field_name>/",
        views.preview_file,
        name="preview_file",
    ),
]

# Log client errors + update_services.sh launch
urlpatterns += [
    path("api/logs/client-errors", views.log_client_error, name="log_client_error"),
    path(
        f"update-services/{UPDATE_SERVICE_TOKEN}/",
        views.launch_services_update,
        name="update-services",
    ),
]

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
