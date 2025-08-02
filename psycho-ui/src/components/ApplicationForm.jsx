import { useReducer } from "react";
import ApplicationFormSection from "./ApplicationFormAssets/ApplicationFormSection.jsx";
import applicationFormReducer from "./reducers/applicationFormReducer.js";
import { FormProvider } from "react-hook-form";

import "./styles/applicationForm.css";

import { useForm } from "react-hook-form";
import ApplicationFormDataProvider from "./contexts/ApplicationFormDataProvider.jsx";

import {
    initialApplicationFormData,
    applicationFormSections as sections,
} from "./ApplicationFormAssets/aplicationFormConfig.jsx";
import { yupResolver } from "@hookform/resolvers/yup";
import { schema } from "./ApplicationFormAssets/validationRules.js";

const ApplicationForm = () => {
    const numberOfSections = Object.keys(sections).length;

    const [applicationFormState, dispatchApplicationFormStateAction] =
        useReducer(applicationFormReducer, {
            section: 1,
            status: "editing",
            progress: 0,
            nbOfSections: numberOfSections,
        });

    const formMethods = useForm({
        mode: "onTouched",
        resolver: yupResolver(schema),
        shouldUseNativeValidation: false,
        defaultValues: { ...initialApplicationFormData },
    });

    return (
        <ApplicationFormDataProvider>
            <form action="#" method="POST" id="application-form">
                <h2 className="title">Créer ma candidature</h2>
                <FormProvider {...formMethods}>
                    <ApplicationFormSection
                        title={sections[applicationFormState.section].title}
                        applicationFormState={applicationFormState}
                        dispatchApplicationFormStateAction={
                            dispatchApplicationFormStateAction
                        }
                    >
                        {sections[applicationFormState.section].content}
                    </ApplicationFormSection>
                </FormProvider>
            </form>
        </ApplicationFormDataProvider>
    );
};

export default ApplicationForm;
