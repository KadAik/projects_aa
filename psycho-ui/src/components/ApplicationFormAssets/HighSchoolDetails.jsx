import React from "react";
import { useFormContext } from "react-hook-form";
import {
    Box,
    FormControl,
    FormHelperText,
    Grid,
    InputLabel,
    MenuItem,
    Paper,
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
        <>
            <Typography
                variant="h6"
                gutterBottom
                fontWeight="bold"
                sx={{
                    fontSize: "1.1rem",
                    borderBottom: "1px solid #ccc",
                    pb: 1,
                    mb: 3,
                }}
            >
                Informations sur le baccalauréat
            </Typography>
            <Grid
                container
                spacing={{ xs: 2, sm: 3 }}
                sx={{
                    width: "100%",
                    border: "1px solid #ccc",
                    p: 2,
                    borderRadius: 1,
                }}
            >
                {/* Série du Baccalauréat */}
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
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
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
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

                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
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
        </>
    );
}
