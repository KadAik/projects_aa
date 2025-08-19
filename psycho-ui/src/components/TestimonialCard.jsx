import { Card, CardContent, Typography, Box } from "@mui/material";

export default function TestimonialCard({ imageUrl, title, description }) {
    return (
        <Card
            sx={{
                position: "relative",
                height: 300,
                color: "#fff",
                borderRadius: 1,
            }}
        >
            {/* Background Image */}
            <Box
                sx={{
                    position: "absolute",
                    height: 300,
                    inset: 0,
                    backgroundImage: `url(${imageUrl})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    filter: "brightness(60%)", // dim image
                }}
            />

            {/* Overlay */}
            <Box
                sx={{
                    position: "absolute",
                    inset: 0,
                    height: 300,
                    backgroundColor: "rgba(0,0,0,0.4)",
                    marginTop: 0,
                }}
            />

            {/* Text */}
            <CardContent
                sx={{
                    position: "relative",
                    height: 300,
                    zIndex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Typography variant="h5" fontWeight="bold">
                    {title}
                </Typography>
            </CardContent>
        </Card>
    );
}
