import redis
from django.core.mail import EmailMultiAlternatives, send_mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.conf import settings
from datetime import datetime, timedelta
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
        "track": f"{settings.SITE_URL}applications/track",
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


LIMIT = 50  # Emails per hour
r = redis.Redis(
    host=settings.REDIS_HOST,
    port=settings.REDIS_PORT,
    db=settings.REDIS_DB,
    decode_responses=True,
)


def send_throttled_mail(subject, message, from_email, recipient_list):
    hour = datetime.now().strftime("%Y-%m-%d-%H")
    key = f"email_count:{hour}"

    # Atomic increment and check using Lua script
    lua_script = """
    local key = KEYS[1]
    local limit = tonumber(ARGV[1])
    local ttl = tonumber(ARGV[2])
    
    local current = redis.call('GET', key)
    if current == false then
        current = 0
    else
        current = tonumber(current)
    end
    
    if current >= limit then
        return -1
    end
    
    local new_count = redis.call('INCR', key)
    if new_count == 1 then
        redis.call('EXPIRE', key, ttl)
    end
    
    return new_count
    """

    result = r.eval(lua_script, 1, key, LIMIT, 3600)

    if result == -1:
        # Calculate time until next hour
        next_hour = (datetime.now() + timedelta(hours=1)).replace(
            minute=0, second=0, microsecond=0
        )
        wait_seconds = int((next_hour - datetime.now()).total_seconds())

        # Raise exception with wait time - Django Q will retry based on this
        raise Exception(f"Hourly email limit reached. Retry in {wait_seconds} seconds.")

    # Send email
    try:
        send_mail(subject, message, from_email, recipient_list, fail_silently=False)
        logger.info(f"Email sent to {recipient_list[0]}. Count: {result}/{LIMIT}")
    except Exception as e:
        # Decrement on failure
        r.decr(key)
        raise
