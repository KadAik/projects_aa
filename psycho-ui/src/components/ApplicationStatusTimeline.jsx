import Paper from "@mui/material/Paper";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Typography from "@mui/material/Typography";

const ApplicationStatusTimeline = () => {
    return (
        <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                Historique du traitement
            </Typography>
            <Stepper activeStep={activeStep} orientation="vertical">
                {statusSteps.map((step, index) => (
                    <Step key={step.label} completed={step.completed}>
                        <StepLabel
                            optional={
                                step.date && (
                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                    >
                                        {step.date}
                                    </Typography>
                                )
                            }
                        >
                            {step.label}
                        </StepLabel>
                    </Step>
                ))}
            </Stepper>
        </Paper>
    );
};

export default ApplicationStatusTimeline;
