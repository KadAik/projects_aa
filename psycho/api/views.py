from django.db import transaction
from django.db.models import Prefetch
from django.shortcuts import get_object_or_404
from rest_framework import (
    generics,
    viewsets,
)
from rest_framework import status as drf_status
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.decorators import api_view

from psycho.models import (
    CompositionCentre,
    User,
    AdminProfile,
    ApplicantProfile,
    Application,
    ApplicationStatusHistory,
    Degree,
)
from psycho.paginators import SafePageNumberPagination
from psycho.serializers import (
    CompositionCentreSerializer,
    DegreeSerializer,
    UserSerializer,
    AdminProfileSerializer,
    ApplicantProfileSerializer,
    ApplicationSerializer,
    ApplicationStatusHistorySerializer,
)


class UserRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    """
    View to retrieve, update or delete a user.
    """

    queryset = User.objects.all()
    serializer_class = UserSerializer


class AdminProfileListCreateView(generics.ListCreateAPIView):
    """
    View to list all admin profiles.
    """

    queryset = AdminProfile.objects.all()
    serializer_class = AdminProfileSerializer


class AdminProfileRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    """
    View to retrieve, update or delete an admin profile.
    """

    queryset = AdminProfile.objects.all()
    serializer_class = AdminProfileSerializer


class ApplicantProfileListCreateView(generics.ListCreateAPIView):
    """
    View to list all applicants.
    """

    queryset = ApplicantProfile.objects.select_related("highest_degree").all()
    serializer_class = ApplicantProfileSerializer


class ApplicantProfileRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    """
    View to retrieve, update or delete an applicant.
    """

    queryset = ApplicantProfile.objects.all()
    serializer_class = ApplicantProfileSerializer


class ApplicationViewSet(viewsets.ViewSet):
    """
    ViewSet for managing Application objects. This viewset provides actions
    such as listing all applications, retrieving a specific application,
    creating new applications, updating existing ones, and deleting applications.
    """

    serializer_class = ApplicationSerializer  # This is necessary for form rendering

    def list(self, request: Request):
        """
        List all applications.
        """
        tracking_id = request.query_params.get("tracking_id")
        if tracking_id is not None and tracking_id.strip() != "":
            application = get_object_or_404(Application, tracking_id=tracking_id)
            serialized_item = self.serializer_class(
                instance=application, context={"request": request}
            )
            return Response(serialized_item.data, status=drf_status.HTTP_200_OK)

        queryset = Application.objects.select_related(
            "applicant", "composition_centre"
        ).prefetch_related(
            Prefetch(
                "status_history",
                queryset=ApplicationStatusHistory.objects.select_related(
                    "changed_by"
                ).order_by("-date_changed"),
            ),
        )
        # Filters
        status = request.query_params.get("status")
        degree = request.query_params.get("degree")
        baccalaureate_series = request.query_params.get("baccalaureate_series")

        if status:
            queryset = queryset.filter(status=status)
        if degree:
            queryset = queryset.filter(applicant__degree=degree)
        if baccalaureate_series:
            queryset = queryset.filter(
                applicant__baccalaureate_series__exact=baccalaureate_series
            )

        # Sorting
        sort_by = request.query_params.get("sort_by")
        if sort_by:
            if isinstance(sort_by, str):
                sort_by = sort_by.split(",")  # single sort
            sort_by_ = []
            for field in sort_by:
                descending = field.startswith("-")
                clean_field = field.lstrip("-")  # remove "-" before checks

                if clean_field in ["status", "date_submitted", "date_updated"]:
                    sort_by_.append(f"-{clean_field}" if descending else clean_field)
                else:
                    sort_by_.append(
                        f"-applicant__{clean_field}"
                        if descending
                        else f"applicant__{clean_field}"
                    )
            queryset = queryset.order_by(*sort_by_)

            queryset = queryset.order_by(*sort_by_)

        # Pagination
        paginator = SafePageNumberPagination()
        paginated_queryset = paginator.paginate_queryset(queryset, request=request)
        serialized_items = self.serializer_class(
            instance=paginated_queryset, many=True, context={"request": request}
        )
        # return Response(serialized_items.data, status=drf_status.HTTP_200_OK)
        return paginator.get_paginated_response(serialized_items.data)

    def retrieve(self, request, pk):
        """
        Retrieve a specific application by its ID.
        """
        application = get_object_or_404(Application, pk=pk)
        serializer = self.serializer_class(
            instance=application, context={"request": request}
        )
        return Response(serializer.data, status=drf_status.HTTP_200_OK)

    def create(self, request):
        """
        Create a new application.
        """
        serializer = self.serializer_class(
            data=request.data, context={"request": request}
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data, status=drf_status.HTTP_201_CREATED)

    def partial_update(self, request, pk):
        """
        Partially update an existing application.
        """
        instance = get_object_or_404(Application, application_id=pk)
        data = request.data.copy()

        # We check if the nested field applicant is to be updated
        applicant_data = data.pop("applicant", None)

        with transaction.atomic():
            if applicant_data:
                applicant_instance = instance.applicant
                applicant_serializer = ApplicantProfileSerializer(
                    applicant_instance,
                    data=applicant_data,
                    partial=True,
                    context={"request": request},
                )

                applicant_serializer.is_valid(raise_exception=True)

                applicant_serializer.save()

            serializer = self.serializer_class(
                instance, data=data, partial=True, context={"request": request}
            )
            serializer.is_valid(raise_exception=True)

            serializer.save()

        return Response(serializer.data, status=drf_status.HTTP_200_OK)


@api_view(["get"])
def application_status_history(request, pk):
    """
    List all application status history for a specific application.
    """
    status_history = ApplicationStatusHistory.objects.filter(application_id=pk)
    status_history_serializer = ApplicationStatusHistorySerializer(
        status_history, many=True
    )
    return Response(status_history_serializer.data, status=drf_status.HTTP_200_OK)


class DegreeViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing Degree objects.
    """

    queryset = Degree.objects.all()
    serializer_class = DegreeSerializer

    pagination_class = SafePageNumberPagination


class CompositionCentreViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing CompositionCentre objects.
    """

    queryset = CompositionCentre.objects.all()
    serializer_class = CompositionCentreSerializer

    pagination_class = SafePageNumberPagination
