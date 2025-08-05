import { useEffect, useReducer, useState } from "react";
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

import ApplicationConfirmationPage from "./ApplicationConfirmationPage.jsx";

const ApplicationForm = () => {
    const numberOfSections = Object.keys(sections).length;

    const [applicationFormState, dispatchApplicationFormStateAction] =
        useReducer(applicationFormReducer, {
            section: { index: 1, name: "personalHistory" }, // personalHistory, educationalBackground, recap
            status: "editing",
            progress: 0,
            nbOfSections: numberOfSections,
        });

    const formMethods = useForm({
        mode: "onTouched",
        resolver: yupResolver(schema),
        shouldUseNativeValidation: false,
        defaultValues: initialApplicationFormData,
    });

    const {
        handleSubmit,
        formState: { isSubmitting, isSubmitted, submitCount },
    } = formMethods;

    const send = async () =>
        new Promise((resolve) => setTimeout(resolve, 15000));

    const onSubmit = async (data, event) => {
        console.log("entry............");
        await send();
        setShowConfirmation(true);
    };

    const onError = (e) => {
        console.log("errors: ", e);
    };

    const currentSection = sections[applicationFormState.section.index];

    const [showConfirmation, setShowConfirmation] = useState(false);

    return (
        <ApplicationFormDataProvider>
            {showConfirmation ? (
                <ApplicationConfirmationPage />
            ) : (
                <div className="form-wrapper">
                    <form
                        id="application-form"
                        onSubmit={handleSubmit(onSubmit, onError)}
                    >
                        <h2 className="title">Créer ma candidature</h2>
                        <FormProvider {...formMethods}>
                            <ApplicationFormSection
                                title={currentSection.title}
                                applicationFormState={applicationFormState}
                                dispatchApplicationFormStateAction={
                                    dispatchApplicationFormStateAction
                                }
                            >
                                {currentSection.content}
                            </ApplicationFormSection>
                        </FormProvider>
                    </form>

                    {isSubmitting && (
                        <div className="form-overlay">
                            <div className="spinner" />
                        </div>
                    )}
                </div>
            )}
        </ApplicationFormDataProvider>
    );
};

export default ApplicationForm;
