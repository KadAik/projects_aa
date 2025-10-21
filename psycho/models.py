import random
import uuid

from django.contrib.auth.models import AbstractUser
from django.contrib.auth.models import Group, Permission
from django.core.exceptions import ValidationError
from django.core.validators import MinValueValidator, MaxValueValidator
from django.db import models, IntegrityError
from django.utils.translation import gettext_lazy as _
from phonenumber_field.modelfields import PhoneNumberField
from simple_history.models import HistoricalRecords
from django.core.validators import (
    MinLengthValidator,
    RegexValidator,
    MaxLengthValidator,
)

from django.utils.text import slugify

from psycho.managers import ApplicationManager
from psycho.utils.models_utils import ApplicantUploadTo
from psycho.utils.models_utils import NormalizeFieldsMixin


def validate_uploaded_file_size(value, limit_mb=2.5):
    """
    Validate the size of an uploaded file.
    """
    limit = limit_mb * 1024 * 1024  # Convert MB to bytes
    if value.size > limit:
        raise ValidationError(f"File too large. Size should not exceed {limit_mb} MB.")


class User(AbstractUser, NormalizeFieldsMixin):
    """
    Custom user model that extends the default Django user model.
    """

    email = models.EmailField(
        "email address",
        max_length=100,
        help_text="Email address of the user",
        unique=True,
        db_index=True,
    )
    username = models.CharField(
        max_length=150,
        unique=True,
        error_messages={
            "unique": "This username is already taken.",
            "blank": "Username cannot be empty.",
        },
    )
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    def __str__(self):
        return (
            f"{self.first_name} {self.last_name}"
            if self.first_name and self.last_name
            else f"{self.username}"
        )

    def save(self, *args, **kwargs):
        self.normalize_fields()
        super().save(*args, **kwargs)


class AdminProfile(models.Model, NormalizeFieldsMixin):
    """
    Model representing an admin user.
    """

    admin_id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
        help_text="Unique identifier for the admin",
    )
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="admin_profile",
        null=True,
        blank=True,
    )

    # Civil status
    first_name = models.CharField(
        "admin first name", max_length=100, help_text="Admin's first name"
    )
    last_name = models.CharField(
        "admin last name", max_length=100, help_text="Admin's last name"
    )
    date_of_birth = models.DateField(null=True, blank=True)

    # Contact information
    email = models.EmailField(
        "admin email",
        max_length=100,
        help_text="Admin's email address",
        unique=True,
        error_messages={
            "unique": "This email address is already taken.",
            "blank": "An email address is required.",
        },
    )
    phone = PhoneNumberField(
        "Admin phone number", region="BJ", help_text="Admin's phone number", unique=True
    )

    # Management
    date_created = models.DateTimeField(
        auto_now_add=True, help_text="Date at which the admin creates its profile"
    )
    date_updated = models.DateTimeField(
        auto_now=True, help_text="Date at which the admin updates its profile"
    )

    def __str__(self):
        return (
            f"{self.first_name} {self.last_name}"
            if self.first_name and self.last_name
            else f"{self.admin_id}"
        )

    def create_superuser_account(self, username, raw_password):
        """
        Create and link a superuser (admin) account to this Admin model.
        """
        if self.user:
            raise ValueError("This admin is already linked to a user.")
        if not username:
            raise ValueError("Username is required.")
        if not raw_password:
            raise ValueError("Password is required.")
        if User.objects.filter(username=username).exists():
            raise ValueError("Username is already taken.")
        if User.objects.filter(email=self.email).exists():
            raise ValueError("Email is already taken.")

        user = User.objects.create_superuser(
            username=username,
            email=self.email,
            password=raw_password,
            first_name=self.first_name,
            last_name=self.last_name,
        )
        self.user = user
        # Add the user to "Admin" group
        admin_group, _ = Group.objects.get_or_create(name="Admin")
        user.groups.add(admin_group)

        self.save()

    def save(self, *args, **kwargs):
        self.normalize_fields()
        validate = kwargs.pop("validate", True)
        if validate:
            self.full_clean()
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        """
        Delete the linked user is the model is deleted.
        """
        if self.user:
            self.user.delete()
        super().delete(*args, **kwargs)

    class Meta:
        pass


