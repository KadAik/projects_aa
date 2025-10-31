from django.db import models
from django.db.utils import IntegrityError
import random
from django.contrib.auth.models import Group, Permission
from django.contrib.auth import get_user_model
from django.db import transaction
from django.contrib.contenttypes.models import ContentType

from psycho.utils.shared.utils import ensure_group_permissions


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


class HRManagerProfileManager(models.Manager):

    def create_with_user(self, user, first_name, last_name, email, phone):
        """Create HR Manager profile from existing User instance."""
        User = get_user_model()
        if not isinstance(user, User):
            raise ValueError("user must be a User instance")
        applicants_custom_perms = [
            "can_manage_applicants_profiles",
        ]
        applications_custom_perms = [
            "can_manage_applications",
        ]

        from psycho.models import (
            ApplicantProfile,
            Application,
        )  # local import to avoid circular deps

        with transaction.atomic():

            for model, custom_perms in [
                (ApplicantProfile, applicants_custom_perms),
                (Application, applications_custom_perms),
            ]:
                hr_manager_group = ensure_group_permissions(
                    model, "HR Manager", custom_perms
                )

            user.groups.add(hr_manager_group)

            hr_manager = self.create(
                user=user,
                first_name=first_name,
                last_name=last_name,
                email=email,
                phone=phone,
            )
        return hr_manager

    def create_with_new_user(
        self, first_name, last_name, email, password, phone, username=None
    ):
        """
        Create both the User and HR Manager profile.
        If username is not provided, defaults to first initial + last name.
        (e.g., Alice Johnson → ajohnson)
        """
        User = get_user_model()

        # Generate default username if not provided
        if not username:
            base_username = f"{first_name[0]}{last_name}".lower()
            username = base_username
            counter = 1
            # Ensure unique username
            while User.objects.filter(username=username).exists():
                username = f"{base_username}{counter}"
                counter += 1
        else:
            # Check provided username uniqueness
            if User.objects.filter(username=username).exists():
                raise ValueError(f"Username '{username}' is already taken.")

        # Check email uniqueness
        if User.objects.filter(email=email).exists():
            raise ValueError("A user with that email already exists.")

        with transaction.atomic():
            user = User.objects.create_user(
                username=username,
                password=password,
                email=email,
            )
            user.is_staff = True
            user.save()
            hr_manager = self.create_with_user(
                user=user,
                first_name=first_name,
                last_name=last_name,
                email=email,
                phone=phone,
            )

        return hr_manager
