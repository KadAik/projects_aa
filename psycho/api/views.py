from django.shortcuts import get_object_or_404
from rest_framework import (
    generics,
    viewsets,
)
from rest_framework import status as drf_status
from rest_framework.decorators import action
from rest_framework.request import Request
from rest_framework.response import Response

from psycho.models import (
    User,
    AdminProfile,
    ApplicantProfile,
    Application,
)
from psycho.serializers import (
    UserSerializer,
    AdminProfileSerializer,
    ApplicantProfileSerializer,
    ApplicationSerializer
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
    queryset = ApplicantProfile.objects.all()
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
        if tracking_id:  # We interrupt needless database hit soon
            application = get_object_or_404(Application, tracking_id=tracking_id)
            serialized_item = self.serializer_class(instance=application, context={'request': request})
            return Response(serialized_item.data, status=drf_status.HTTP_200_OK)

        queryset = Application.objects.select_related('applicant').all()
        # Filters
        status = request.query_params.get('status')
        print("Status is : ", status)
        degree = request.query_params.get('degree')
        baccalaureate_series = request.query_params.get('baccalaureateSeries')
        if status:
            print("Filtering on status")
            queryset = queryset.filter(status=status)
        if degree:
            queryset = queryset.filter(applicant__degree=degree)
        if baccalaureate_series:
            queryset = queryset.filter(applicant__baccalaureate_series__contains=baccalaureate_series)

        # Sorting
        sort_by = request.query_params.get("sort_by")
        print("Should sort by: ", sort_by)
        if sort_by:
            sort_by_ = []
            sort_by = sort_by.split(",")
            # For nested field we should prefix by the instance name
            for field in sort_by:
                if field not in ['status', 'date_submitted', 'date_updated']:
                    sort_by_.append(f"-applicant__{field[1:]}") if field.startswith("-") else sort_by_.append(
                        f"applicant__{field}")
                else:
                    sort_by_.append(field)
            print("Should sort by: ", sort_by_)

            queryset = queryset.order_by(*sort_by_)

        serialized_items = self.serializer_class(instance=queryset, many=True, context={'request': request})
        return Response(serialized_items.data, status=drf_status.HTTP_200_OK)

    def retrieve(self, request, pk):
        """
        Retrieve a specific application by its ID.
        """
        application = get_object_or_404(Application, pk=pk)
        serializer = self.serializer_class(instance=application, context={'request': request})
        return Response(serializer.data, status=drf_status.HTTP_200_OK)

    @action(detail=True, methods=['get'])
    def retrieve_by_tracking_id(self, request, tracking_id):
        application = get_object_or_404(Application, tracking_id=tracking_id)
        serializer = self.serializer_class(instance=application, context={'request': request})
        return Response(serializer.data, status=drf_status.HTTP_200_OK)

    def create(self, request):
        """
        Create a new application.
        """
        serializer = self.serializer_class(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data, status=drf_status.HTTP_201_CREATED)
