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


class NormalizeFieldsMixin:
    """
    Mixin to normalize fields before saving.
    """

    def normalize_fields(self):
        """
        Normalize fields to a standard format.
        """
        if hasattr(self, 'last_name') and self.last_name:
            self.last_name = self.last_name.upper()
        if hasattr(self, 'first_name') and self.first_name:
            self.first_name = self.first_name.capitalize()
        if hasattr(self, 'email') and self.email:
            self.email = self.email.lower()


class User(AbstractUser, NormalizeFieldsMixin):
    """
    Custom user model that extends the default Django user model.
    """
    email = models.EmailField("email address", max_length=100, help_text="Email address of the user", unique=True,
                              db_index=True)
    username = models.CharField(
        max_length=150,
        unique=True,
        error_messages={
            'unique': "This username is already taken.",
            'blank': "Username cannot be empty.",
        },
    )
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return f'{self.first_name} {self.last_name}' if self.first_name and self.last_name else f'{self.username}'

    def save(self, *args, **kwargs):
        self.normalize_fields()
        super().save(*args, **kwargs)


class AdminProfile(models.Model, NormalizeFieldsMixin):
    """
    Model representing an admin user.
    """
    admin_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False,
                                help_text="Unique identifier for the admin")
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='admin_profile',
        null=True,
        blank=True,
    )

    # Civil status
    first_name = models.CharField("admin first name", max_length=100, help_text="Admin's first name")
    last_name = models.CharField("admin last name", max_length=100, help_text="Admin's last name")
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
    phone = PhoneNumberField("Admin phone number", region="BJ", help_text="Admin's phone number", unique=True)

    # Management
    date_created = models.DateTimeField(auto_now_add=True, help_text="Date at which the admin creates its profile")
    date_updated = models.DateTimeField(auto_now=True, help_text="Date at which the admin updates its profile")

    def __str__(self):
        return f'{self.first_name} {self.last_name}' if self.first_name and self.last_name else f'{self.admin_id}'

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
        admin_group, _ = Group.objects.get_or_create(name='Admin')
        user.groups.add(admin_group)

        self.save()

    def save(self, *args, **kwargs):
        self.normalize_fields()
        validate = kwargs.pop('validate', True)
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
    applicant_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False,
                                    help_text="Unique identifier for the applicant")
    user = models.OneToOneField(User, null=True, blank=True, on_delete=models.SET_NULL,
                                related_name='applicant_profile')
    history = HistoricalRecords()
    # Personal history
    first_name = models.CharField("applicant first name", max_length=100, help_text="ApplicantProfile's first name")
    last_name = models.CharField("applicant last name", max_length=100, help_text="ApplicantProfile's last name")
    date_of_birth = models.DateField()

    # Contact information
    gender = models.CharField(max_length=1, choices=[('M', 'Male'), ('F', 'Female')])
    email = models.EmailField("applicant email", max_length=100, help_text="ApplicantProfile's email address",
                              unique=True, db_index=True)
    phone = PhoneNumberField("Applicant phone number", region="BJ", help_text="ApplicantProfile's phone number",
                             unique=True, db_index=True)

    # Registration
    date_registered = models.DateTimeField(auto_now_add=True,
                                           help_text="Date at which the applicant creates its profile")
    date_updated = models.DateTimeField(auto_now=True, help_text="Date at which the applicant updates its profile")

    # Educational background
    class Degree(models.TextChoices):
        HIGHSCHOOL = 'HIGHSCHOOL', _('High School')
        BACHELOR = 'BACHELOR', _('Bachelor')
        MASTER = 'MASTER', _('Master')
        PHD = 'PHD', _('Phd')

    class BaccalaureateSeries(models.TextChoices):
        BAC_D = 'D', _('BAC D')
        BAC_C = 'C', _('BAC C')
        BAC_E = 'E', _('BAC E')
        BAC_F = 'F', _('BAC F')

    degree = models.CharField("The applicant highest study degree", max_length=20, choices=Degree.choices)
    baccalaureate_series = models.CharField("The type of baccalaureate", max_length=2,
                                            choices=BaccalaureateSeries.choices)
    baccalaureate_average = models.FloatField("Average at baccalaureate exam",
                                              validators=[MinValueValidator(0.0), MaxValueValidator(20.0)])

    baccalaureate_session = models.DateField("Baccalaureate session")

    university = models.ForeignKey('University', on_delete=models.SET_NULL, blank=True, null=True,
                                   related_name='graduates')
    university_field_of_study = models.CharField("Study field", max_length=99, null=True, blank=True)
    university_average = models.FloatField("Average for the university degree", blank=True, null=True,
                                           validators=[MinValueValidator(0.0), MaxValueValidator(20.0)])

    def __str__(self):
        return f'{self.first_name} {self.last_name}'

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
            raise ValueError("Username is required to create a user account to an applicant.")
        if not raw_password:
            raise ValueError("Password is required to create a user account to an applicant.")
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
        applicant_group, _ = Group.objects.get_or_create(name='Applicant')
        user.groups.add(applicant_group)

        self.user = user
        self.save()

    class Meta:
        ordering = ['-date_registered']

        constraints = [
            models.UniqueConstraint(
                fields=["last_name", "date_of_birth"],
                name='applicant_unique_lower_last_name_date_of_birth',
                violation_error_message="The applicant already exists."
            ),
        ]


