import { useFormContext } from "react-hook-form";
import {
    Box,
    FormControl,
    FormHelperText,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
} from "@mui/material";

export default function HighSchoolDetails() {
    const {
        register,
        watch,
        formState: { errors },
    } = useFormContext();

    const getError = (field) => errors.highSchool?.[field]?.message;

    return (
        <Box
            sx={{
                mt: 3,
                width: "100%",
                border: "1px solid #ccc",
                p: 2,
                borderRadius: 1,
            }}
        >
            <Grid container spacing={2} sx={{ width: "100%" }}>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Typography
                        variant="h6"
                        gutterBottom
                        sx={{
                            fontSize: "1.2rem",
                            borderBottom: "1px solid #ccc",
                            pb: 1,
                        }}
                    >
                        Informations sur le baccalauréat
                    </Typography>
                </Grid>

                {/* Série du Baccalauréat */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                        select
                        fullWidth
                        label="Série du Baccalauréat *"
                        error={!!getError("baccalaureateSeries")}
                        helperText={getError("baccalaureateSeries")}
                        {...register("highSchool.baccalaureateSeries")}
                        sx={{ mb: 2 }}
                        value={watch("highSchool.baccalaureateSeries") || ""}
                    >
                        <MenuItem value="C">BAC C</MenuItem>
                        <MenuItem value="D">BAC D</MenuItem>
                        <MenuItem value="E">BAC E</MenuItem>
                        <MenuItem value="F">BAC F</MenuItem>
                    </TextField>
                </Grid>

                {/* Session de baccalauréat */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                        type="date"
                        fullWidth
                        label="Session de baccalauréat *"
                        error={!!getError("baccalaureateSession")}
                        helperText={getError("baccalaureateSession")}
                        sx={{ mb: 2 }}
                        {...register("highSchool.baccalaureateSession")}
                        slotProps={{ inputLabel: { shrink: true } }}
                    />
                </Grid>

                {/* Moyenne obtenue */}

                <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                        type="number"
                        fullWidth
                        label="Moyenne obtenue *"
                        error={!!getError("baccalaureateAverage")}
                        helperText={getError("baccalaureateAverage")}
                        {...register("highSchool.baccalaureateAverage")}
                    />
                </Grid>
            </Grid>
        </Box>
    );
}
