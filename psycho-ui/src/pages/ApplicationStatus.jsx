import {
    Box,
    Paper,
    Typography,
    Stepper,
    Step,
    StepLabel,
    Chip,
    Stack,
    Skeleton,
} from "@mui/material";
import ApplicationStatusTimeline from "../components/ApplicationStatusTimeline";
import { useApplications } from "../assets/PsychoAPI/requests";
import { useEffect, useState } from "react";

const statusColorKey = {
    PENDING: "warning",
    INCOMPLETE: "warning",
    ACCEPTED: "success",
    REJECTED: "error",
};

const statusMap = {
    Pending: {
        label: "En cours de traitement",
        date: "05/01/2023",
        color: statusColorKey["PENDING"],
    },
    Incomplete: {
        label: "Incomplet",
        date: "10/01/2023",
        color: statusColorKey["INCOMPLETE"],
    },
    Accepted: {
        label: "Accepté",
        date: "",
        color: statusColorKey["ACCEPTED"],
    },
    Rejected: {
        label: "Rejeté",
        date: "",
        color: statusColorKey["REJECTED"],
    },
};

const ApplicationStatus = ({ isPending, data }) => {
    return isPending ?
            <Box>Chargement des données...</Box>
        :   <Box sx={{ maxWidth: 800, mx: "auto", p: { xs: 1, sm: 2 } }}>
                {/* Status Summary Card */}
                <Paper sx={{ p: { xs: 2, sm: 3 }, mb: 3, borderRadius: 2 }}>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: { xs: "column", sm: "row" },
                            justifyContent: "space-between",
                            alignItems: { xs: "flex-start", sm: "center" },
                            gap: 1,
                            mb: 2,
                        }}
                    >
                        <Typography variant="h6">
                            Statut de la candidature
                        </Typography>
                        {isPending ?
                            <Skeleton variant="text" />
                        :   <Chip
                                label={statusMap[data.status].label}
                                color={statusMap[data.status].color}
                            />
                        }
                    </Box>

                    <Stack
                        direction={{ xs: "column", sm: "row" }}
                        spacing={3}
                        sx={{ textAlign: { xs: "left", sm: "center" } }}
                    >
                        <Box>
                            <Typography variant="body2" color="text.secondary">
                                Identité du candidat
                            </Typography>
                            <Typography
                                fontWeight="medium"
                                color="primary.main"
                            >
                                {`${data.applicant.first_name} ${data.applicant.last_name}`}
                            </Typography>
                        </Box>
                        <Box>
                            <Typography variant="body2" color="text.secondary">
                                Référence de dossier
                            </Typography>
                            <Typography
                                fontWeight="medium"
                                color="primary.main"
                            >
                                {data.tracking_id}
                            </Typography>
                        </Box>
                        <Box>
                            <Typography variant="body2" color="text.secondary">
                                Dernière mise à jour
                            </Typography>
                            <Typography
                                fontWeight="medium"
                                color="primary.main"
                                textAlign={{ xs: "left", sm: "center" }}
                            >
                                {data.date_updated ?
                                    new Date(data.date_updated).toLocaleString()
                                :   "..."}
                            </Typography>
                        </Box>
                    </Stack>
                </Paper>

                {/* Status Timeline */}
                <ApplicationStatusTimeline
                    statusMap={statusMap}
                    dateUpdated={data.date_updated}
                    dateSubmitted={data.date_submitted}
                    status={data.status}
                />
            </Box>;
};

export default ApplicationStatus;
