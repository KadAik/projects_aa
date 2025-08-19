import { Stepper, Step, StepLabel } from "@mui/material";

const sections = [
    { id: 1, title: "Informations personnelles" },
    { id: 2, title: "Parcours académique" },
    { id: 3, title: "Récapitulatif" },
];

export default function ApplicationFormStepper({ activeStep }) {
    return (
        <Stepper
            activeStep={activeStep}
            alternativeLabel
            sx={{
                width: "100%",
                backgroundColor: "transparent",
                "& .MuiStepLabel-label": {
                    fontSize: "0.75rem",
                    fontWeight: "bold",
                },
                "& .MuiStepConnector-line": {
                    borderColor: "primary.main",
                },
            }}
        >
            {sections.map((section) => (
                <Step key={section.id}>
                    <StepLabel>{section.title}</StepLabel>
                </Step>
            ))}
        </Stepper>
    );
}
