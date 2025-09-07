import Card from "../Card.jsx";
import TestimonialSlider from "../TestimonialSlider.jsx";
import { Box, Typography } from "@mui/material";

export default function Infos() {
    return (
        <>
            <Box
                sx={{
                    textAlign: "center",
                    py: 3,
                    px: 2,
                    borderRadius: 2,
                    background: "linear-gradient(135deg, #e3f2fd, #bbdefb)",
                    boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
                    mb: 4,
                }}
            >
                <Typography
                    variant="h2"
                    sx={{
                        fontWeight: "bold",
                        color: "#0d47a1", // deep blue
                        fontSize: "1.8rem",
                        mt: 0.5,
                        mb: 2,
                    }}
                >
                    Pourquoi devenir aviateur ?
                </Typography>

                <TestimonialSlider />
            </Box>

            <Box sx={{ mb: 4 }}>
                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: "bold",
                        fontSize: "1.5rem",
                        color: "#1565c0", // mid blue
                        mb: 2,
                        px: 2,
                    }}
                >
                    Préparez-vous pour l’avenir
                </Typography>
                <Typography
                    variant="body1"
                    sx={{ textAlign: "justify", px: 2, color: "#1e3a8a" }}
                >
                    Les tests psychotechniques sont des évaluations
                    standardisées qui mesurent vos capacités cognitives et
                    comportementales et votre aptitude à réagir promptement dans
                    des situations stressantes. Ils sont essentiels et sont
                    utilisés pour sélectionner les candidats les plus adaptés
                    aux rôles dans l’Armée de l’air. Ils constituent la première
                    étape vers une carrière dans l’Armée de l’air. Préparez-vous
                    à relever le défi pour une aventure palpitante !
                </Typography>
            </Box>

            <Card title="Ils l’ont fait !">
                <blockquote>
                    “Le test m’a mis au défi, mais il m’a aussi révélé à
                    moi-même.” – Julien, pilote
                </blockquote>
                <blockquote>
                    “Une expérience intense et valorisante.” – Aïcha,
                    technicienne aéronautique
                </blockquote>
            </Card>

            <Card title="🗓 Prochaine session : 20 septembre 2025">
                <p style={{ color: "#0d47a1", fontWeight: 600 }}>
                    Places limitées – inscrivez-vous dès maintenant !
                </p>
            </Card>
        </>
    );
}
