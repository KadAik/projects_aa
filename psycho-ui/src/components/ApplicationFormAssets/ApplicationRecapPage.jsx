import { useFormContext } from "react-hook-form";
import { Box, Typography, List, ListItem, Paper, Divider } from "@mui/material";

const degreeLabels = {
    HIGHSCHOOL: "le Baccalauréat",
    BACHELOR: "la Licence",
    MASTER: "le Master",
    PHD: "le Doctorat",
};

export default function ApplicationRecapPage() {
    const { getValues } = useFormContext();
    const { degree, personalHistory, highSchool, university } = getValues();

    return (
        <Box sx={{ maxWidth: 800, mx: "auto", p: 2 }}>
            {/* Personal Information Section */}
            <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Informations personnelles
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <List>
                    <ListItem sx={{ px: 0 }}>
                        <Typography
                            sx={{
                                borderLeft: "3px solid #1976d2",
                                pl: 1,
                                borderRadius: 1,
                            }}
                        >
                            <strong>Prénom:</strong> {personalHistory.firstName}
                        </Typography>
                    </ListItem>
                    <ListItem sx={{ px: 0 }}>
                        <Typography
                            sx={{
                                borderLeft: "3px solid #1976d2",
                                pl: 1,
                                borderRadius: 1,
                            }}
                        >
                            <strong>Nom:</strong> {personalHistory.lastName}
                        </Typography>
                    </ListItem>
                    <ListItem sx={{ px: 0 }}>
                        <Typography
                            sx={{
                                borderLeft: "3px solid #1976d2",
                                pl: 1,
                                borderRadius: 1,
                            }}
                        >
                            <strong>Date de naissance:</strong>{" "}
                            {personalHistory.dateOfBirth}
                        </Typography>
                    </ListItem>
                    <ListItem sx={{ px: 0 }}>
                        <Typography
                            sx={{
                                borderLeft: "3px solid #1976d2",
                                pl: 1,
                                borderRadius: 1,
                            }}
                        >
                            <strong>Sexe:</strong>{" "}
                            {personalHistory.gender === "M"
                                ? "Masculin"
                                : "Féminin"}
                        </Typography>
                    </ListItem>
                    <ListItem sx={{ px: 0 }}>
                        <Typography
                            sx={{
                                borderLeft: "3px solid #1976d2",
                                pl: 1,
                                borderRadius: 1,
                            }}
                        >
                            <strong>Email:</strong> {personalHistory.email}
                        </Typography>
                    </ListItem>
                    <ListItem sx={{ px: 0 }}>
                        <Typography
                            sx={{
                                borderLeft: "3px solid #1976d2",
                                pl: 1,
                                borderRadius: 1,
                            }}
                        >
                            <strong>Téléphone:</strong> {personalHistory.phone}
                        </Typography>
                    </ListItem>
                </List>
            </Paper>

            {/* Academic Information Section */}
            <Paper elevation={2} sx={{ p: 2 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Parcours académique
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <List>
                    <ListItem sx={{ px: 0 }}>
                        <Typography
                            sx={{
                                borderLeft: "3px solid #1976d2",
                                pl: 1,
                                borderRadius: 1,
                            }}
                        >
                            <strong>Niveau académique:</strong>{" "}
                            {degreeLabels[degree]?.slice(2)}
                        </Typography>
                    </ListItem>

                    {["BACHELOR", "MASTER", "PHD"].includes(degree) && (
                        <>
                            <Typography variant="subtitle1" mt={2} mb={1}>
                                Informations sur {degreeLabels[degree]}
                            </Typography>
                            <ListItem sx={{ px: 0 }}>
                                <Typography
                                    sx={{
                                        borderLeft: "3px solid #1976d2",
                                        pl: 1,
                                        borderRadius: 1,
                                    }}
                                >
                                    <strong>Université:</strong>{" "}
                                    {university.name}
                                </Typography>
                            </ListItem>
                            <ListItem sx={{ px: 0 }}>
                                <Typography
                                    sx={{
                                        borderLeft: "3px solid #1976d2",
                                        pl: 1,
                                        borderRadius: 1,
                                    }}
                                >
                                    <strong>Domaine d'études:</strong>{" "}
                                    {university.fieldOfStudy}
                                </Typography>
                            </ListItem>
                            <ListItem sx={{ px: 0 }}>
                                <Typography
                                    sx={{
                                        borderLeft: "3px solid #1976d2",
                                        pl: 1,
                                        borderRadius: 1,
                                    }}
                                >
                                    <strong>Moyenne obtenue:</strong>{" "}
                                    {university.average}
                                </Typography>
                            </ListItem>
                        </>
                    )}

                    <Typography variant="subtitle1" mt={2} mb={1}>
                        Informations sur le baccalauréat
                    </Typography>
                    <ListItem sx={{ px: 0 }}>
                        <Typography
                            sx={{
                                borderLeft: "3px solid #1976d2",
                                pl: 1,
                                borderRadius: 1,
                            }}
                        >
                            <strong>Série du Bac:</strong>{" "}
                            {highSchool.baccalaureateSerie}
                        </Typography>
                    </ListItem>
                    <ListItem sx={{ px: 0 }}>
                        <Typography
                            sx={{
                                borderLeft: "3px solid #1976d2",
                                pl: 1,
                                borderRadius: 1,
                            }}
                        >
                            <strong>Session:</strong>{" "}
                            {highSchool.baccalaureateSession}
                        </Typography>
                    </ListItem>
                    <ListItem sx={{ px: 0 }}>
                        <Typography
                            sx={{
                                borderLeft: "3px solid #1976d2",
                                pl: 1,
                                borderRadius: 1,
                            }}
                        >
                            <strong>Moyenne:</strong>{" "}
                            {highSchool.baccalaureateAverage}
                        </Typography>
                    </ListItem>
                </List>
            </Paper>
        </Box>
    );
}
