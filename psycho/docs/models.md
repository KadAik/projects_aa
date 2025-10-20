## AdminProfile

-   Represents an admin user of the platform.
-   One-to-one relationship with the User model.
-   A super user account is automatically created when an admin profile is created.
    -   An admin profile must have a user account linked to it.
-   Unique constraint: email, phone, (last_name + date_of_birth)
-   Automatically uppercases last_name and capitalizes first_name.
-   Calling save
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

-   **application_id**: Auto-generated UUID (primary key).
-   **date_submitted**: Auto-set at creation.
-   **date_updated**: Auto-updated on modification.
-   **tracking_id**: Auto-generated in the format  
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

-   Pending (default)
-   Accepted
-   Rejected
-   Incomplete

**Notes**:
An application creation or update triggers the creation of ApplicationStatusHistory
model via a listener for post_save signal emitted by Application model.
This is for logging purposes in order to track status changes on an application.

# Applicant Profile API Specification

## Create Applicant Profile

**Endpoint:** `POST /api/applicants/`

**Content-Type:** `multipart/form-data`

---

## Request Structure

### Required Fields

```json
{
    "npi": "string (10 digits)",
    "first_name": "string (max 100 chars)",
    "last_name": "string (max 100 chars)",
    "date_of_birth": "string (YYYY-MM-DD)",
    "place_of_birth": "string (max 100 chars)",
    "gender": "string (M or F)",
    "wears_glasses": "boolean",
    "personnel_type": "string (Civilian or Military)",
    "email": "string (valid email, max 100 chars)",
    "phone": "string (valid BJ phone number)",
    "highest_degree": "integer (foreign key to Degree)",
    "academic_level": "string (BAC, BAC+1, BAC+2, BAC+3, BAC+4, or BAC+5)",
    "baccalaureate_series": "string (D, C, E, or F)",
    "baccalaureate_average": "float (0.0 - 20.0)",
    "birth_certificate": "file (multipart upload)",
    "criminal_record": "file (multipart upload)"
}
```

### Optional Fields

```json
{
    "user": "integer or null (foreign key to User model)"
}
```

---

## Field Specifications

### Personal Information

| Field            | Type    | Constraints                                 | Description                     |
| ---------------- | ------- | ------------------------------------------- | ------------------------------- |
| `npi`            | string  | Required, exactly 10 digits, unique         | Personal identification number  |
| `first_name`     | string  | Required, max 100 characters                | Applicant's first name          |
| `last_name`      | string  | Required, max 100 characters                | Applicant's last name           |
| `date_of_birth`  | date    | Required, format: YYYY-MM-DD                | Applicant's date of birth       |
| `place_of_birth` | string  | Required, max 100 characters                | Applicant's place of birth      |
| `gender`         | string  | Required, choices: "M" or "F"               | Applicant's gender              |
| `wears_glasses`  | boolean | Required                                    | Whether applicant wears glasses |
| `personnel_type` | string  | Required, choices: "Civilian" or "Military" | Personnel type                  |

### Contact Information

| Field   | Type   | Constraints                                         | Description               |
| ------- | ------ | --------------------------------------------------- | ------------------------- |
| `email` | string | Required, valid email format, max 100 chars, unique | Applicant's email address |
| `phone` | string | Required, valid Benin (BJ) phone number, unique     | Applicant's phone number  |

### Educational Background

| Field                   | Type    | Constraints                                                           | Description                         |
| ----------------------- | ------- | --------------------------------------------------------------------- | ----------------------------------- |
| `highest_degree`        | integer | Required, must reference existing Degree ID                           | Foreign key to Degree model         |
| `academic_level`        | string  | Required, choices: "BAC", "BAC+1", "BAC+2", "BAC+3", "BAC+4", "BAC+5" | Current academic level              |
| `baccalaureate_series`  | string  | Required, choices: "D", "C", "E", "F"                                 | Baccalaureate series                |
| `baccalaureate_average` | float   | Required, range: 0.0 - 20.0                                           | Average grade at baccalaureate exam |

### File Uploads

| Field               | Type | Constraints                           | Description                       |
| ------------------- | ---- | ------------------------------------- | --------------------------------- |
| `birth_certificate` | file | Required, max file size limit applies | Scanned copy of birth certificate |
| `criminal_record`   | file | Required, max file size limit applies | Recent criminal record extract    |

### Relationships

| Field  | Type    | Constraints        | Description                             |
| ------ | ------- | ------------------ | --------------------------------------- |
| `user` | integer | Optional, nullable | Foreign key to User model (can be null) |

---

## Expected success response (All fields)

**Status Code:** `201 Created`

```json
{
    "applicant_id": "a3f12c8e-9d4b-4f2a-b8e1-3c5d7a9f2e4b",
    "user": 42,
    "npi": "1234567890",
    "first_name": "Jean-Baptiste",
    "last_name": "Koffi",
    "date_of_birth": "1998-03-22",
    "place_of_birth": "Porto-Novo",
    "gender": "M",
    "wears_glasses": true,
    "personnel_type": "Civilian",
    "email": "jean.koffi@example.com",
    "phone": "+22997654321",
    "highest_degree": 3,
    "academic_level": "BAC+5",
    "baccalaureate_series": "D",
    "baccalaureate_average": 15.75,
    "birth_certificate": "applicant_profiles/birth_certificates/koffi_jeanbaptiste_birth_certificate.pdf",
    "criminal_record": "applicant_profiles/criminal_records/koffi_jeanbaptiste_criminal_record.pdf",
    "date_registered": "2025-10-20T15:45:30.123456Z",
    "date_updated": "2025-10-20T15:45:30.123456Z"
}
```

---

## Important Notes

1. **File Upload Paths**: Files will be automatically stored in structured paths:

    - Birth certificates: `applicant_profiles/birth_certificates/{lastname}_{firstname}_birth_certificate.{ext}`
    - Criminal records: `applicant_profiles/criminal_records/{lastname}_{firstname}_criminal_record.{ext}`

2. **Field Normalization**: First name, last name, and place of birth are automatically normalized (whitespace trimmed, proper formatting applied) on save.

3. **Auto-generated Fields**:

    - `applicant_id`: UUID4, automatically generated
    - `date_registered`: Timestamp, set on creation
    - `date_updated`: Timestamp, updated on each save

4. **Phone Number Format**: Must be a valid Benin (region code: BJ) phone number format.

5. **Historical Records**: All changes to applicant profiles are tracked via `django-simple-history`.

6. **Unique Constraints**: The following fields must be unique:
    - `npi`
    - `email`
    - `phone`
