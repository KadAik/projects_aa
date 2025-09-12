import { useNavigate } from "react-router-dom";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { Box, Typography, Paper, Button, Stack, Divider } from "@mui/material";

export default function ApplicationConfirmationPage({ email, trackingNumber }) {
    const navigate = useNavigate();

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "60vh",
                p: 2,
                backgroundColor: "#f8f9fa", // Light grey background
            }}
        >
            <Paper
                elevation={3}
                sx={{
                    p: { xs: 2, md: 4 },
                    maxWidth: 500,
                    width: "100%",
                    textAlign: "center",
                    borderRadius: 2,
                }}
            >
                {/* Success Icon */}
                <CheckCircleOutlineIcon
                    sx={{
                        fontSize: 60,
                        mb: 2,
                        color: "#4caf50", // Green color
                    }}
                />

                {/* Main Title */}
                <Typography
                    variant="h5"
                    component="h1"
                    gutterBottom
                    sx={{
                        fontWeight: 700,
                        color: "#333",
                    }}
                >
                    Candidature Enregistrée
                </Typography>

                {/* Success Message */}
                <Typography variant="body1" sx={{ color: "#666" }}>
                    Votre candidature a été soumise avec succès.
                </Typography>

                {/* Confirmation Box */}
                <Box
                    sx={{
                        backgroundColor: "#e8f5e9", // Light green
                        p: 2,
                        borderRadius: 1,
                        mb: 3,
                        borderLeft: "4px solid #4caf50", // Green accent
                    }}
                >
                    <Typography variant="body1" paragraph>
                        Un email a été envoyé à{" "}
                        <span style={{ fontWeight: 600 }}>{email}</span>
                    </Typography>

                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        Numéro de dossier :
                    </Typography>
                    <Typography
                        variant="h6"
                        sx={{
                            color: "#1976d2", // Blue color
                            fontWeight: 700,
                            mt: 1,
                        }}
                    >
                        {trackingNumber}
                    </Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Action Buttons */}
                <Stack spacing={2}>
                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                        <Button
                            variant="contained"
                            onClick={() => navigate("/applications/track")}
                            fullWidth
                            sx={{
                                py: 1.5,
                                backgroundColor: "#1976d2", // Blue
                                "&:hover": { backgroundColor: "#1565c0" },
                            }}
                        >
                            Suivre ma candidature
                        </Button>

                        <Button
                            variant="outlined"
                            onClick={() => navigate("/submitted-data")}
                            fullWidth
                            sx={{
                                py: 1.5,
                                borderColor: "#1976d2",
                                color: "#1976d2",
                                "&:hover": { borderColor: "#1565c0" },
                            }}
                        >
                            Voir les détails
                        </Button>
                    </Stack>

                    <Button
                        variant="text"
                        onClick={() => navigate("/")}
                        sx={{
                            mt: 1,
                            color: "#666",
                            "&:hover": {
                                backgroundColor: "transparent",
                                color: "#333",
                            },
                        }}
                    >
                        ← Retour à l'accueil
                    </Button>
                </Stack>
            </Paper>
        </Box>
    );
}
