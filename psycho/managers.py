from django.db import models
from django.db.utils import IntegrityError
import random


class ApplicationManager(models.Manager):

    def create_with_tracking_id(self, applicant, **kwargs):
        """Create application with auto-generated tracking ID."""
        application = self.model(applicant=applicant, **kwargs)

        max_attempts = 10
        for _ in range(max_attempts):
            tracking_id = f"{applicant.last_name[:2].upper()}-{applicant.date_of_birth.strftime('%d%m%y')}-{random.randint(100, 999)}"
            application.tracking_id = tracking_id
            try:
                application.save()
                return application
            except IntegrityError:
                continue
        raise ValueError("Could not generate unique tracking ID")
