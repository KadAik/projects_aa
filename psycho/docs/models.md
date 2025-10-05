## AdminProfile

- Represents an admin user of the platform.
- One-to-one relationship with the User model.
- A super user account is automatically created when an admin profile is created.
    - An admin profile must have a user account linked to it.
- Unique constraint: email, phone, (last_name + date_of_birth)
- Automatically uppercases last_name and capitalizes first_name.
- Calling save
  The save method on a model instance bypasses validation by default (for instance creating a model and save it in the
  shell using save will not check constraints on the fields). To enforce validation, full_clean must be explicitly
  called on an instance. In Django forms, calling form.is_valid performs validation by invoking full_clean internally.
  This means that if save is called after form.is_valid, it may lead to double validation
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

# Application Model – Data Requirements

The `Application` model represents an application submitted by an applicant and is linked to an `ApplicantProfile`.

---

## 1. Fields Automatically Handled by the System

- **application_id**: Auto-generated UUID (primary key).
- **date_submitted**: Auto-set at creation.
- **date_updated**: Auto-updated on modification.
- **tracking_id**: Auto-generated in the format  
  `{last_name[:2]}-{ddmmyy_of_birth}-{random_3_digits}`  
  Example: `Jo-200501-482`.

---

## 2. Ways to Create an Application

### A. If ApplicantProfile Already Exists

Provide only the `applicant` field (UUID):

```json
{
  "applicant": "uuid-of-existing-applicant-profile",
  "status": "Pending"
}
```

### B. If an applicant profile doesn't exist

Provide applicant details under a dict `applicant_profile_data`.

For example :
The following fields are required,

```json
{
  "applicant_profile_data": {
    "first_name": "Alice",
    "last_name": "Johnson",
    "gender": "F",
    "date_of_birth": "2001-05-20",
    "email": "alice.johnson@example.com",
    "phone": "+22991234567",
    "degree": "BACHELOR",
    "baccalaureate_series": "D",
    "baccalaureate_session": "2019-07-01",
    "baccalaureate_average": 15.5
  },
  "status": "Pending"
}
```

The status field accepts the following values:

* Pending (default)
* Accepted
* Rejected
* Incomplete

__Notes__:
An application creation or update triggers the creation of ApplicationStatusHistory
model via a listener for post_save signal emitted by Application model.
This is for logging purposes in order to track status changes on an application.



