import { useFormContext } from "react-hook-form";
import { Grid, TextField, Typography, Box } from "@mui/material";

export default function UniversityDegreeDetails({ degree }) {
    const {
        register,
        formState: { errors },
    } = useFormContext();

    const getError = (fieldName) => errors.university?.[fieldName];
    const hasError = (fieldName) => !!getError(fieldName);

    const degreeLabel =
        degree === "BACHELOR" ? "la Licence"
        : degree === "MASTER" ? "le Master"
        : "le Doctorat";

    return (
        <Box sx={{ width: "100%" }}>
            <Typography
                variant="h6"
                gutterBottom
                fontWeight="bold"
                sx={{
                    fontSize: "1.1rem",
                    borderBottom: "1px solid #ccc",
                    pb: 1,
                }}
            >
                Informations sur {degreeLabel}
            </Typography>
            <Grid
                container
                spacing={2}
                sx={{
                    mt: 3,
                    width: "100%",
                    border: "1px solid #ccc",
                    p: 2,
                    borderRadius: 1,
                }}
            >
                {/* Université */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                        fullWidth
                        label="Université"
                        variant="outlined"
                        error={hasError("name")}
                        helperText={getError("name")?.message || ""}
                        {...register("university.name")}
                    />
                </Grid>

                {/* Spécialisation */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                        fullWidth
                        label="Spécialisation"
                        variant="outlined"
                        error={hasError("fieldOfStudy")}
                        helperText={getError("fieldOfStudy")?.message || ""}
                        {...register("university.fieldOfStudy")}
                    />
                </Grid>

                {/* Moyenne */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                        fullWidth
                        label="Moyenne obtenue"
                        variant="outlined"
                        type="number"
                        error={hasError("average")}
                        helperText={getError("average")?.message || ""}
                        {...register("university.average")}
                    />
                </Grid>
            </Grid>
        </Box>
    );
}
