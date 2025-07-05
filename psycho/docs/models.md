## AdminProfile
- Represents an admin user of the platform.
- One-to-one relationship with the User model.
- A super user account is automatically created when an admin profile is created.
    - An admin profile must have a user account linked to it.
- Unique constraint: email, phone, (last_name + date_of_birth)
- Automatically uppercases last_name and capitalizes first_name.
- Calling save
    The save method on a model instance bypasses validation by default (for instance creating a model and save it in the shell using save will not check constraints on the fields). To enforce validation, full_clean must be explicitly
    called on an instance. In Django forms, calling form.is_valid performs validation by invoking full_clean internally. This means that if save is called after form.is_valid, it may lead to double validation
    if save is called after that. This may cause some issues. To prevent them, save might take validate kwargs as follow:

    ```python
    def save(self, *args, **kwargs):
        validate = kwargs.pop('validate', True)
        if validate:
            self.full_clean()
        super().save(*args, **kwargs)

    # Usage example:
    admin_profile = AdminProfile(last_name="Doe", first_name="John")
    admin_profile.save(validate=True)  # Enforces validation
    admin_profile.save(validate=False)  # Skips validation
    ```



## Application
- The submission of an application must be followed by the creation of a linked applicant profile.