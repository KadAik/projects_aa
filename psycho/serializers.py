from rest_framework import serializers
from .models import(
    User,
    AdminProfile,
    ApplicantProfile,
    HRManagerProfile,
    Application,
    Review,
)

from django.db import transaction


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
        view_name = 'psycho:adminprofile-detail',
        read_only = True,
    )
    
    user_id = serializers.PrimaryKeyRelatedField(source='user', read_only=True)
    
    username = serializers.CharField(
        source='user', # Not user.username to prevent NoneType error ; then to_representation will handle it
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

            if username and username != user.username and User.objects.filter(username=username).exclude(pk=user.pk).exists():
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


class ApplicantProfileSerializer(serializers.ModelSerializer):
    """
    Serializer for the Applicant model.
    """
    url = serializers.HyperlinkedIdentityField(
        view_name = 'psycho:applicant-detail',
        read_only = True,
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
    # when initially, an applicant does not have a user account. The create, update, to_representation methods should handle this case accordingly.
    username = serializers.CharField(source='user', required=False, allow_blank=True)
    
    password = serializers.CharField(
        write_only=True,
        style={'input_type': 'password'},
        required=False,
        allow_blank=True,
    )
    
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
            "date_registered",
            "date_updated",
            "create_user_account",
            "password",
            "username",
        ]
        
        read_only_fields = [
            "applicant_id",
            "user",
            "date_registered",
            "date_updated",
            "password",
            "username",
        ]
    
    def to_representation(self, instance):
        """
        Customize the representation of the serializer.
        """
        # Get the initial representation
        rep = super().to_representation(instance)
        
        rep["username"] = instance.user.username if instance.user else None
            
        return rep
            
    def create_usr_account(self, applicant_profile, username, password):
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
        """
        create_user_account = validated_data.pop('create_user_account')
        username = validated_data.pop('username', None)
        password = validated_data.pop('password', None)
        
        del validated_data['user']  # Remove user field from validated_data
        
        with transaction.atomic():
            # Create the applicant profile
            applicant_profile = ApplicantProfile.objects.create(**validated_data)
            
            # If user account creation is requested
            if create_user_account:
                self.create_usr_account(applicant_profile, username, password)
        return applicant_profile
        
    def update(self, instance, validated_data):
        """
        Update an existing applicant profile, and optionally update the user account if needed.
        """
        create_user_account = validated_data.pop('create_user_account', None)
        username = validated_data.pop('username', None)
        password = validated_data.pop('password', None)
        
        first_name = validated_data.get('first_name', None)
        last_name = validated_data.get('last_name', None)
        gender = validated_data.get('gender', None)
        date_of_birth = validated_data.get('date_of_birth', None)
        new_email = validated_data.get('email', None)
        phone = validated_data.get('phone', None)
        
        old_mail = instance.email
        
        if new_email and new_email != old_mail and ApplicantProfile.objects.filter(email=new_email).exists():
            raise serializers.ValidationError({"email": "This email is already taken."})
        else:
            instance.email = new_email
        
        if first_name is not None:
            instance.first_name = first_name
        if last_name is not None:
            instance.last_name = last_name
        if gender is not None:
            instance.gender = gender
        if date_of_birth is not None:
            instance.date_of_birth = date_of_birth
        if phone is not None:
            instance.phone = phone
        
        instance.save()
         
        if create_user_account:
            self.create_usr_account(instance, username, password)
        
        return instance
                 

class ApplicationSerializer(serializers.ModelSerializer):
    """
    Serializer for an Application.
    """
    url = serializers.HyperlinkedIdentityField(
        view_name='psycho:application-detail',
        read_only=True,
    )
    applicant_profile_data = ApplicantProfileSerializer(write_only=True)
    
    class Meta:
        model = Application
        fields = [
            'url',
            'application_id',
            'applicant',
            'status',
            'date_submitted',
            'date_updated',
            'applicant_profile_data',
        ]
        
        read_only_fields = [
            'application_id',
            'date_submitted',
            'date_updated',
            'applicant',
        ]
        
    def create(self, validated_data):
        """
        Create a new application.
        """
        applicant_profile_data = validated_data.pop('applicant_profile_data', None)
        
        with transaction.atomic():  # Transaction because save tries to create an applicant profile if it does not exist.
            application = Application(**validated_data)
            try:
                application.save(applicant_profile_data=applicant_profile_data)
            except ValueError as ve:
                message = str(ve)
                if "first_name" in message:
                    raise serializers.ValidationError({"first_name": message})
                elif "last_name" in message:
                    raise serializers.ValidationError({"last_name": message})
                elif "date_of_birth" in message:
                    raise serializers.ValidationError({"date_of_birth": message})
                elif "email" in message:
                    raise serializers.ValidationError({"email": message})
                elif "phone" in message:
                    raise serializers.ValidationError({"phone": message})
                else:
                    raise serializers.ValidationError({"non_field_errors": message})

        return application
    
    