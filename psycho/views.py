from django.http import FileResponse, Http404
from django.shortcuts import get_object_or_404
from django.contrib.auth.decorators import user_passes_test

from psycho.models import ApplicantProfile


def is_hr_member(user):
    """Check if user belongs to HR group."""
    return user.is_authenticated and user.groups.filter(name="HR Manager").exists()


@user_passes_test(is_hr_member)
def preview_file(request, applicant_id, field_name):
    """Serve file for inline preview in browser."""
    applicant = get_object_or_404(ApplicantProfile, id=applicant_id)
    file_field = getattr(applicant, field_name, None)

    if not file_field:
        raise Http404("File not found")

    response = FileResponse(file_field.open("rb"))
    response["Content-Disposition"] = f'inline; filename="{file_field.name}"'

    # Set appropriate content type
    if file_field.name.lower().endswith(".pdf"):
        response["Content-Type"] = "application/pdf"
    elif file_field.name.lower().endswith((".jpg", ".jpeg")):
        response["Content-Type"] = "image/jpeg"
    elif file_field.name.lower().endswith(".png"):
        response["Content-Type"] = "image/png"

    return response