class HRManagerProfile(models.Model, NormalizeFieldsMixin):
    """
    Model representing an HR manager.
    """
    manager_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False,
                                  help_text="Unique identifier for the HR manager")
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='hr_manager_profile', null=True,
                                blank=True)

    # Civil status
    first_name = models.CharField("HR manager first name", max_length=100, help_text="HR manager's first name")
    last_name = models.CharField("HR manager last name", max_length=100, help_text="HR manager's last name")
    date_of_birth = models.DateField()

    # Contact information
    email = models.EmailField("HR manager email", max_length=100, help_text="HR manager's email address", unique=True)
    phone = PhoneNumberField("HR manager phone number", region="BJ", help_text="HR manager's phone number", unique=True)

    # Management
    date_registered = models.DateTimeField(auto_now_add=True,
                                           help_text="Date at which the HR manager creates its profile")
    date_updated = models.DateTimeField(auto_now=True, help_text="Date at which the HR manager updates its profile")

    def __str__(self):
        return f'{self.first_name} {self.last_name}' if self.first_name and self.last_name else f'{self.user.username}'

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

        hr_manager_group, _ = Group.objects.get_or_create(name='HR Manager')

        permissions = Permission.objects.filter(codename__in=[
            'can_review_applications',
            'can_manage_applicants_profiles',
            "can_manage_applications"
        ])
        hr_manager_group.permissions.add(*permissions)

        user.groups.add(hr_manager_group)

        self.save()

    def save(self, *args, **kwargs):
        self.normalize_fields()
        super().save(*args, **kwargs)

    class Meta:
        ordering = ['last_name']
        verbose_name = "HR Manager"

        constraints = [
            models.UniqueConstraint(
                fields=["last_name", "date_of_birth"],
                name='manager_unique_lower_last_name_date_of_birth',
                violation_error_message="The HR manager already exists."
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
    """
    application_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False,
                                      help_text="Unique identifier for the application")
    applicant = models.OneToOneField(ApplicantProfile, on_delete=models.CASCADE, related_name='application',
                                     unique=True)

    # Application details
    date_submitted = models.DateTimeField(auto_now_add=True)
    date_updated = models.DateTimeField(auto_now=True)
    # The following field is auto computed from the lastname, the date of birth and random three digits.
    tracking_id = models.CharField("A human-readable reference to track the application", max_length=14, unique=True,
                                   null=True, blank=True)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # On instance load track initial status value
        self._initial_status = self.status

    class ApplicationStatus(models.TextChoices):
        PENDING = 'Pending', _('Pending')
        ACCEPTED = 'Accepted', _('Accepted')
        REJECTED = 'Rejected', _('Rejected')
        INCOMPLETE = 'Incomplete', _('Incomplete')

    status = models.CharField(max_length=20, choices=ApplicationStatus.choices, default=ApplicationStatus.PENDING,
                              help_text="Status of the application")

    def __str__(self):
        return f'{self.applicant.first_name} {self.applicant.last_name} - {self.status}'

    class Meta:
        ordering = ['date_submitted']
        verbose_name = "Application"
        verbose_name_plural = "Applications"

    def create_applicant_profile(self, applicant_profile_data: dict):
        """
        Create an ApplicantProfile associated with a new application.
        """
        required_fields = [
            'first_name',
            'last_name',
            'gender',
            'date_of_birth',
            'email',
            'phone',
            'degree',
            'baccalaureate_series',
            'baccalaureate_session',
            'baccalaureate_average',
        ]
        missing_fields = [f for f in required_fields if not applicant_profile_data.get(f)]

        if missing_fields:
            raise ValueError(f"Missing required field(s) for applicant profile: {', '.join(missing_fields)}")

        try:
            # Get only the model’s concrete fields
            model_fields = {f.name for f in ApplicantProfile._meta.fields}

            filtered_data = {k: v for k, v in applicant_profile_data.items() if k in model_fields}

            applicant_profile = ApplicantProfile.objects.create(**filtered_data)

        except IntegrityError as e:
            if 'unique constraint' in str(e).lower():
                if 'email' in str(e):
                    raise ValueError("This email is already registered.")
                elif 'phone' in str(e):
                    raise ValueError("This phone number is already registered.")
            raise ValueError(f"Database error while creating applicant profile: {str(e)}")
        except Exception as e:
            raise ValueError(f"Failed to create applicant profile: {str(e)}")

        return applicant_profile

    def save(self, *args, **kwargs):
        """
        On creation, create an ApplicantProfile if one hasn't been provided and
        generate a tracking ID. On update, log status changes to the history.

        # Attach _changed_by to application and _status_change_note in service code for handler to correctly
        # track status changes
        """
        if self._state.adding:  # A new application is being created.
            if not self.applicant:
                applicant_profile_data = kwargs.pop('applicant_profile_data', None)
                if not applicant_profile_data:
                    raise ValueError(
                        "The applicant details data is required to create a new application. Provide them via a dict "
                        "applicant_profile_data")
                if not isinstance(applicant_profile_data, dict):
                    raise TypeError("Applicant profile data must be a dictionary.")
                self.applicant = self.create_applicant_profile(applicant_profile_data)

            # Generate tracking ID (based on existing applicant)
            if not self.tracking_id and self.applicant:
                while True:  # To enforce the uniqueness of the tracking_id
                    new_id = f"{self.applicant.last_name[:2]}-{self.applicant.date_of_birth.strftime('%d%m%y')}-{random.randint(100, 999)}"
                    if not Application.objects.filter(tracking_id=new_id).exists():
                        self.tracking_id = new_id
                        break
        super().save(*args, **kwargs)


class ApplicationStatusHistory(models.Model):
    """
    A model to track a status changes for an application.
    """
    application = models.ForeignKey(Application, on_delete=models.CASCADE, related_name='status_history')

    old_status = models.CharField("Status before change", max_length=20, choices=Application.ApplicationStatus.choices,
                                  null=True, blank=True)
    new_status = models.CharField("Status after change", max_length=20, choices=Application.ApplicationStatus.choices)
    changed_by = models.ForeignKey(User, null=True, blank=True, help_text="User who made the change",
                                   on_delete=models.SET_NULL)
    date_changed = models.DateTimeField(auto_now_add=True)
    note = models.TextField(null=True, blank=True, help_text="Optional comment about the change")

    def __str__(self):
        return f"{self.application.tracking_id}: {self.old_status} → {self.new_status} by {self.changed_by}"

    class Meta:
        ordering = ['-date_changed']
        verbose_name_plural = "Application status histories"


class Review(models.Model):
    """
    Model representing a review of an application.
    """
    review_id = models.AutoField(primary_key=True, editable=False, help_text="Unique identifier for the review")
    application = models.ForeignKey(Application, on_delete=models.CASCADE, related_name='reviews',
                                    help_text="Application being reviewed")
    author = models.ForeignKey(HRManagerProfile, on_delete=models.CASCADE, related_name='reviews',
                               verbose_name="reviewer", help_text="HR manager who reviewed the application")

    # Review details
    date_reviewed = models.DateTimeField(auto_now_add=True)
    date_updated = models.DateTimeField(auto_now=True)

    # Review content
    comments = models.TextField(help_text="Comments from the HR manager about the application")

    def __str__(self):
        return f'Review on {self.application.applicant.first_name} application by {self.author.first_name}'


class University(models.Model):
    """
    Model representing a university.
    """
    name = models.CharField("The university name", max_length=99)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "Universities"
