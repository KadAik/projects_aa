from django.conf import settings
from django.core.mail import send_mail
from django_q.tasks import async_task
from django.db import transaction
from django.db import models


import logging
from django.db import transaction

from psycho.utils.emails_utils import send_throttled_mail

logger = logging.getLogger(__name__)


class ApplicationQuerySet(models.QuerySet):
    """Custom QuerySet for Application model."""

    @transaction.atomic
    def update_status_with_notification(self, new_status):
        """
        Update Application statuses and send emails to accepted applicants.
        """
        if not self.exists():
            return

        # Materialize applications BEFORE updating
        # We should not consider applications with existing accepted status
        if new_status == "Accepted":
            accepted_apps = list(
                self.exclude(status="Accepted").select_related(
                    "applicant", "composition_centre"
                )
            )
        else:
            accepted_apps = []

        updated_count = self.update(status=new_status)
        logger.info(f"Updated {updated_count} applications to '{new_status}'")

        # Send notifications for newly accepted applications
        for app in accepted_apps:
            applicant = app.applicant
            subject = "Votre candidature a été acceptée ✅"
            message = (
                f"Bonjour {applicant.first_name},\n\n"
                f"Nous avons le plaisir de vous informer que votre candidature "
                f"(ID: {app.tracking_id}) a été acceptée.\n\n"
                "Présélection le SAMEDI 29 NOVEMBRE 2025. \n"
                f"Centre de composition: {app.composition_centre.name if app.composition_centre else 'Non assigné'}.\n\n"
                "Cordialement,\nL'équipe Direction des ressources humaines Armée de l'air."
            )
            try:
                async_task(
                    send_throttled_mail,
                    subject,
                    message,
                    settings.DEFAULT_FROM_EMAIL,
                    [applicant.email],
                    fail_silently=False,
                )
                logger.info(
                    f"Email queued for {applicant.email} (App: {app.tracking_id})"
                )
            except Exception as e:
                logger.error(f"Failed to queue email for {app.tracking_id}: {e}")
