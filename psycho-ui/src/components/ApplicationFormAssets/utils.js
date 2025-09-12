import { initialApplicationFormData } from "./aplicationFormConfig";
import { objectFromSnakeToCamelCase } from "../../utils/utils";

export function getFieldSectionName(field) {
    // Given a field (eg. firstName), return its section (personalHistory) in the form
    // baccalaureateSeries => highSchool
    for (let key in initialApplicationFormData) {
        if (
            typeof initialApplicationFormData[key] === "object" &&
            Object.keys(initialApplicationFormData[key]).includes(field)
        ) {
            return key;
        }
    }
    return null;
}

export function handleFailedApplicationSubmission(
    error,
    { dispatchApplicationFormStateAction, setError, setFocus }
) {
    // The error is an object returned by the server
    // The function parses the error and sets the form fields with the corresponding error messages
    // It also sets the focus on the first field that failed
    const serverErrors = error.applicant || null;
    if (!serverErrors) return;

    const err = objectFromSnakeToCamelCase(serverErrors);
    const failedFieldsMap = {};
    let firstErrorField = null;

    console.log("Err : ", err);
    for (let field in err) {
        const message =
            Array.isArray(err[field]) ? err[field].join(", ") : err[field];

        failedFieldsMap[field] = message;

        const fieldName = `${getFieldSectionName(field)}.${field}`;
        console.log("Field to focus : ", fieldName);

        // Jump to the corresponding page
        if (getFieldSectionName(field) === "personalHistory") {
            dispatchApplicationFormStateAction({
                type: "SET_SECTION",
                index: 1,
            });
        } else {
            dispatchApplicationFormStateAction({
                type: "SET_SECTION",
                index: 2,
            });
        }
        setError(fieldName, {
            type: "server",
            message: message,
        });

        // Capture the first error field for focusing
        if (!firstErrorField) {
            firstErrorField = fieldName;
        }
    }

    // Focus on the first field that failed. The delay is necessary to ensure that the section rendered first
    if (firstErrorField) {
        setTimeout(() => setFocus(firstErrorField), 50);
    }

    console.log(failedFieldsMap);
}

export function mapApplicationToFormData(apiData) {
    return {
        personalHistory: {
            firstName: apiData.first_name || "",
            lastName: apiData.last_name || "",
            dateOfBirth: apiData.date_of_birth || "",
            gender: apiData.gender || "",
            email: apiData.email || "",
            phone: apiData.phone || "",
        },

        highSchool: {
            baccalaureateSeries: apiData.baccalaureate_series || "",
            baccalaureateSession: apiData.baccalaureate_session || "",
            baccalaureateAverage: apiData.baccalaureate_average || "",
        },

        university: {
            name: apiData.university?.name || "",
            fieldOfStudy: apiData.university_field_of_study || "",
            average: apiData.university_average || "",
        },

        degree: apiData.degree || "",
    };
}

export function mapFormDataToApi(formData) {
    return {
        first_name: formData.personalHistory.firstName,
        last_name: formData.personalHistory.lastName,
        date_of_birth: formData.personalHistory.dateOfBirth,
        gender: formData.personalHistory.gender,
        email: formData.personalHistory.email,
        phone: formData.personalHistory.phone,

        baccalaureate_series: formData.highSchool.baccalaureateSeries,
        baccalaureate_session: formData.highSchool.baccalaureateSession,
        baccalaureate_average: formData.highSchool.baccalaureateAverage,

        degree: formData.degree,

        university: { name: formData.university.name },
        university_field_of_study: formData.university.fieldOfStudy,
        university_average: formData.university.average,
    };
}
