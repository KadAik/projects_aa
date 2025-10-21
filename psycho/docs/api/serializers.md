# Applicant Creation API - Request Data Structure

This document describes the JSON structure expected by the backend API when creating a new applicant profile.

## Endpoint

`POST /api/applicants/`

---

## Request Body

```json
{
  "first_name": "string",                 // Applicant's first name
  "last_name": "string",                  // Applicant's last name
  "date_of_birth": "YYYY-MM-DD",         // Date of birth in ISO format
  "gender": "M" | "F",                    // Gender, must be 'M' or 'F'
  "email": "string",                      // Valid email address
  "phone": "string",                      // Phone number with country code (e.g. +229012345678)

  "degree": "HIGHSCHOOL" | "BACHELOR" | "MASTER" | "PHD",  // Highest degree attained

  // High School (Baccalaureate) fields (flat structure)
  "baccalaureate_series": "D" | "C" | "E" | "F",
  "baccalaureate_average": number,
  "baccalaureate_session": "YYYY-MM-DD",

  // University info as a nested object (alternative to flat fields)
  "university": {
    "name": "string",                // University name
    "field_of_study": "string",     // Field of study/major
    "average": number               // Average score (0 to 20)
  },

  // Flat university fields
  "university_name": "string",
  "university_field_of_study": "string",
  "university_average": number,

  "create_user_account": boolean,   // Whether to create a user account for the applicant
  "username": "string"              // Desired username if creating a user account
}
**Notes**
If both nested and flat versions university are provided then the flat fields take act as a fallback (the
nested versuion take precedence).__

Example:
{
    "first_name": "Sai",
    "last_name": "dotou",
    "date_of_birth": "1999-02-05",
    "gender": "M",
    "email": "sai@sample.com",
    "phone": "+2290123235556",
    "degree": "BACHELOR",
    "baccalaureate_series": "D",
    "baccalaureate_average": "11.6",
    "baccalaureate_session": "2005-05-05",
    "university": {
        "name": "INE"
    },
    "university_field_of_study": "eau",
    "university_average": "10.5",
    "create_user_account": false,
    "username": ""
}
```

## Aplications

** Response example **

```json
{
    "url": "http://127.0.0.1:8000/psycho/api/applications/022c78bf-82a2-4d2b-9bcf-54da7e5abef3/",
    "application_id": "022c78bf-82a2-4d2b-9bcf-54da7e5abef3",
    "tracking_id": "AL-021025-191",
    "applicant": {
        "url": "http://127.0.0.1:8000/psycho/api/applicant/a7838b6a-5010-4761-a82c-271850b620da/",
        "applicant_id": "a7838b6a-5010-4761-a82c-271850b620da",
        "first_name": "Ismael",
        "last_name": "ALI",
        "gender": "M",
        "npi": "7474859658",
        "date_of_birth": "2025-10-02",
        "place_of_birth": "Bohicon",
        "wears_glasses": false,
        "personnel_type": "Military",
        "email": "ali@mail.com",
        "phone": "+2290196325874",
        "highest_degree": {
            "id": 2,
            "name": "Licence en GC",
            "degree": "Bachelor",
            "institution": "UP"
        },
        "academic_level": "BAC+4",
        "baccalaureate_series": "D",
        "baccalaureate_average": 14.0,
        "birth_certificate": "http://127.0.0.1:8000/applicant_profiles/birth_certificates/ali_ismael_birth_certificate.pdf",
        "criminal_record": "http://127.0.0.1:8000/applicant_profiles/criminal_records/ali_ismael_criminal_record.pdf",
        "date_registered": "2025-10-21T14:58:34.123790Z",
        "date_updated": "2025-10-21T14:58:34.123790Z"
    },
    "composition_centre": {
        "id": 1,
        "name": "Cotonou",
        "location": "CEG Gbégamey"
    },
    "status": "Pending",
    "date_submitted": "2025-10-21T14:58:34.137155Z",
    "date_updated": "2025-10-21T14:58:34.137155Z",
    "status_history_ids": [1]
}
```
