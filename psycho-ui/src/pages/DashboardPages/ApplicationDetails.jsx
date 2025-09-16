import {
    Box,
    Paper,
    Typography,
    Accordion,
    AccordionSummary,
    AccordionDetails,
} from "@mui/material";
import { Person, ExpandMore } from "@mui/icons-material";

import { useLocation } from "react-router-dom";

import ApplicationMetaData from "./ApplicationMetaData";
import ApplicantMetadata from "./ApplicantMetadata";
import { mapApplicationToFormData } from "../../shared/psychoApi/utils";

export default function ApplicationDetails() {
    const location = useLocation();
    const application = location.state?.applicationData || {};
    console.log("Application data from location state: ", application);
    const applicant = mapApplicationToFormData(application?.applicant || {});
    console.log("Mapped applicant data: ", applicant);

    return (
        <Box sx={{ maxWidth: 800, mx: "auto" }}>
            {/* Application Meta data */}
            <ApplicationMetaData application={application} />
            {/* Applicant Details Accordion */}
            <Paper elevation={2} sx={{ p: 0 }}>
                <Accordion defaultExpanded>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                        <Typography
                            variant="h6"
                            fontWeight="bold"
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                            }}
                        >
                            <Person color="primary" />
                            Informations du candidat
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <ApplicantMetadata applicant={applicant} />
                    </AccordionDetails>
                </Accordion>
            </Paper>
        </Box>
    );
}
