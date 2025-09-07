import { Box, Stack, Link, Typography } from "@mui/material";
import { green } from "@mui/material/colors";

export default function Footer() {
    return (
        <Box
            component="footer"
            sx={{
                py: 3,
                px: 2,
                backgroundColor: green[100],
                textAlign: "center",
            }}
        >
            <Stack
                direction="row"
                spacing={3}
                justifyContent="center"
                sx={{ mb: 1 }}
            >
                <Link href="#" color="inherit" underline="hover">
                    Mentions légales
                </Link>
                <Link href="#" color="inherit" underline="hover">
                    L'armée de l'air
                </Link>
                <Link href="#" color="inherit" underline="hover">
                    Contact
                </Link>
            </Stack>
            <Typography variant="body2" color="text.secondary">
                &copy; 2025 Forces Aériennes Béninoises. Tous droits réservés.
            </Typography>
        </Box>
    );
}
