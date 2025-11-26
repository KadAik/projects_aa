from pathlib import Path
from django.http import JsonResponse
from django.utils import timezone
import os
from django.http import FileResponse, Http404
from django.shortcuts import get_object_or_404
from django.contrib.auth.decorators import user_passes_test
from django.conf import settings

from psycho.models import ApplicantProfile

from django.views.decorators.csrf import csrf_exempt

import logging
import json
import subprocess
import shlex


logger_client_errors = logging.getLogger("client_errors")
logger_services_update = logging.getLogger("services_update")


SERVICES_MAPPING = {
    "psycho-back-tests": ["back-1", "back-2"],
    "psycho-front-tests": ["front"],
}


def is_hr_member(user):
    """Check if user belongs to HR group or is superuser."""
    return user.is_authenticated and (
        user.is_superuser or user.groups.filter(name="HR Manager").exists()
    )


@user_passes_test(is_hr_member)
def preview_file(request, applicant_id, field_name):
    """Serve file for inline preview in browser."""
    applicant = get_object_or_404(ApplicantProfile, applicant_id=applicant_id)
    file_field = getattr(applicant, field_name, None)

    if not file_field:
        raise Http404("File not found")

    response = FileResponse(file_field.open("rb"))

    filename = os.path.basename(file_field.name)
    response["Content-Disposition"] = f'inline; filename="{filename}"'

    # Set appropriate content type
    if file_field.name.lower().endswith(".pdf"):
        response["Content-Type"] = "application/pdf"
    elif file_field.name.lower().endswith((".jpg", ".jpeg")):
        response["Content-Type"] = "image/jpeg"
    elif file_field.name.lower().endswith(".png"):
        response["Content-Type"] = "image/png"

    return response


@csrf_exempt
def log_client_error(request):
    """Receive and log client-side errors from React app (the front-end)"""
    if request.method == "POST":
        try:
            error_data = json.loads(request.body)

            logger_client_errors.error(
                f"Client-side error: {json.dumps(error_data, ensure_ascii=False)} "
                f"type={error_data.get('type', 'unknown')}, url={error_data.get('url', 'unknown')}"
            )

            return JsonResponse({"status": "logged"})
        except Exception as e:
            logger_client_errors.error(f"Failed to log client error: {e}")
            return JsonResponse({"status": "error"}, status=500)

    return JsonResponse({"status": "method not allowed"}, status=405)


@csrf_exempt
def launch_services_update(request):
    """
    Webhook view to trigger update_services.sh with optional service arguments.
    """
    if request.method != "POST":
        return JsonResponse({"error": "method not allowed"}, status=405)

    # Security
    # print(request.headers.get("X-Webhook-Secret"))
    # if request.headers.get("X-Webhook-Secret") != settings.WEBHOOK_SECRET:
    #    return JsonResponse({"error": "unauthorized"}, status=403)

    # Script path
    script_path = Path("/scripts/update_services.sh")

    if not script_path.exists():
        logger_services_update.error("Webhook: update_services.sh NOT FOUND")
        return JsonResponse({"error": "script not found"}, status=500)

    # Extract services
    try:
        # Option 1. From Docker Hub webhook payload
        payload = json.loads(request.body or "{}")
        service_name = payload.get("repository", {}).get("name", "")
        services = SERVICES_MAPPING.get(service_name, [])
    except Exception:
        # Option 2. Fallback to 'services' POST parameter
        raw_services = request.POST.get("services", "").strip()
        # Convert string → list of services
        # Example:
        # "web api db" → ["web", "api", "db"]
        services = raw_services.split() if raw_services else []

    # Build command
    # Safe quoting using shlex.join
    cmd = [str(script_path), "--exclude=*backup"] + services
    cmd_string = shlex.join(cmd)

    try:
        logger_services_update.info(f"Webhook: Executing command → {cmd_string}")
        subprocess.run(cmd, check=True)
        logger_services_update.info(
            f"Webhook: Successfully restarted services {services}"
        )
        return JsonResponse({"status": "ok", "services": services})
    except subprocess.CalledProcessError as e:
        logger_services_update.error(f"Webhook: Script failed → {e}")
        return JsonResponse({"error": "script error"}, status=500)
