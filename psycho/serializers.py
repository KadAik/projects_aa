from django.db import transaction
from rest_framework import serializers

from .models import (
    CompositionCentre,
    Degree,
    User,
    AdminProfile,
    ApplicantProfile,
    Application,
    University,
    ApplicationStatusHistory,
)


class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for the User model.
    """

    class Meta:
        model = User
        fields = ["username", "email", "first_name", "last_name"]


class AdminProfileSerializer(serializers.ModelSerializer):
    """
    Serializer for the AdminProfile model.
    """

    url = serializers.HyperlinkedIdentityField(
        view_name="psycho:adminprofile-detail",
        read_only=True,
    )

    user_id = serializers.PrimaryKeyRelatedField(source="user", read_only=True)

    username = serializers.CharField(
        source="user",  # Not user.username to prevent NoneType error ; then to_representation will handle it
        error_messages={
            "required": "Username is required.",
            "blank": "Username cannot be blank.",
        },
    )

    password = serializers.CharField(
        write_only=True,
        style={"input_type": "password"},
        required=False,
        allow_blank=True,
        error_messages={
            "blank": "Password cannot be blank.",
        },
    )

    class Meta:
        model = AdminProfile
        fields = [
            "url",
            "admin_id",
            "user_id",
            "username",
            "password",
            "first_name",
            "last_name",
            "email",
            "date_of_birth",
            "phone",
            "date_created",
            "date_updated",
        ]

        read_only_fields = ["admin_id", "user_id", "date_registered", "date_updated"]

    def create(self, validated_data):
        """
        Create a new user while creating an admin profile.
        """
        username = validated_data.pop("username", None)
        password = validated_data.pop("password", None)

        with transaction.atomic():
            admin_profile = AdminProfile.objects.create(**validated_data)

            try:
                admin_profile.create_superuser_account(username, password)
            except ValueError as ve:
                if "Username" in str(ve):
                    raise serializers.ValidationError({"username": str(ve)})
                if "Password" in str(ve):
                    raise serializers.ValidationError({"password": str(ve)})
                raise ve

        return admin_profile

    def update(self, instance, validated_data):
        """
        Update the user while updating an admin profile.
        """
        print("Updating AdminProfile with data:", validated_data)
        with transaction.atomic():
            user = instance.user
            user_data = validated_data.pop("user", {})

            username = user_data.get("username", None)
            email = user_data.get("email", None)

            if (
                username
                and username != user.username
                and User.objects.filter(username=username).exclude(pk=user.pk).exists()
            ):
                raise serializers.ValidationError(
                    {"username": "This username is already taken."}
                )

            if (
                email
                and email != user.email
                and User.objects.filter(email=email).exclude(pk=user.pk).exists()
            ):
                raise serializers.ValidationError(
                    {"email": "This email is already taken."}
                )

            if username:
                user.username = username
            if email:
                user.email = email

            user.save()

            for field in self.Meta.fields:
                if field in validated_data and field != "user":
                    setattr(instance, field, validated_data[field])
            instance.save()

            return instance

    def to_representation(self, instance):
        """
        Get the username from the user object if exists.
        """
        rep = super().to_representation(instance)

        username = instance.user.username if instance.user else None

        if username:
            rep["username"] = username

        return rep

    def to_internal_value(self, data):
        """
        Tranform the user key in the validated_data into a dictionnary containing the username.
        """
        rep = super().to_internal_value(data)
        if "user" in rep and isinstance(rep["user"], str):
            # If user is a string, assume it's the username
            rep["user"] = {"username": rep["user"]}
        rep["user"]["password"] = rep.pop(
            "password", None
        )  # Move password to user dict if exists
        return rep


class UniversitySerializer(serializers.ModelSerializer):
    """
    Serializer class for the University model.
    """

    class Meta:
        model = University
        fields = ["name"]

    def create(self, validated_data):
        """
        If the university already exists, return it.
        """
        university_name = validated_data.get("name", None)
        if university_name:
            university, _ = University.objects.get_or_create(**validated_data)
        else:
            raise serializers.ValidationError("A university name is required")
        return university


class DegreeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Degree
        fields = ["id", "name", "degree", "institution"]
        read_only_fields = ["id"]


class CompositionCentreSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompositionCentre
        fields = ["id", "name", "location"]
        read_only_fields = ["id"]

    def create(self, validated_data):
        """
        Return an existing CompositionCentre if it exists,
        or create a new one.
        """
        name = validated_data.pop("name", None)
        if name:
            centre, _ = CompositionCentre.objects.get_or_create(
                name=name, defaults=validated_data
            )
        else:
            raise serializers.ValidationError("A composition centre name is required")

        return centre


class ApplicationStatusHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ApplicationStatusHistory
        fields = "__all__"


class ApplicantProfileSerializer(serializers.ModelSerializer):
    """
    Serializer for the Applicant model.
    """

    url = serializers.HyperlinkedIdentityField(
        view_name="psycho:applicant-detail",
        read_only=True,
    )

    highest_degree = DegreeSerializer()

    class Meta:
        model = ApplicantProfile
        fields = [
            "url",
            "applicant_id",
            "first_name",
            "last_name",
            "gender",
            "npi",
            "date_of_birth",
            "place_of_birth",
            "wears_glasses",
            "personnel_type",
            "email",
            "phone",
            "highest_degree",
            "academic_level",
            "baccalaureate_series",
            "baccalaureate_average",
            "birth_certificate",
            "criminal_record",
            "date_registered",
            "date_updated",
        ]

        read_only_fields = [
            "applicant_id",
            "date_registered",
            "date_updated",
        ]
        write_only_fields = ["birth_certificate", "criminal_record"]

    def to_internal_value(self, data):
        """
        Customize the internal representation by handling unexpected fields.
        """

        # Phone field preprocessing
        if data.get("phone") and not data["phone"].startswith("+229"):
            data["phone"] = "+229" + data.get("phone")

        return super().to_internal_value(data)

    @staticmethod
    def create_usr_account(applicant_profile, username, password):
        """
        Create a user account for the applicant.
        """
        try:
            user = applicant_profile.create_user_account(username, password)
        except ValueError as ve:
            error_message = str(ve)
            if "Username" in error_message:
                raise serializers.ValidationError({"username": error_message})
            if "Password" in error_message:
                raise serializers.ValidationError({"password": error_message})
            raise ve

        return user

    def create(self, validated_data):
        """
        Create a new applicant profile and related objects if needed.
        """
        with transaction.atomic():
            highest_degree_data = validated_data.pop("highest_degree", None)
            if highest_degree_data:
                degree_serializer = DegreeSerializer(data=highest_degree_data)
                degree_serializer.is_valid(raise_exception=True)
                degree_instance = degree_serializer.save()

            # Create the applicant profile
            applicant_profile = ApplicantProfile.objects.create(
                highest_degree=degree_instance, **validated_data
            )

        return applicant_profile

    def update(self, instance, validated_data):
        """
        Update an existing applicant profile, and optionally update the user account if needed.
        """
        # In case a profile upgrade is asked.
        create_user_account = validated_data.pop("create_user_account", None)
        username = validated_data.pop("username", None)
        password = validated_data.pop("password", None)
        print("receive to update : ", validated_data)
        updated = super().update(instance, validated_data)

        if create_user_account:
            self.create_usr_account(instance, username, password)

        return updated


class ApplicationSerializer(serializers.ModelSerializer):
    """
    Serializer for an Application.
    """

    url = serializers.HyperlinkedIdentityField(
        view_name="psycho:application-detail",
        read_only=True,
    )
    # For reading: return full serialized object
    applicant = ApplicantProfileSerializer(read_only=True)

    # For writing: accept nested applicant data
    applicant_data = ApplicantProfileSerializer(write_only=True, source="applicant")

    # Accept composition centre by name for writing, return full object for reading
    composition_centre = serializers.SlugRelatedField(
        slug_field="name", queryset=CompositionCentre.objects.all()
    )
    status_history_ids = serializers.PrimaryKeyRelatedField(
        source="status_history", many=True, read_only=True
    )

    class Meta:
        model = Application
        fields = [
            "url",
            "application_id",
            "tracking_id",
            "applicant",
            "applicant_data",
            "composition_centre",
            "status",
            "date_submitted",
            "date_updated",
            "status_history_ids",
        ]

        read_only_fields = [
            "application_id",
            "tracking_id",
            "date_submitted",
            "date_updated",
        ]

    def create(self, validated_data):
        """
        Create a new application.
        """
        print("Creating application with data:", validated_data)
        applicant_profile_data = validated_data.pop("applicant", None)
        composition_centre_instance = validated_data.pop("composition_centre", None)
        with transaction.atomic():

            # Create the applicant profile
            applicant_serializer = ApplicantProfileSerializer(
                data=applicant_profile_data
            )
            applicant_serializer.is_valid(raise_exception=True)
            applicant_instance = applicant_serializer.save()

            # Create the application
            application = Application.objects.create_with_tracking_id(
                applicant=applicant_instance,
                composition_centre=composition_centre_instance,
                **validated_data,
            )

        return application

    def to_representation(self, instance):
        """
        Customize output to return full composition centre details.
        """
        representation = super().to_representation(instance)
        # Replace the name with full serialized object
        if instance.composition_centre:
            representation["composition_centre"] = CompositionCentreSerializer(
                instance.composition_centre
            ).data
        return representation
