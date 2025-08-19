import {
    Box,
    Paper,
    Typography,
    Stepper,
    Step,
    StepLabel,
    Chip,
    Stack,
} from "@mui/material";
import ApplicationStatusTimeline from "../components/ApplicationStatusTimeline";

const statusSteps = [
    { label: "Reçu", date: "01/01/2023", completed: true },
    { label: "En cours de traitement", date: "", completed: true },
    { label: "Accepté", date: "01/02/2023", completed: false },
];

const ApplicationStatus = () => {
    const activeStep = statusSteps.findIndex((step) => !step.completed) - 1;
    const currentStatus = statusSteps[activeStep + 1]?.label || "Complété";

    return (
        <Box sx={{ maxWidth: 800, mx: "auto", p: 2 }}>
            {/* Status Summary Card */}
            <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 2,
                    }}
                >
                    <Typography variant="h6">
                        Statut de la candidature
                    </Typography>
                    <Chip
                        label={currentStatus}
                        color={
                            currentStatus === "Accepté"
                                ? "success"
                                : currentStatus === "En cours de traitement"
                                ? "warning"
                                : "info"
                        }
                    />
                </Box>

                <Stack direction="row" spacing={3}>
                    <Box>
                        <Typography variant="body2" color="text.secondary">
                            Identité Candidat
                        </Typography>
                        <Typography fontWeight="medium" color="primary.main">
                            John Doe
                        </Typography>
                    </Box>
                    <Box>
                        <Typography variant="body2" color="text.secondary">
                            Référence de dossier
                        </Typography>
                        <Typography fontWeight="medium" color="primary.main">
                            123456789
                        </Typography>
                    </Box>
                    <Box>
                        <Typography variant="body2" color="text.secondary">
                            Dernière mise à jour
                        </Typography>
                        <Typography fontWeight="medium" color="primary.main">
                            15/01/2023
                        </Typography>
                    </Box>
                </Stack>
            </Paper>

            {/* Status Timeline */}
            <ApplicationStatusTimeline />
        </Box>
    );
};

export default ApplicationStatus;
