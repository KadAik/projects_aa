import { useFormContext } from "react-hook-form";
import {
    Grid,
    TextField,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    FormHelperText,
    Typography,
} from "@mui/material";

import InputAdornment from "@mui/material/InputAdornment";

const genderOptions = [
    { value: "M", label: "Masculin" },
    { value: "F", label: "Féminin" },
];

export default function PersonalHistoryContent() {
    const {
        register,
        watch,
        formState: { errors },
    } = useFormContext();

    const getError = (fieldName) => errors.personalHistory?.[fieldName];

    return (
        <>
            <Typography variant="body2" sx={{ mb: 2 }}>
                Required fields are followed by{" "}
                <span aria-label="required">*</span>
            </Typography>

            <Grid
                container
                spacing={2}
                gap={3}
                sx={{
                    border: "1px solid #ccc",
                    padding: 2,
                    borderRadius: 1,
                    width: "100%",
                }}
            >
                {/* First Name */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                        fullWidth
                        label="Prénom *"
                        error={!!getError("firstName")}
                        helperText={getError("firstName")?.message || ""}
                        {...register("personalHistory.firstName")}
                    />
                </Grid>

                {/* Last Name */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                        fullWidth
                        label="Nom *"
                        error={!!getError("lastName")}
                        helperText={getError("lastName")?.message || ""}
                        {...register("personalHistory.lastName")}
                    />
                </Grid>

                {/* Date of Birth */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                        fullWidth
                        type="date"
                        label="Date de naissance *"
                        slotProps={{ inputLabel: { shrink: true } }}
                        error={!!getError("dateOfBirth")}
                        helperText={getError("dateOfBirth")?.message || ""}
                        {...register("personalHistory.dateOfBirth")}
                    />
                </Grid>

                {/* Gender */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <FormControl fullWidth error={!!getError("gender")}>
                        <InputLabel id="gender">Genre *</InputLabel>
                        <Select
                            labelId="gender"
                            label="Genre *"
                            {...register("personalHistory.gender")}
                            value={watch("personalHistory.gender") || ""} // Because mui is not getting the default value from RHF
                        >
                            {genderOptions.map((option) => (
                                <MenuItem
                                    key={option.value}
                                    value={option.value}
                                >
                                    {option.label}
                                </MenuItem>
                            ))}
                        </Select>
                        <FormHelperText>
                            {getError("gender")?.message}
                        </FormHelperText>
                    </FormControl>
                </Grid>

                {/* Email */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                        fullWidth
                        type="email"
                        label="Email *"
                        error={!!getError("email")}
                        helperText={getError("email")?.message || ""}
                        {...register("personalHistory.email")}
                    />
                </Grid>

                {/* Phone */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                        fullWidth
                        type="tel"
                        label="Numéro de téléphone *"
                        placeholder="01 90 00 00 00"
                        error={!!getError("phone")}
                        helperText={getError("phone")?.message || ""}
                        {...register("personalHistory.phone")}
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        +229
                                    </InputAdornment>
                                ),
                            },
                        }}
                    />
                </Grid>
            </Grid>
        </>
    );
}
