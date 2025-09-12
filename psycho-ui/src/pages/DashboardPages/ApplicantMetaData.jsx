import { Typography, Divider, Grid } from "@mui/material";
import { School, ContactMail } from "@mui/icons-material";
import { degrees, genders } from "../../shared/psychoApi/applicantConfig";

export default function ApplicantMetadata({ applicant }) {
    const {
        personalHistory = {},
        highSchool = {},
        university = {},
        degree,
    } = applicant;
    return (
        <Grid container spacing={2}>
            {/* Personal Information */}
            <Grid size={12}>
                <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    gutterBottom
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                    }}
                >
                    <ContactMail fontSize="small" />
                    Informations personnelles
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <Grid container spacing={2}>
                    <Grid>
                        <Typography variant="subtitle2" color="text.secondary">
                            Prénoms:
                        </Typography>
                        <Typography variant="body1">
                            {personalHistory?.firstName || "Non spécifié"}
                        </Typography>
                    </Grid>

                    <Grid>
                        <Typography variant="subtitle2" color="text.secondary">
                            Nom:
                        </Typography>
                        <Typography variant="body1">
                            {personalHistory.lastName || "Non spécifié"}
                        </Typography>
                    </Grid>

                    <Grid>
                        <Typography variant="subtitle2" color="text.secondary">
                            Date de naissance:
                        </Typography>
                        <Typography variant="body1">
                            {personalHistory.dateOfBirth || "Non spécifié"}
                        </Typography>
                    </Grid>

                    <Grid>
                        <Typography variant="subtitle2" color="text.secondary">
                            Sexe:
                        </Typography>
                        <Typography variant="body1">
                            {genders[personalHistory.gender]?.label ||
                                "Non spécifié"}
                        </Typography>
                    </Grid>

                    <Grid>
                        <Typography variant="subtitle2" color="text.secondary">
                            Email:
                        </Typography>
                        <Typography variant="body1">
                            {personalHistory.email || "Non spécifié"}
                        </Typography>
                    </Grid>

                    <Grid>
                        <Typography variant="subtitle2" color="text.secondary">
                            Téléphone:
                        </Typography>
                        <Typography variant="body1">
                            {personalHistory.phone || "Non spécifié"}
                        </Typography>
                    </Grid>
                </Grid>
            </Grid>

            {/* Academic Information */}
            <Grid size={12}>
                <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    gutterBottom
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                    }}
                >
                    <School fontSize="small" />
                    Parcours académique
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <Grid container spacing={2}>
                    <Grid
                        size={12}
                        sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}
                    >
                        <Typography variant="subtitle2" color="text.secondary">
                            Niveau académique:
                        </Typography>
                        <Typography variant="body1">
                            {degrees[degree]?.label || "Non spécifié"}
                        </Typography>
                    </Grid>

                    {/* High School Information */}

                    <Grid>
                        <Typography
                            variant="subtitle2"
                            color="text.secondary"
                            fontWeight="bold"
                        >
                            Baccalauréat:
                        </Typography>
                    </Grid>

                    <Grid>
                        <Typography variant="subtitle2" color="text.secondary">
                            Série:
                        </Typography>
                        <Typography variant="body1">
                            {highSchool.baccalaureateSeries || "Non spécifié"}
                        </Typography>
                    </Grid>

                    <Grid>
                        <Typography variant="subtitle2" color="text.secondary">
                            Session:
                        </Typography>
                        <Typography variant="body1">
                            {highSchool.baccalaureateSession || "Non spécifié"}
                        </Typography>
                    </Grid>

                    <Grid>
                        <Typography variant="subtitle2" color="text.secondary">
                            Moyenne:
                        </Typography>
                        <Typography variant="body1">
                            {highSchool.baccalaureateAverage || "Non spécifié"}
                        </Typography>
                    </Grid>

                    {/* University Information */}
                    {university && university.name && (
                        <>
                            <Grid size={12}>
                                <Typography
                                    variant="subtitle2"
                                    color="text.secondary"
                                    fontWeight="bold"
                                >
                                    {degrees[degree]?.label}:
                                </Typography>
                            </Grid>

                            <Grid size={{ xs: 6, sm: 3, md: 1 }}>
                                <Typography
                                    variant="subtitle2"
                                    color="text.secondary"
                                >
                                    Université:
                                </Typography>
                                <Typography variant="body1">
                                    {university.name}
                                </Typography>
                            </Grid>

                            <Grid size={{ xs: 6, sm: 3, md: 1 }}>
                                <Typography
                                    variant="subtitle2"
                                    color="text.secondary"
                                >
                                    Domaine d'études:
                                </Typography>
                                <Typography variant="body1">
                                    {university.fieldOfStudy || "Non spécifié"}
                                </Typography>
                            </Grid>

                            <Grid size={{ xs: 6, sm: 3, md: 1 }}>
                                <Typography
                                    variant="subtitle2"
                                    color="text.secondary"
                                >
                                    Moyenne:
                                </Typography>
                                <Typography variant="body1">
                                    {university.average || "Non spécifié"}
                                </Typography>
                            </Grid>
                        </>
                    )}
                </Grid>
            </Grid>
        </Grid>
    );
}
