import { useReducer } from "react";
import RegistrationFormSection from "./RegistrationFormAssets/RegistrationFormSection";
import RFPersonalHistoryContent from "./RegistrationFormAssets/RFPersonalHistoryContent";
import RFEducationalBackgroundContent from "./RegistrationFormAssets/RFEducationalBackgroundContent";
import RFRecapPage from "./RegistrationFormAssets/RFRecapPage";
import registrationFormReducer from "./Reducers/registrationFormReducer";
import registrationFormDataReducer from "./Reducers/registrationFormDataReducer";

import { FormDataContext, FormDataContextSetter } from "./Contexts/FormDataContext.js";

const stages = {
    1: {component: <RFPersonalHistoryContent />, title: "Informations personnelles"},
    2: {component: <RFEducationalBackgroundContent />, title: "Informations académiques"},
    3: {component: <RFRecapPage />, title: "Récapitulatif de votre candidature"},
};

const initialFormData = {
    
    personalHistory: {
        firstName: "",
        lastName: "",
        birthDate: "",
        gender: "",
        email: "",
        phone: "",
        degree: ""
    },

    highSchool: {
        baccalaureateSerie: "",
        baccalaureateSession: "",
        average: "",
    },

    university: {
        name: "",
        fieldOfStudy: "",
        average: ""
    }
};

export default function RegistrationForm() {

    const [formData, dispatchFormDataAction] = useReducer(registrationFormDataReducer, {... initialFormData});

    const [state, dispatchFormState] = useReducer(registrationFormReducer, {
        stage: 1,
        status: "editing",
        progress: 0,
    });

    return (
        <FormDataContext.Provider value={formData}>
            <FormDataContextSetter.Provider value={dispatchFormDataAction}>
                <form action="#" method="POST" id="application-registration-form">
                    <h2 className="title">Créer ma candidature</h2>

                    <RegistrationFormSection title={stages[state.stage].title} formState={state} dispatchFormState={dispatchFormState}>
                        {stages[state.stage].component}
                    </RegistrationFormSection>
            
                </form>
            </FormDataContextSetter.Provider>
        </FormDataContext.Provider>
    );
}