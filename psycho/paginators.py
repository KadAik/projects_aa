from rest_framework.exceptions import NotFound
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response


class SafePageNumberPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

    def paginate_queryset(self, queryset, request, view=None):
        try:
            return super().paginate_queryset(queryset, request, view)
        except NotFound:
            # Instead of raising 404, return empty results
            self.page = None
            return []

    def get_paginated_response(self, data):
        if self.page is None:  # overflow case
            return Response({
                "count": 0,
                "next": None,
                "previous": None,
                "page_size": 0,
                "results": []
            })
        paginated_response = super().get_paginated_response(data)
        paginated_response.data['page_size'] = self.get_page_size(self.request)
        return paginated_response
