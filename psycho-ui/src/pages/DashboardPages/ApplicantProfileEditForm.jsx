import React from "react";
import PersonalHistoryContent from "../../components/ApplicationFormAssets/PersonalHistoryContent";
import { FormProvider, useForm } from "react-hook-form";
import { Box, Typography } from "@mui/material";
import HighSchoolDetails from "../../components/ApplicationFormAssets/HighSchoolDetails";
import UniversityDegreeDetails from "../../components/ApplicationFormAssets/UniversityDegreeDetails";
import { LocalizationProvider } from "@toolpad/core/AppProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Button from "@mui/material/Button";
import EducationalBackgroundContent from "../../components/ApplicationFormAssets/EducationalBackgroundContent";
import { useApplications } from "../../assets/PsychoAPI/requests";
import { fetchData } from "../../utils/crud";
import { useQuery } from "@tanstack/react-query";
import { objectFromSnakeToCamelCase } from "../../utils/utils";

const url =
    "http://127.0.0.1:8000/psycho/api/applications/49f23ac7-b2b7-4d43-8bee-15088d9a818d/";

const ApplicantProfileEditForm = ({ onSubmit }) => {
    let data = {};
    const application = useQuery({
        queryKey: ["applications"],
        queryFn: () => fetchData(url),
    });
    console.log("Application is : ", application.data);

    if (application.data) {
        applicantData = objectFromSnakeToCamelCase(application.data.applicant);
        console.log("To camelcase : ", applicantData);
    }

    const formMethods = useForm();

    //Watch degree to conditionally show UniversityDegreeDetails
    const degree = formMethods.watch("degree");
    return (
        <FormProvider {...formMethods}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Box
                    component="form"
                    onSubmit={formMethods.handleSubmit(onSubmit)}
                    sx={{ maxWidth: 900, margin: "auto", mt: 4, px: 2 }}
                >
                    {/* Personal Information */}
                    <Box
                        component="section"
                        sx={{
                            mb: 4,
                            p: 3,
                            borderRadius: 2,
                            border: "1px solid #e0e0e0",
                            backgroundColor: "#fafafa",
                        }}
                    >
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            Informations personnelles
                        </Typography>
                        <PersonalHistoryContent displayNotice={false} />
                    </Box>

                    {/* High School Section */}
                    <Box
                        component="section"
                        sx={{
                            mb: 4,

                            borderRadius: 2,

                            backgroundColor: "#f9f9f9",
                        }}
                    >
                        <HighSchoolDetails />
                    </Box>

                    {/* Educational Background */}
                    <Box
                        component="section"
                        sx={{
                            mb: 4,
                            p: 3,
                            borderRadius: 2,
                            border: "1px solid #e0e0e0",
                            backgroundColor: "#fafafa",
                        }}
                    >
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            Niveau académique
                        </Typography>
                        <EducationalBackgroundContent
                            displayHighSchoolDetails={false}
                            displayUniversityDetails={false}
                            displayNotice={false}
                        />
                    </Box>

                    {/* University Degrees (conditional) */}
                    {["BACHELOR", "MASTER", "PHD"].includes(degree) && (
                        <Box
                            component="section"
                            sx={{
                                mb: 4,
                                p: 3,
                                borderRadius: 2,
                                border: "1px solid #e0e0e0",
                                backgroundColor: "#f9f9f9",
                            }}
                        >
                            <Typography variant="h6" sx={{ mb: 2 }}>
                                Informations universitaires
                            </Typography>
                            <UniversityDegreeDetails degree={degree} />
                        </Box>
                    )}

                    {/* Submit Button */}
                    <Box sx={{ textAlign: "right", mt: 3 }}>
                        <Button type="submit" variant="contained" size="large">
                            Sauvegarder
                        </Button>
                    </Box>
                </Box>
            </LocalizationProvider>
        </FormProvider>
    );
};
export default ApplicantProfileEditForm;
