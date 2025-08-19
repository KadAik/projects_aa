import {
    Stack,
    MenuItem,
    Typography,
    TextField,
    Paper,
    IconButton,
    Divider,
} from "@mui/material";

import InputBase from "@mui/material/InputBase";

import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

const status = [
    { value: "Pending", label: "Pending" },
    { value: "Incomplete", label: "Incomplete" },
    { value: "Accepted", label: "Accepted" },
    { value: "Rejected", label: "Rejected" },
];

const degreeOptions = [
    { value: "HIGHSCHOOL", label: "Bac" },
    { value: "BACHELOR", label: "Licence" },
    { value: "MASTER", label: "Master" },
    { value: "PHD", label: "Doctorat" },
];

const baccalaureateSeries = [
    { value: "C", label: "Bac C" },
    { value: "D", label: "Bac D" },
    { value: "E", label: "Bac E" },
    { value: "F", label: "Bac F" },
];

const TopToolBar = ({ register, watch }) => {
    return (
        <Paper
            elevation={0}
            sx={{
                width: "100%",
                p: 0.5,
                mb: 2,
                border: "1px solid #e0e0e0",
            }}
        >
            <Stack
                direction="row"
                spacing={1}
                sx={{
                    width: "100%",
                    height: "100px",
                }}
                overflow="hidden"
            >
                <Stack
                    direction="row"
                    spacing={1}
                    component="form"
                    id="filter-form"
                >
                    <Stack direction="column" spacing={1} p={2} minWidth={180}>
                        <Typography variant="h6" sx={{ fontSize: "0.75rem" }}>
                            Status
                        </Typography>
                        <TextField
                            select
                            label="Filtrer par statut"
                            size="small"
                            slotProps={{
                                inputLabel: {
                                    sx: { fontSize: "0.75rem" },
                                },
                            }}
                            {...register("status")}
                            value={watch("status") || ""} // Ensure the value is controlled
                        >
                            {status.map((option) => (
                                <MenuItem
                                    key={option.value}
                                    value={option.value}
                                >
                                    {option.label}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Stack>
                    <Stack direction="column" spacing={1} p={2} minWidth={160}>
                        <Typography variant="h6" sx={{ fontSize: "0.75rem" }}>
                            Niveau académique
                        </Typography>
                        <TextField
                            select
                            label="All"
                            size="small"
                            slotProps={{
                                inputLabel: {
                                    sx: { fontSize: "0.75rem" },
                                },
                            }}
                            {...register("degree")}
                            value={watch("degree") || ""} // Ensure the value is controlled
                        >
                            {degreeOptions.map((option) => (
                                <MenuItem
                                    key={option.value}
                                    value={option.value}
                                >
                                    {option.label}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Stack>

                    <Stack direction="column" spacing={1} p={2} minWidth={124}>
                        <Typography variant="h6" sx={{ fontSize: "0.75rem" }}>
                            Série du Bac
                        </Typography>
                        <TextField
                            select
                            size="small"
                            slotProps={{
                                inputLabel: {
                                    sx: { fontSize: "0.75rem" },
                                },
                            }}
                            label="All"
                            {...register("baccalaureate_series")}
                            value={watch("baccalaureate_series") || ""}
                        >
                            {baccalaureateSeries.map((option) => (
                                <MenuItem
                                    key={option.value}
                                    value={option.value}
                                >
                                    {option.label}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Stack>
                </Stack>
                {/* Search */}
                <Stack direction="column" spacing={1} flex={1} p={2}>
                    <Typography variant="h6" sx={{ fontSize: "0.75rem" }}>
                        Search
                    </Typography>
                    <Paper
                        component="form"
                        sx={{
                            p: "2px 4px",
                            display: "flex",
                            alignItems: "center",
                            height: "40px",
                            minWidth: 200,
                        }}
                    >
                        <InputBase
                            id="search"
                            placeholder="Search..."
                            variant="outlined"
                            sx={{ ml: 1, flex: 1 }}
                        />
                        <IconButton>
                            <SearchIcon />
                        </IconButton>
                        <Divider
                            orientation="vertical"
                            sx={{ height: 28, mx: 0.5 }}
                        />
                        <IconButton>
                            <ClearIcon />
                        </IconButton>
                    </Paper>
                </Stack>
            </Stack>
        </Paper>
    );
};

export default TopToolBar;
