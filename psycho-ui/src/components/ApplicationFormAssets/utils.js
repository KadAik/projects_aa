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
