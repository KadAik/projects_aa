import Card from "../Card.jsx";
import TestimonialSlider from "../TestimonialSlider.jsx";

import { Box, Typography } from "@mui/material";
import { green } from "@mui/material/colors";

export default function Infos() {
    return (
        <>
            <Box
                sx={{
                    textAlign: "center",
                    py: 3,
                    px: 2,
                    borderRadius: 1,
                    boxShadow: `0 0 10px 0 rgba(0, 0, 0, 0.1)`,
                    mb: 3,
                }}
            >
                <Typography
                    variant="h2"
                    sx={{
                        fontWeight: "bold",
                        color: "#004747",
                        fontSize: "1.5rem",
                        mt: 0.5,
                        mb: 2,
                    }}
                >
                    Pourquoi devenir aviateur ?
                </Typography>

                <TestimonialSlider />
            </Box>

            <Box>
                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: "bold",
                        fontSize: "1.5rem",
                        color: "#004747",
                        mb: 2,
                        px: 2,
                    }}
                >
                    Préparez-vous pour l’avenir
                </Typography>
                <Typography
                    variant="body1"
                    sx={{ textAlign: "justify", px: 2 }}
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
                <p>Places limitées – inscrivez-vous dès maintenant !</p>
            </Card>
        </>
    );
}
