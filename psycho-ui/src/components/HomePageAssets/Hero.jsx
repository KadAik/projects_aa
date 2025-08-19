import { Box, Typography, Button, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { green } from "@mui/material/colors";

export default function Hero({ title, subtitle }) {
    const navigate = useNavigate();

    return (
        <Box
            component="section"
            sx={{
                textAlign: "center",
                py: 4,
                px: 2,
                backgroundColor: "rgba(232, 245, 233, 0.5)",
                boxShadow: `0 4px 20px 0 ${green[100]}`,
                mb: 3,
            }}
        >
            <Typography
                variant="h5"
                sx={{ fontWeight: "bold", color: green[800], mb: 2 }}
            >
                {title}
            </Typography>
            <Typography
                variant="h2"
                sx={{ color: green[700], mb: 3, fontSize: "1rem" }}
            >
                {subtitle}
            </Typography>

            <Stack
                direction="row"
                spacing={2}
                justifyContent="center"
                alignItems="center"
            >
                <Button
                    variant="contained"
                    sx={{
                        backgroundColor: green[600],

                        "&:hover": { backgroundColor: green[700] },
                    }}
                    onClick={() => navigate("/applications/apply")}
                >
                    S’inscrire maintenant
                </Button>

                <Typography variant="body1" sx={{ color: green[800] }}>
                    ou
                </Typography>

                <Button
                    variant="outlined"
                    sx={{
                        color: green[700],
                        borderColor: green[700],
                        "&:hover": {
                            borderColor: green[800],
                            backgroundColor: green[50],
                        },
                    }}
                    onClick={() => navigate("/applications/track")}
                >
                    Suivre ma candidature
                </Button>
            </Stack>
        </Box>
    );
}
