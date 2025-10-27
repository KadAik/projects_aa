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

    # Inline all CSS with premailer
    html_content = transform(
        html_content,
        base_url=settings.SITE_URL,  # Base URL for relative links
        remove_classes=False,  # Keep classes for email clients that support them
        strip_important=False,
        keep_style_tags=False,  # Remove style tags after inlining
        exclude_pseudoclasses=True,  # Remove :hover and other pseudo-classes
    )

    text_content = strip_tags(html_content)

    email = EmailMultiAlternatives(
        subject="Confirmation de réception de votre candidature aux Tests psychotechniques air 2025.",
        body=text_content,
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=[applicant.email],
        reply_to=["support@psycho-tests.emaa.mil.bj"],
    )

    # Attach HTML version
    email.attach_alternative(html_content, "text/html")

    email.encoding = "utf-8"

    try:
        email.send()
        logger.info("Confirmation email sent successfully to %s", applicant.email)
        return True
    except Exception as e:
        logger.exception("Email sending failed for %s: %s", applicant.email, e)
        return False
