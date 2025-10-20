import os
from django.utils.text import slugify


class NormalizeFieldsMixin:
    """
    Mixin to normalize some fields before saving.
    """

    def normalize_fields(self):
        """
        Normalize fields to a standard format.
        """
        if hasattr(self, "last_name") and self.last_name:
            self.last_name = self.last_name.upper().strip()
        if hasattr(self, "first_name") and self.first_name:
            self.first_name = self.first_name.strip().title()
        if hasattr(self, "email") and self.email:
            self.email = self.email.lower().strip()


class ApplicantUploadTo:
    """
    Callable class for FileField.upload_to.
    Builds deterministic file paths based on applicant names.
    """

    def __init__(self, folder_name: str):
        self.folder_name = folder_name

    def __call__(self, instance, filename):
        # Safely get first name (only first if multiple provided)
        first_name = (
            instance.first_name.split()[0]
            if getattr(instance, "first_name", None) and instance.first_name.split()
            else "unknown"
        )

        # Safely get last name
        last_name = getattr(instance, "last_name", "") or "unknown"

        # Extract file extension
        _, extension = os.path.splitext(filename)
        extension = extension.lower() or ".dat"

        # Build clean base name
        filename_base = slugify(f"{last_name}_{first_name}")

        # Build final filename
        filename = f"{filename_base}_{self.folder_name[:-1]}{extension}"

        # Final path
        return f"applicant_profiles/{self.folder_name}/{filename}"

    def deconstruct(self):
        """
        Tell Django how to serialize this object for migrations.
        """
        return ("psycho.utils.models_utils.ApplicantUploadTo", [self.folder_name], {})
