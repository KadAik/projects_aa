import { useReducer, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

import ApplicationFormSection from "./ApplicationFormAssets/ApplicationFormSection.jsx";
import ApplicationConfirmationPage from "./ApplicationFormAssets/ApplicationConfirmationPage.jsx";

import applicationFormReducer from "./reducers/applicationFormReducer.js";

import "./styles/applicationForm.css";

import { initialApplicationFormData } from "./ApplicationFormAssets/aplicationFormConfig.jsx";
import { applicationFormSections as sections } from "./ApplicationFormAssets/aplicationFormConfig.jsx";

import { objectFromCamelToSnakeCase } from "../utils/utils.js";
import { schema } from "./ApplicationFormAssets/validationRules.js";
import { handleFailedApplicationSubmission } from "./ApplicationFormAssets/utils.js";

const ApplicationForm = () => {
    const numberOfSections = Object.keys(sections).length;
    const [confirmationInfos, setConfirmationInfos] = useState({
        email: null,
        trackingNumber: null,
    });

    const [applicationFormState, dispatchApplicationFormStateAction] =
        useReducer(applicationFormReducer, {
            section: { index: 1, name: "personalHistory" }, // personalHistory, educationalBackground, recap
            progress: 0,
            nbOfSections: numberOfSections,
        });

    const formMethods = useForm({
        mode: "onTouched",
        resolver: yupResolver(schema),
        shouldUseNativeValidation: false,
        defaultValues: initialApplicationFormData,
    });

    const { handleSubmit, getValues, setError, setFocus } = formMethods;

    const postApplication = (applicationDetails) =>
        axios
            .post(
                "http://127.0.0.1:8000/psycho/api/applications/",
                applicationDetails
            )
            .then((response) => {
                const contentType = response.headers["content-type"];

                console.log("Content type : ", contentType);
                console.log("Response data with axios : ", response.data);

                return contentType === "application/json"
                    ? response.data
                    : response.statusText;
            })
            .catch((e) => {
                console.log("Error with axios : ");

                const errorData =
                    e.response?.status === 400 ? e.response.data : e.toJSON();

                const err = new Error("Application submission unsuccessful");
                err.cause = errorData;

                throw err;
            });

    const dataToPost = () => {
        const { personalHistory, degree, highSchool, university } = getValues();
        const applicantInfos = {
            ...objectFromCamelToSnakeCase(personalHistory),
            degree,
            ...objectFromCamelToSnakeCase(highSchool),
            university: objectFromCamelToSnakeCase(university),
        };
        return {
            applicant: applicantInfos,
        };
    };

    const applicationMutation = useMutation({
        mutationFn: postApplication,
        onSuccess: (data) => {
            console.log("Mutation succeeded:", data);
            setConfirmationInfos({
                email: data.applicant?.email,
                trackingNumber: data.tracking_id,
            });
        },
        onError: (error) => {
            console.error("Mutation failed:", error.message);
            console.log("Error object from the server : ", error.cause);
            handleFailedApplicationSubmission(error.cause, {
                dispatchApplicationFormStateAction,
                setError,
                setFocus,
            });
        },
    });

    const onSubmit = async (data) => {
        console.log("Form data : ", data);
        applicationMutation.mutate(dataToPost());
    };

    const onError = (e) => {
        console.log("errors: ", e);
    };

    const currentSection = sections[applicationFormState.section.index];

    return applicationMutation.isSuccess ? (
        <ApplicationConfirmationPage
            email={confirmationInfos.email}
            trackingNumber={confirmationInfos.trackingNumber}
        />
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

            {applicationMutation.isPending && (
                <div className="form-overlay">
                    <div className="spinner" />
                </div>
            )}
        </div>
    );
};

export default ApplicationForm;
