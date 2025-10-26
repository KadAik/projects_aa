import email
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.conf import settings
import logging
from premailer import transform

from psycho.models import Application

logger = logging.getLogger(__name__)


def send_application_confirmation_email(application_id):
    """Send confirmation email to applicant upon application submission."""
    application = Application.objects.get(application_id=application_id)
    applicant = application.applicant
    context = {
        "first_name": applicant.first_name,
        "tracking_id": application.tracking_id,
        "track": f"{settings.SITE_URL}/applications/track/",
    }

    html_content = render_to_string("psycho/emails/application_submitted.html", context)
    # Inline all CSS so styles are preserved across all mail clients
    html_content = transform(html_content, remove_classes=True, strip_important=False)
    text_content = strip_tags(html_content)

    email = EmailMultiAlternatives(
        subject="Confirmation de réception de votre candidature aux Tests psychotechniques air 2025.",
        body=text_content,
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=[applicant.email],
        reply_to=["support@psycho-tests.emaa.mil.bj"],
    )
    email.attach_alternative(html_content, "text/html")
    email.content_subtype = "html"
    email.mixed_subtype = "related"  # ensures proper multipart formatting
    email.encoding = "utf-8"

    try:
        email.send()
        return True
    except Exception as e:
        logger.exception("Email sending failed for %s: %s", applicant.email, e)
        return False
