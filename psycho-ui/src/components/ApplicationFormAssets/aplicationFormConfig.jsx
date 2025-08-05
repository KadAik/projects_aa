import PersonalHistoryContent from "./PersonalHistoryContent.jsx";
import EducationalBackgroundContent from "./EducationalBackgroundContent.jsx";
import ApplicationRecapPage from "./ApplicationRecapPage.jsx";

export const applicationFormSections = {
    1: {
        content: <PersonalHistoryContent />,
        title: "Informations personnelles",
    },
    2: {
        content: <EducationalBackgroundContent />,
        title: "Informations académiques",
    },
    3: {
        content: <ApplicationRecapPage />,
        title: "Récapitulatif de votre candidature",
    },
};

export const initialApplicationFormData = {
    personalHistory: {
        firstName: "",
        lastName: "",
        birthDate: "",
        gender: "",
        email: "",
        phone: "",
    },

    highSchool: {
        baccalaureateSerie: "",
        baccalaureateSession: "",
        average: "",
    },

    university: {
        name: "",
        fieldOfStudy: "",
        average: "",
    },
    degree: "",
};
