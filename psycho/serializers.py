from django.db import transaction
from rest_framework import serializers

from .models import (
    User,
    AdminProfile,
    ApplicantProfile,
    Application, University,
)


class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for the User model.
    """

    class Meta:
        model = User
        fields = ['username', 'email', 'first_name', 'last_name']


class AdminProfileSerializer(serializers.ModelSerializer):
    """
    Serializer for the AdminProfile model.
    """
    url = serializers.HyperlinkedIdentityField(
        view_name='psycho:adminprofile-detail',
        read_only=True,
    )

    user_id = serializers.PrimaryKeyRelatedField(source='user', read_only=True)

    username = serializers.CharField(
        source='user',  # Not user.username to prevent NoneType error ; then to_representation will handle it
        error_messages={
            'required': 'Username is required.',
            'blank': 'Username cannot be blank.',
        }
    )

    password = serializers.CharField(
        write_only=True,
        style={'input_type': 'password'},
        required=False,
        allow_blank=True,
        error_messages={
            'blank': 'Password cannot be blank.',
        }
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

        read_only_fields = [
            "admin_id",
            "user_id",
            "date_registered",
            "date_updated"
        ]

    def create(self, validated_data):
        """
        Create a new user while creating an admin profile.
        """
        username = validated_data.pop('username', None)
        password = validated_data.pop('password', None)

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
            user_data = validated_data.pop('user', {})

            username = user_data.get('username', None)
            email = user_data.get('email', None)

            if username and username != user.username and User.objects.filter(username=username).exclude(
                    pk=user.pk).exists():
                raise serializers.ValidationError({"username": "This username is already taken."})

            if email and email != user.email and User.objects.filter(email=email).exclude(pk=user.pk).exists():
                raise serializers.ValidationError({"email": "This email is already taken."})

            if username:
                user.username = username
            if email:
                user.email = email

            user.save()

            for field in self.Meta.fields:
                if field in validated_data and field != 'user':
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
            rep['username'] = username

        return rep

    def to_internal_value(self, data):
        """
        Tranform the user key in the validated_data into a dictionnary containing the username.
        """
        rep = super().to_internal_value(data)
        if 'user' in rep and isinstance(rep['user'], str):
            # If user is a string, assume it's the username
            rep['user'] = {'username': rep['user']}
        rep['user']['password'] = rep.pop('password', None)  # Move password to user dict if exists
        return rep


class UniversitySerializer(serializers.ModelSerializer):
    """
    Serializer class for the University model.
    """

    class Meta:
        model = University
        fields = ["name"]

    def to_internal_value(self, data):
        print("Calling to university repr with : ", data)
        intern = super().to_internal_value(data)
        print("University repr passed")
        return intern

    def create(self, validated_data):
        """
        If the university already exists, return it.
        """
        university_name = validated_data.get('name', None)
        if university_name:
            university, _ = University.objects.get_or_create(**validated_data)
        else:
            raise serializers.ValidationError('A university name is required')
        return university


class ApplicantProfileSerializer(serializers.ModelSerializer):
    """
    Serializer for the Applicant model.
    """
    url = serializers.HyperlinkedIdentityField(
        view_name='psycho:applicant-detail',
        read_only=True,
    )

    user_id = serializers.PrimaryKeyRelatedField(source='user', read_only=True)

    user = serializers.StringRelatedField(read_only=True)

    create_user_account = serializers.BooleanField(
        default=False,
        write_only=True,
        help_text="Create a user account for the applicant.",
    )

    # Beware, username is set here on user not on user.username.
    # This is to prevent a NoneType object doesn't have attribute 'username' error
    # When initially, an applicant does not have a user account. create, update,
    # to_representation methods should handle this case accordingly.
    # Updated, providing a default value sorts the traversal on empty object issue.
    username = serializers.CharField(source='user.username', default=None, read_only=True)
    university = UniversitySerializer(read_only=True)

    class Meta:
        model = ApplicantProfile
        fields = [
            "url",
            "applicant_id",
            "user_id",
            "user",
            "first_name",
            "last_name",
            "date_of_birth",
            "gender",
            "email",
            "phone",
            "degree",
            "baccalaureate_series",
            "baccalaureate_average",
            "baccalaureate_session",
            "university",
            "university_field_of_study",
            "university_average",
            "date_registered",
            "date_updated",
            "create_user_account",
            "username",
        ]

        read_only_fields = [
            "applicant_id",
            "user",
            "date_registered",
            "date_updated",
        ]

    # def to_representation(self, instance):
    #     """
    #     Customize the representation of the serializer.
    #     """
    #     # Get the initial representation
    #     rep = super().to_representation(instance)
    #
    #     rep["username"] = instance.user.username if instance.user else None
    #
    #     return rep

    def to_internal_value(self, data):
        """
        Customize the internal representation by handling unexpected fields.
        """

        # Phone field preprocessing
        print("The phone number is : ", data.get('phone'))
        if data.get('phone') and not data['phone'].startswith('+229'):
            data['phone'] = '+229' + data.get('phone')
        print("After preprocessing, the phone number is : ", data.get('phone'))

        university_data = data.get("university", None)
        university_average = data.get('university_average', None)
        university_field_of_study = data.get('university_field_of_study', None)
        if university_data:
            university_average = university_data.pop('university_average', None)
            university_field_of_study = university_data.pop('university_field_of_study', None)
            # Beware, as create is overwritten, university is not readonly anymore and the deserialization of university
            # field is handle over to UniversitySerializer to_internal_value. So enforce with read_only=True
        intern = super().to_internal_value(data)
        if university_average:
            intern['university_average'] = university_average

        if university_field_of_study:
            intern['university_field_of_study'] = university_field_of_study

        return intern

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
        Create a new applicant profile, and optionally create a user account if needed.
        Handle a university creation
        """
        create_user_account = validated_data.pop('create_user_account')
        username = validated_data.pop('username', None)
        password = validated_data.pop('password', None)

        university = validated_data.pop('university', None)

        with transaction.atomic():

            # Create the applicant profile
            applicant_profile = ApplicantProfile.objects.create(**validated_data)

            # Create the university (or retrieve it)
            if university:
                university_serializer = UniversitySerializer(data=university)
                university_serializer.is_valid(raise_exception=True)
                university_instance = university_serializer.save()
                applicant_profile.university = university_instance

            # If user account creation is requested
            if create_user_account:
                ApplicantProfileSerializer.create_usr_account(applicant_profile, username, password)

        return applicant_profile

    def update(self, instance, validated_data):
        """
        Update an existing applicant profile, and optionally update the user account if needed.
        """
        # In case a profile upgrade is asked.
        create_user_account = validated_data.pop('create_user_account', None)
        username = validated_data.pop('username', None)
        password = validated_data.pop('password', None)
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
        view_name='psycho:application-detail',
        read_only=True,
    )
    # applicant_profile_data = ApplicantProfileSerializer(write_only=True)
    applicant = ApplicantProfileSerializer()  # Default to read_only but switch to writable as create is overwritten.

    # Need to be writable for further nested applicant field handling.

    class Meta:
        model = Application
        fields = [
            'url',
            'application_id',
            'tracking_id',
            'applicant',
            'status',
            'date_submitted',
            'date_updated',
        ]

        read_only_fields = [
            'application_id',
            # 'tracking_id',
            'date_submitted',
            'date_updated',
        ]

    def create(self, validated_data):
        """
        Create a new application.
        """
        applicant_profile_data = validated_data.pop('applicant', None)

        with transaction.atomic():  # Transaction because save tries to create an applicant profile if
            # it does not exist, thus the database hit must be atomic.

            # Here we delegate the applicant profile creation to the nested serializer, not the Model manager
            if applicant_profile_data:
                # Since applicant is a writable serializer on ApplicationSerialize, applicant is expected by default
                applicant_serializer = ApplicantProfileSerializer(data=applicant_profile_data)
                applicant_serializer.is_valid(raise_exception=True)
                applicant_instance = applicant_serializer.save()

            application = Application(**validated_data, applicant=applicant_instance)
            try:
                application.save()
            except ValueError as ve:
                message = str(ve)
                field_names = ['first_name', 'last_name', 'date_of_birth', 'email', 'phone']
                for field in field_names:
                    if field in message:
                        raise serializers.ValidationError({field: message})
                # fallback generic error
                raise serializers.ValidationError(message) from ve

        return application