class ApplicantProfile(models.Model, NormalizeFieldsMixin):
    """
    Model representing an applicant.
    """

    applicant_id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
        help_text="Unique identifier for the applicant",
    )

    user = models.OneToOneField(
        User,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="applicant_profile",
    )

    history = HistoricalRecords()

    # -------------------------------------
    #           Personal history
    # -------------------------------------
    npi_validators = [
        RegexValidator(r"^\d+$", "NPI must contain only digits."),
        MinLengthValidator(10, "NPI must be exactly 10 digits."),
        MaxLengthValidator(10, "NPI must be exactly 10 digits."),
    ]

    npi = models.CharField(
        "Personal identification number (NPI)",
        max_length=10,
        unique=True,
        db_index=True,
        validators=npi_validators,
        help_text="Personal identification number (NPI).",
    )

    first_name = models.CharField(
        "Applicant first name",
        max_length=100,
        help_text="Applicant's first name",
        error_messages={"blank": "First name cannot be empty."},
    )

    last_name = models.CharField(
        "Applicant last name",
        max_length=100,
        help_text="Applicant's last name",
        error_messages={"blank": "Last name cannot be empty."},
    )

    date_of_birth = models.DateField(
        help_text="Applicant's date of birth",
        error_messages={"blank": "Date of birth is required."},
    )

    place_of_birth = models.CharField(
        max_length=100,
        help_text="Applicant's place of birth",
        error_messages={"blank": "Place of birth is required."},
    )

    gender = models.CharField(
        max_length=1,
        choices=[("M", "Male"), ("F", "Female")],
        help_text="Applicant gender",
    )

    wears_glasses = models.BooleanField(
        "Wears glasses",
        help_text="Does the applicant use spectacles?",
        error_messages={"invalid": "Please specify if the applicant wears glasses."},
    )

    class PersonnelTypeChoices(models.TextChoices):
        CIVILIAN = "Civilian", _("Civilian")
        MILITARY = "Military", _("Military")

    personnel_type = models.CharField(
        max_length=8,
        choices=PersonnelTypeChoices.choices,
        help_text="Civilian or Military",
    )

    # -------------------------------------
    #               Contact
    # -------------------------------------
    email = models.EmailField(
        "Applicant email",
        max_length=100,
        help_text="Applicant email address",
        unique=True,
        db_index=True,
    )

    phone = PhoneNumberField(
        "Applicant phone number",
        region="BJ",
        help_text="Applicant phone number",
        unique=True,
        db_index=True,
        error_messages={"invalid": "A valid phone number is required."},
    )

    # -------------------------------------
    #           Registration
    # -------------------------------------
    date_registered = models.DateTimeField(
        auto_now_add=True,
        help_text="Date at which the applicant creates their profile",
    )

    date_updated = models.DateTimeField(
        auto_now=True,
        help_text="Date at which the applicant updates their profile",
    )

    # -------------------------------------
    #       Educational background
    # -------------------------------------
    class BaccalaureateSeriesChoices(models.TextChoices):
        BAC_D = "D", _("BAC D")
        BAC_C = "C", _("BAC C")
        BAC_E = "E", _("BAC E")
        BAC_F = "F", _("BAC F")

    class AcademicLevelChoices(models.TextChoices):
        BAC_0 = "BAC", _("BAC")
        BAC_1 = "BAC+1", _("BAC+1")
        BAC_2 = "BAC+2", _("BAC+2")
        BAC_3 = "BAC+3", _("BAC+3")
        BAC_4 = "BAC+4", _("BAC+4")
        BAC_5 = "BAC+5", _("BAC+5")

    highest_degree = models.ForeignKey(
        "Degree",
        on_delete=models.PROTECT,
        related_name="applicants",
        help_text="Highest degree obtained by the applicant",
    )

    academic_level = models.CharField(
        "Applicant academic level",
        max_length=6,
        choices=AcademicLevelChoices.choices,
        help_text="Current academic level of the applicant",
    )

    baccalaureate_series = models.CharField(
        "Baccalaureate series",
        max_length=1,
        choices=BaccalaureateSeriesChoices.choices,
        help_text="Series of the baccalaureate obtained",
    )

    baccalaureate_average = models.FloatField(
        "Average at baccalaureate exam",
        validators=[MinValueValidator(0.0), MaxValueValidator(20.0)],
        help_text="Average grade obtained at the baccalaureate exam",
    )

    # -------------------------------------
    #                Files
    # -------------------------------------
    birth_certificate = models.FileField(
        "Birth certificate",
        upload_to=ApplicantUploadTo("birth_certificates"),
        validators=[validate_uploaded_file_size],
        help_text="Scanned copy of the applicant's birth certificate",
    )

    criminal_record = models.FileField(
        "Criminal record",
        upload_to=ApplicantUploadTo("criminal_records"),
        validators=[validate_uploaded_file_size],
        help_text="Recent criminal record extract for the applicant",
    )

    # -------------------------------------
    #                Meta
    # -------------------------------------
    class Meta:
        ordering = ["last_name", "first_name"]
        verbose_name = "Applicant profile"
        verbose_name_plural = "Applicant profiles"

    def __str__(self):
        return f"{self.first_name} {self.last_name}"

    def save(self, *args, **kwargs):
        self.normalize_fields()
        super().save(*args, **kwargs)

    def create_user_account(self, username, raw_password):
        """
        Promote the applicant to a user by creating a User instance and linking it to the applicant.
        """
        if self.user:
            raise ValueError("ApplicantProfile is already linked to a user.")
        if not username:
            raise ValueError(
                "Username is required to create a user account to an applicant."
            )
        if not raw_password:
            raise ValueError(
                "Password is required to create a user account to an applicant."
            )
        if User.objects.filter(username=username).exists():
            raise ValidationError("Username is already taken.")
        if User.objects.filter(email=self.email).exists():
            raise ValidationError("Email is already taken.")

        user = User.objects.create_user(
            username=username,
            password=raw_password,
            email=self.email,
            first_name=self.first_name,
            last_name=self.last_name,
        )
        # Add the user to "Applicant" group
        applicant_group, _ = Group.objects.get_or_create(name="Applicant")
        user.groups.add(applicant_group)

        self.user = user
        self.save()


