import { Box, Typography, Button, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { blue } from "@mui/material/colors";

export default function Hero({ title, subtitle }) {
    const navigate = useNavigate();

    return (
        <Box
            component="section"
            sx={{
                textAlign: "center",
                py: 4,
                px: 2,
                //backgroundColor: "rgba(227, 242, 253, 0.5)", // light blue tint
                boxShadow: `0 4px 20px 0 ${blue[100]}`,
                mb: 3,
            }}
        >
            <Typography
                variant="h5"
                sx={{ fontWeight: "bold", color: blue[800], mb: 2 }}
            >
                {title}
            </Typography>
            <Typography
                variant="h2"
                sx={{ color: blue[700], mb: 3, fontSize: "1rem" }}
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
                        backgroundColor: blue[600],
                        "&:hover": { backgroundColor: blue[700] },
                    }}
                    onClick={() => navigate("/applications/apply")}
                >
                    S’inscrire maintenant
                </Button>

                <Typography variant="body1" sx={{ color: blue[800] }}>
                    ou
                </Typography>

                <Button
                    variant="outlined"
                    sx={{
                        color: blue[700],
                        borderColor: blue[700],
                        "&:hover": {
                            borderColor: blue[800],
                            backgroundColor: blue[50],
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
