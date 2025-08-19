import { useReducer, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

import ApplicationFormSection from "./ApplicationFormAssets/ApplicationFormSection.jsx";
import ApplicationConfirmationPage from "./ApplicationFormAssets/ApplicationConfirmationPage.jsx";

import applicationFormReducer from "./reducers/applicationFormReducer.js";

import { initialApplicationFormData } from "./ApplicationFormAssets/aplicationFormConfig.jsx";
import { applicationFormSections as sections } from "./ApplicationFormAssets/aplicationFormConfig.jsx";

import { objectFromCamelToSnakeCase } from "../utils/utils.js";
import { schema } from "./ApplicationFormAssets/validationRules.js";
import { handleFailedApplicationSubmission } from "./ApplicationFormAssets/utils.js";
import { Box, CircularProgress, Typography } from "@mui/material";
import ApplicationFormStepper from "./ApplicationFormAssets/ApplicationFormStepper.jsx";
import { postData as postApplication } from "../utils/crud.js";

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
        defaultValues: { ...initialApplicationFormData },
    });

    const { handleSubmit, getValues, setError, setFocus } = formMethods;

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
        mutationFn: (data) =>
            postApplication(
                data,
                "http://127.0.0.1:8000/psycho/api/applications/"
            ),
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

    return applicationMutation.isSuccess ?
            <ApplicationConfirmationPage
                email={confirmationInfos.email}
                trackingNumber={confirmationInfos.trackingNumber}
            />
        :   <>
                <Box className="form-wrapper" sx={{ position: "relative" }}>
                    <form
                        id="application-form"
                        onSubmit={handleSubmit(onSubmit, onError)}
                    >
                        <Typography
                            variant="h1"
                            sx={{
                                fontSize: "1.5rem",
                                marginBottom: "1rem",
                                textAlign: "center",
                                fontWeight: "bold",
                                color: "primary.main",
                            }}
                        >
                            Créer ma candidature
                        </Typography>
                        <Box
                            sx={{
                                width: "100%",
                                // boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
                                padding: "1rem",
                                borderRadius: "8px",
                            }}
                        >
                            <ApplicationFormStepper
                                activeStep={currentSection.index}
                            />
                        </Box>
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
                        <Box
                            sx={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "100%",
                                height: "100%",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                zIndex: 1000,
                                backgroundColor: "rgba(255, 255, 255, 0.6)",
                            }}
                        >
                            <CircularProgress
                                size={50}
                                thickness={2}
                                value={100}
                            />
                        </Box>
                    )}
                </Box>
            </>;
};

export default ApplicationForm;