class HRManagerProfile(models.Model, NormalizeFieldsMixin):
    """
    Model representing an HR manager.
    """

    manager_id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
        help_text="Unique identifier for the HR manager",
    )
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="hr_manager_profile",
        null=True,
        blank=True,
    )

    # Civil status
    first_name = models.CharField(
        "HR manager first name", max_length=100, help_text="HR manager's first name"
    )
    last_name = models.CharField(
        "HR manager last name", max_length=100, help_text="HR manager's last name"
    )
    date_of_birth = models.DateField()

    # Contact information
    email = models.EmailField(
        "HR manager email",
        max_length=100,
        help_text="HR manager's email address",
        unique=True,
    )
    phone = PhoneNumberField(
        "HR manager phone number",
        region="BJ",
        help_text="HR manager's phone number",
        unique=True,
    )

    # Management
    date_registered = models.DateTimeField(
        auto_now_add=True, help_text="Date at which the HR manager creates its profile"
    )
    date_updated = models.DateTimeField(
        auto_now=True, help_text="Date at which the HR manager updates its profile"
    )

    def __str__(self):
        return (
            f"{self.first_name} {self.last_name}"
            if self.first_name and self.last_name
            else f"{self.user.username}"
        )

    def create_user_account(self, raw_password, username):
        """
        Create a user account linked to the HR manager.
        """
        if self.user:
            raise ValueError("This HR manager is already linked to a user.")
        if not raw_password:
            raise ValueError("A password is required.")
        if not username:
            raise ValueError("A username is required.")
        if User.objects.filter(username=username).exists():
            raise ValueError("Username is already taken.")
        if User.objects.filter(email=self.email).exists():
            raise ValueError("Email is already taken.")

        user = User.objects.create_user(
            username=username,
            password=raw_password,
            email=self.email,
            first_name=self.first_name,
            last_name=self.last_name,
        )
        self.user = user

        hr_manager_group, _ = Group.objects.get_or_create(name="HR Manager")

        permissions = Permission.objects.filter(
            codename__in=[
                "can_review_applications",
                "can_manage_applicants_profiles",
                "can_manage_applications",
            ]
        )
        hr_manager_group.permissions.add(*permissions)

        user.groups.add(hr_manager_group)

        self.save()

    def save(self, *args, **kwargs):
        self.normalize_fields()
        super().save(*args, **kwargs)

    class Meta:
        ordering = ["last_name"]
        verbose_name = "HR Manager"

        constraints = [
            models.UniqueConstraint(
                fields=["last_name", "date_of_birth"],
                name="manager_unique_lower_last_name_date_of_birth",
                violation_error_message="The HR manager already exists.",
            ),
        ]

        permissions = [
            ("can_review_applications", "Can review applications"),
            ("can_manage_applicants_profiles", "Can manage applicants profiles"),
            ("can_manage_applications", "Can manage applications"),
        ]


