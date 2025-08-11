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
```
