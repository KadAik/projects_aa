import {
    Box,
    Paper,
    Typography,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Divider,
} from "@mui/material";
import { Person, ExpandMore } from "@mui/icons-material";

import { useLocation } from "react-router-dom";

import ApplicationMetaData from "./ApplicationMetaData";
import ApplicantMetadata from "./ApplicantMetadata";
import { mapApplicationToFormData } from "../../shared/psychoApi/utils";

export default function ApplicationDetails() {
    const location = useLocation();
    const application = location.state?.applicationData || {};
    const applicant = mapApplicationToFormData(application?.applicant || {});

    return (
        <Box sx={{ maxWidth: 800, mx: "auto" }}>
            {/* Application Meta data */}
            <ApplicationMetaData application={application} />
            {/* Applicant Details */}
            <Paper elevation={2} sx={{ p: 2, mt: 2 }}>
                <Typography
                    variant="h6"
                    fontWeight="bold"
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 2,
                    }}
                >
                    <Person color="primary" />
                    Informations sur le candidat
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <ApplicantMetadata applicant={applicant} />
            </Paper>
        </Box>
    );
}
