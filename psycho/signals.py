from django.db.models.signals import post_save
from django.dispatch import receiver

from psycho.models import Application, ApplicationStatusHistory


# Receivers

@receiver(post_save, sender=Application)
def handle_application_post_save(sender, instance, created, **kwargs):
    """
    This signal handler reacts to Application model post_save signal.
    Beware, QuerySet.update() and bulk_update() bypass save() and signals firing.
    """
    # Log status change
    if created:
        ApplicationStatusHistory.objects.create(
            application=instance,
            changed_by=getattr(instance, "_changed_by", None),
            new_status=instance.status,
            note="Status on application submission."
        )
    else:  # Update case
        if instance._initial_status != instance.status:
            ApplicationStatusHistory.objects.create(
                application=instance,
                changed_by=getattr(instance, "_changed_by", None),
                old_status=instance._initial_status,
                new_status=instance.status,
                note=getattr(instance, "_status_change_note", None)
            )
