import { useFormContext } from "react-hook-form";
import {
    Grid,
    Typography,
    FormControl,
    InputLabel,
    Select,
    TextField,
    MenuItem,
    FormHelperText,
} from "@mui/material";
import HighSchoolDetails from "./HighSchoolDetails";
import UniversityDegreeDetails from "./UniversityDegreeDetails";

const degreeOptions = [
    { value: "HIGHSCHOOL", label: "Bac" },
    { value: "BACHELOR", label: "Licence" },
    { value: "MASTER", label: "Master" },
    { value: "PHD", label: "Doctorat" },
];

export default function EducationalBackgroundContent() {
    const {
        register,
        watch,
        formState: { errors },
    } = useFormContext();

    const degree = watch("degree") || "";

    return (
        <>
            <Typography variant="body2" sx={{ mb: 2 }}>
                Required fields are followed by{" "}
                <span aria-label="required">*</span>
            </Typography>

            <Grid
                container
                spacing={2}
                sx={{
                    border: "1px solid #ccc",
                    padding: 2,
                    borderRadius: 1,
                    width: "100%",
                }}
            >
                {/* Academic Level (degree) */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                        fullWidth
                        select
                        label="Niveau académique *"
                        {...register("degree")}
                        error={!!errors.degree}
                        helperText={errors.degree?.message}
                        value={degree} // Because mui is not getting the default value from RHF
                    >
                        {degreeOptions.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>
            </Grid>

            {/* High School Section */}
            <HighSchoolDetails />

            {/* University Degrees */}
            {(degree === "BACHELOR" ||
                degree === "MASTER" ||
                degree === "PHD") && (
                <UniversityDegreeDetails degree={degree} />
            )}
        </>
    );
}
