import Paper from "@mui/material/Paper";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Typography from "@mui/material/Typography";

import PostAddIcon from "@mui/icons-material/PostAdd";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningIcon from "@mui/icons-material/Warning";

const formatDate = (date) => (date ? new Date(date).toLocaleString() : null);

const StepContent = ({ label, date, color }) => (
    <>
        <Typography
            variant="body2"
            fontWeight="medium"
            color={color || "inherit"}
        >
            {label}
        </Typography>
        {date && (
            <Typography variant="caption" color="text.secondary">
                {formatDate(date)}
            </Typography>
        )}
    </>
);

const ApplicationStatusTimeline = ({
    status = "PENDING",
    dateSubmitted,
    dateUpdated,
    statusMap,
}) => {
    const steps = [
        {
            icon: PostAddIcon,
            label: "Reçu le :",
            date: dateSubmitted,
            color: "success",
        },
        {
            icon: status === "Pending" ? AutorenewIcon : CheckCircleIcon,
            label: status === "Pending" ? "En cours de traitement" : "Traité",
            date: dateUpdated,
            color: status === "Pending" ? "warning" : "success",
        },
    ];

    if (status !== "Pending") {
        steps.push({
            icon: status === "Accepted" ? CheckCircleIcon : WarningIcon,
            label: statusMap[status].label,
            color: statusMap[status].color,
        });
    }

    return (
        <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                Historique du traitement
            </Typography>

            <Stepper
                activeStep={status === "Pending" ? 2 : 3}
                orientation="vertical"
                sx={{
                    [`& .MuiStepConnector-vertical>.MuiStepConnector-line`]: {
                        borderColor: "green",
                    },
                }}
            >
                {steps.map((step, index, table) => (
                    <Step
                        key={index}
                        completed={
                            table.length > 2 || index == 0 ? "true" : "false"
                        } // we have at most 3 steps and the first one is automatically completed
                        active={index === table.length - 1 ? "false" : "true"}
                        error={undefined}
                    >
                        <StepLabel
                            slots={{ stepIcon: step.icon }}
                            slotProps={{ stepIcon: { color: step.color } }}
                        >
                            <StepContent
                                label={step.label}
                                date={step.date}
                                color={step.color}
                            />
                        </StepLabel>
                    </Step>
                ))}
            </Stepper>
        </Paper>
    );
};

export default ApplicationStatusTimeline;
