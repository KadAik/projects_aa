import React from "react";
import PersonalHistoryContent from "../../components/ApplicationFormAssets/PersonalHistoryContent";
import { FormProvider, useForm } from "react-hook-form";
import { Box, Paper, Typography } from "@mui/material";
import HighSchoolDetails from "../../components/ApplicationFormAssets/HighSchoolDetails";
import UniversityDegreeDetails from "../../components/ApplicationFormAssets/UniversityDegreeDetails";
import { LocalizationProvider } from "@toolpad/core/AppProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Button from "@mui/material/Button";
import EducationalBackgroundContent from "../../components/ApplicationFormAssets/EducationalBackgroundContent";
import { fetchData } from "../../utils/crud";
import { useQuery } from "@tanstack/react-query";
import { mapApplicationToFormData } from "../../components/ApplicationFormAssets/utils";
import { useLocation, useParams } from "react-router-dom";
import SchoolIcon from "@mui/icons-material/School";
import { formatDate } from "../../utils/utils";
const url =
    "http://127.0.0.1:8000/psycho/api/applications/49f23ac7-b2b7-4d43-8bee-15088d9a818d/";

const ApplicantProfileEditForm = ({ onSubmit }) => {
    const location = useLocation();
    const initialData = React.useMemo(
        () => location.state?.applicantData,
        [location.state]
    );
    console.log("Initial data from location state: ", initialData);
    let applicantData = {};
    const application = useQuery({
        queryKey: ["applications"],
        queryFn: () => fetchData(url),
    });
    console.log("Application is : ", application.data);

    if (application.data) {
        applicantData = mapApplicationToFormData(application.data?.applicant);
        console.log("To camelcase : ", applicantData);
    }

    const formMethods = useForm({
        defaultValues: mapApplicationToFormData(initialData || applicantData),
    });

    //Watch degree to conditionally show UniversityDegreeDetails
    const degree = formMethods.watch("degree");
    return (
        <FormProvider {...formMethods}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "column",
                        mt: 1,
                    }}
                >
                    <Typography
                        variant="subtitle1"
                        sx={{
                            color: "#1976d2",
                            fontStyle: "italic",
                        }}
                    >
                        Mettre à jour les informations de{" "}
                        <span style={{ fontWeight: "bold" }}>
                            {initialData.first_name} {initialData.last_name}
                        </span>
                    </Typography>
                    {/* Profile creation info */}
                    <Typography variant="body2" color="text.secondary">
                        Profile créé le{" "}
                        {formatDate(initialData?.date_registered) + " "}
                        avec N/A candidature
                    </Typography>
                </Box>

                <Box
                    component="form"
                    onSubmit={formMethods.handleSubmit(onSubmit)}
                    sx={{ maxWidth: 900, margin: "auto", mt: 4, px: 2 }}
                >
                    {/* Personal Information */}
                    <Paper
                        component="section"
                        elevation={2}
                        sx={{ p: 3, mb: 4 }}
                    >
                        <PersonalHistoryContent displayNotice={false} />
                    </Paper>

                    <Paper elevation={2} sx={{ p: 3 }}>
                        <Typography
                            variant="h6"
                            gutterBottom
                            fontWeight="bold"
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                                fontSize: "1.2rem",
                                borderBottom: "1px solid #ccc",
                                pb: 1,
                                mb: 3,
                            }}
                        >
                            <SchoolIcon color="primary" />
                            Parcours académique
                        </Typography>

                        {/* High School Section */}
                        <Paper
                            component="section"
                            elevation={1}
                            sx={{ p: 2, mb: 4 }}
                        >
                            <HighSchoolDetails />
                        </Paper>

                        {/* Educational Background */}
                        <Paper
                            component="section"
                            elevation={1}
                            sx={{ p: 2, mb: 4 }}
                        >
                            <Typography
                                variant="h6"
                                gutterBottom
                                fontWeight="bold"
                                sx={{
                                    mb: 2,
                                    fontSize: "1.1rem",
                                    pb: 1,
                                    borderBottom: "1px solid #ccc",
                                }}
                            >
                                Niveau académique
                            </Typography>
                            <EducationalBackgroundContent
                                displayHighSchoolDetails={false}
                                displayUniversityDetails={false}
                                displayNotice={false}
                            />
                        </Paper>

                        {/* University Degrees (conditional) */}
                        {["BACHELOR", "MASTER", "PHD"].includes(degree) && (
                            <Paper
                                component="section"
                                elevation={1}
                                sx={{ p: 2, mb: 4 }}
                            >
                                <UniversityDegreeDetails degree={degree} />
                            </Paper>
                        )}
                    </Paper>

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
