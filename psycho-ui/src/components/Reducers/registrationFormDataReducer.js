export default function registrationFormDataReducer(formData, action) {
    switch (action.type) {
        case "SET_FIELD":
            return {
                ...formData,
                [action.section]: {
                    ...formData[action.section],
                    [action.field]: action.value,
                },
            };

        case "SET_MULTIPLE_FIELDS":
            return {
                ...formData,
                ...action.payload, // expect: { field1: value1, field2: value2 }
            };

        case "RESET_FORM":
            return  null;//initialFormData; // you'll define this outside

        case "LOAD_SAVED_DATA":
            return {
                ...formData,
                ...action.payload, // merge saved data into current form
            };

        default:
            return formData;
    }
}
