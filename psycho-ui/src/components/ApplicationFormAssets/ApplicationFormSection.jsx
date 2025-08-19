import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";

const ApplicationFormSection = ({
    title,
    children,
    applicationFormState,
    dispatchApplicationFormStateAction,
}) => {
    const {
        trigger,
        getValues,
        unregister,
        formState: { isSubmitting },
    } = useFormContext();

    const handlePreviousClick = () => {
        dispatchApplicationFormStateAction({
            type: "SET_PREVIOUS_SECTION",
        });
    };

    const handleNextClick = async () => {
        const currentSectionName = applicationFormState.section.name;

        let toValidate = ["personalHistory"];

        if (currentSectionName === "educationalBackground") {
            toValidate = ["degree", "highSchool"];
            if (["BACHELOR", "MASTER", "PHD"].includes(getValues("degree"))) {
                toValidate.push("university");
            }
        }
        const isValid = await trigger(toValidate, {
            shouldFocus: true,
        });

        if (isValid) {
            dispatchApplicationFormStateAction({
                type: "SET_NEXT_SECTION",
            });
        }
    };

    const degree = getValues("degree");

    // If the degree is highSchool, we need to unregister university fields so handleSubmit
    // won't validate those fields again (the validation there will fail).
    useEffect(() => {
        if (degree === "HIGHSCHOOL" || degree === "") {
            unregister([
                "university.name",
                "university.fieldOfStudy",
                "university.average",
            ]);
        }
    }, [unregister, degree]);

    return (
        <Box
            component="section"
            className="application-section"
            sx={{
                p: { xs: 2, sm: 3, md: 4 },
                mb: { xs: 3, md: 4 },
                borderRadius: 2,
                boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
                backgroundColor: "background.paper",
            }}
        >
            <Typography variant="h6" sx={{ mb: 1 }} textAlign={"center"}>
                {title}
            </Typography>
            {children}
            <Box component="hr" sx={{ my: 2, borderColor: "divider" }} />
            <Stack
                spacing={2}
                direction={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
            >
                <Button
                    variant="outlined"
                    type="button"
                    onClick={handlePreviousClick}
                    disabled={applicationFormState.section.index === 1}
                >
                    ← Précédent
                </Button>

                {applicationFormState.section.index <
                    applicationFormState.nbOfSections && (
                    <Button
                        variant="contained"
                        type="button"
                        onClick={handleNextClick}
                    >
                        Suivant →
                    </Button>
                )}

                {applicationFormState.section.index ===
                    applicationFormState.nbOfSections && (
                    <Button
                        variant="contained"
                        type="submit"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Submitting..." : "Soumettre"}
                    </Button>
                )}
            </Stack>
        </Box>
    );
};

export default ApplicationFormSection;
