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
