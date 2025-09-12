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
    InputAdornment,
} from "@mui/material";
import PortraitIcon from "@mui/icons-material/Portrait";

const genderOptions = [
    { value: "M", label: "Masculin" },
    { value: "F", label: "Féminin" },
];

export default function PersonalHistoryContent({ displayNotice = true }) {
    const {
        register,
        watch,
        formState: { errors },
    } = useFormContext();

    const getError = (fieldName) => errors.personalHistory?.[fieldName];

    return (
        <>
            {displayNotice && (
                <Typography variant="body2" sx={{ mb: 2 }}>
                    Required fields are followed by{" "}
                    <span aria-label="required">*</span>
                </Typography>
            )}
            <Typography
                variant="h6"
                gutterBottom
                fontWeight="bold"
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    fontSize: "1.2rem",
                    borderBottom: "1px solid #ccc",
                    pb: 1,
                    mb: 3,
                }}
            >
                <PortraitIcon color="primary" />
                Informations personnelles
            </Typography>

            <Grid
                container
                spacing={{ xs: 2, sm: 3 }}
                sx={{
                    border: "1px solid #ccc",
                    p: 2,
                    borderRadius: 1,
                    width: "100%",
                }}
            >
                {/* First Name */}
                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 4, xl: 4 }}>
                    <TextField
                        fullWidth
                        label="Prénom *"
                        error={!!getError("firstName")}
                        helperText={getError("firstName")?.message || ""}
                        {...register("personalHistory.firstName")}
                    />
                </Grid>

                {/* Last Name */}
                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 4, xl: 4 }}>
                    <TextField
                        fullWidth
                        label="Nom *"
                        error={!!getError("lastName")}
                        helperText={getError("lastName")?.message || ""}
                        {...register("personalHistory.lastName")}
                    />
                </Grid>

                {/* Date of Birth */}
                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 4, xl: 4 }}>
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
                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 4, xl: 4 }}>
                    <FormControl fullWidth error={!!getError("gender")}>
                        <InputLabel id="gender">Genre *</InputLabel>
                        <Select
                            labelId="gender"
                            label="Genre *"
                            {...register("personalHistory.gender")}
                            value={watch("personalHistory.gender") || ""}
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
                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 4, xl: 4 }}>
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
                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 4, xl: 4 }}>
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