class Application(models.Model):
    """
    Model representing an application.

    Use Application.objects.create_with_tracking_id() to create new applications
    with auto-generated tracking IDs.
    """

    objects = ApplicationManager()

    application_id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
        help_text="Unique identifier for the application",
    )
    applicant = models.OneToOneField(
        ApplicantProfile,
        on_delete=models.CASCADE,
        related_name="application",
    )

    # -------------------------------------
    #           Application details
    # -------------------------------------

    # The following field is auto computed by the custom manager from the lastname, the date of birth and random three digits.
    tracking_id = models.CharField(
        "A human-readable reference to track the application",
        max_length=20,
        db_index=True,
        unique=True,
        null=True,
        blank=True,
    )
    date_submitted = models.DateTimeField(auto_now_add=True)
    date_updated = models.DateTimeField(auto_now=True)
    composition_centre = models.ForeignKey(
        "CompositionCentre",
        on_delete=models.PROTECT,
        related_name="applications",
        help_text="Centre where the applicant will take the exam",
    )

    class ApplicationStatus(models.TextChoices):
        PENDING = "Pending", _("Pending")
        ACCEPTED = "Accepted", _("Accepted")
        REJECTED = "Rejected", _("Rejected")
        INCOMPLETE = "Incomplete", _("Incomplete")

    status = models.CharField(
        max_length=20,
        choices=ApplicationStatus.choices,
        default=ApplicationStatus.PENDING,
        help_text="Status of the application",
    )

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # On instance load track initial status value
        self._initial_status = self.status

    def __str__(self):
        return f"{self.applicant.first_name} {self.applicant.last_name} - {self.status}"

    # -------------------------------------
    #           Meta
    # -------------------------------------
    class Meta:
        ordering = ["-date_submitted"]
        verbose_name = "Application"
        verbose_name_plural = "Applications"


class ApplicationStatusHistory(models.Model):
    """
    A model to track a status changes for an application.
    """

    application = models.ForeignKey(
        Application, on_delete=models.CASCADE, related_name="status_history"
    )

    old_status = models.CharField(
        "Status before change",
        max_length=20,
        choices=Application.ApplicationStatus.choices,
        null=True,
        blank=True,
    )
    new_status = models.CharField(
        "Status after change",
        max_length=20,
        choices=Application.ApplicationStatus.choices,
    )
    changed_by = models.ForeignKey(
        User,
        null=True,
        blank=True,
        help_text="User who made the change",
        on_delete=models.SET_NULL,
    )
    date_changed = models.DateTimeField(auto_now_add=True)
    note = models.TextField(
        null=True, blank=True, help_text="Optional comment about the change"
    )

    def __str__(self):
        return f"{self.application.tracking_id}: {self.old_status} → {self.new_status} by {self.changed_by}"

    class Meta:
        ordering = ["-date_changed"]
        verbose_name_plural = "Application status histories"


class Review(models.Model):
    """
    Model representing a review of an application.
    """

    review_id = models.AutoField(
        primary_key=True, editable=False, help_text="Unique identifier for the review"
    )
    application = models.ForeignKey(
        Application,
        on_delete=models.CASCADE,
        related_name="reviews",
        help_text="Application being reviewed",
    )
    author = models.ForeignKey(
        HRManagerProfile,
        on_delete=models.CASCADE,
        related_name="reviews",
        verbose_name="reviewer",
        help_text="HR manager who reviewed the application",
    )

    # Review details
    date_reviewed = models.DateTimeField(auto_now_add=True)
    date_updated = models.DateTimeField(auto_now=True)

    # Review content
    comments = models.TextField(
        help_text="Comments from the HR manager about the application"
    )

    def __str__(self):
        return f"Review on {self.application.applicant.first_name} application by {self.author.first_name}"


class University(models.Model):
    """
    Model representing a university.
    """

    name = models.CharField("The university name", max_length=99)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "Universities"


class Degree(models.Model):
    """
    Model representing a degree.
    """

    class DegreeChoices(models.TextChoices):
        HIGHSCHOOL = "Highschool", _("High School")
        BACHELOR = "Bachelor", _("Bachelor")
        MASTER = "Master", _("Master")
        PHD = "Phd", _("Phd")
        OTHER = "Other", _("Other")

    name = models.CharField(
        "The degree name",
        max_length=99,
        help_text="Intitulé du diplôme, e.g., Bachelor of Science in Computer Science",
    )
    degree = models.CharField(
        "The degree type", max_length=10, choices=DegreeChoices.choices
    )
    institution = models.CharField(
        "The institution that awarded the degree", max_length=99
    )

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "Degrees"


class CompositionCentre(models.Model):
    """
    Model representing a composition centre.
    """

    name = models.CharField(
        "Composition centre",
        max_length=99,
        help_text="Centre de composition",
        unique=True,
        db_index=True,
        error_messages={
            "unique": "A composition centre with this name already exists."
        },
    )
    location = models.CharField("The centre location", max_length=199)

    def save(self, *args, **kwargs):
        # Normalize some fields before saving
        if self.name:
            self.name = self.name.strip().title()
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "Composition Centres"
