import {
    Stack,
    MenuItem,
    Typography,
    TextField,
    Paper,
    IconButton,
    Divider,
    useTheme,
    Box,
    InputAdornment,
    alpha,
} from "@mui/material";

import InputBase from "@mui/material/InputBase";

import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import FilterListIcon from "@mui/icons-material/FilterList";
import { useWatch } from "react-hook-form";

const status = [
    { value: "Pending", label: "En attente" },
    { value: "Incomplete", label: "Incomplet" },
    { value: "Accepted", label: "Accepté" },
    { value: "Rejected", label: "Rejeté" },
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

function renderSelectValue(selected, placeholder) {
    if (!selected) {
        return (
            <Typography
                variant="body2"
                sx={{ color: "text.secondary", fontStyle: "italic" }}
            >
                {placeholder}
            </Typography>
        );
    }
    return <Typography variant="body2">{selected}</Typography>;
}

export default function ApplicationSearchAndFilterBar({ register, control }) {
    const theme = useTheme();
    const statusValue = useWatch({ control, name: "status" });
    const degreeValue = useWatch({ control, name: "degree" });
    const baccalaureateSeriesValue = useWatch({
        control,
        name: "baccalaureate_series",
    });

    const hasActiveFilters =
        statusValue || degreeValue || baccalaureateSeriesValue;

    return (
        <Paper
            elevation={1}
            sx={{
                width: "100%",
                p: 0,
                mb: 3,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 2,
                backgroundColor: theme.palette.background.paper,
                overflow: "hidden",
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    px: 2,
                    py: 1,
                    backgroundColor: theme.palette.grey[50],
                    borderBottom: `1px solid ${theme.palette.divider}`,
                }}
            >
                <FilterListIcon
                    sx={{ fontSize: 18, mr: 1, color: "text.secondary" }}
                />
                <Typography
                    variant="subtitle2"
                    sx={{ color: "text.secondary", fontWeight: 600 }}
                >
                    Filtres et recherche
                </Typography>
                {hasActiveFilters && (
                    <Box
                        sx={{
                            ml: 2,
                            px: 1,
                            py: 0.5,
                            backgroundColor: alpha(
                                theme.palette.primary.main,
                                0.1
                            ),
                            borderRadius: 1,
                        }}
                    >
                        <Typography
                            variant="caption"
                            sx={{ color: "primary.main", fontWeight: 600 }}
                        >
                            Filtres actifs
                        </Typography>
                    </Box>
                )}
            </Box>

            <Stack
                direction={{ xs: "column", md: "row" }}
                spacing={2}
                sx={{
                    width: "100%",
                    p: 3,
                }}
            >
                {/* Filter Section */}
                <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={2}
                    sx={{
                        flex: 1,
                        minWidth: 0,
                    }}
                >
                    {/* Status Filter */}
                    <Box sx={{ minWidth: 120, flex: 1 }}>
                        <Typography
                            variant="caption"
                            sx={{
                                display: "block",
                                mb: 0.5,
                                color: "text.secondary",
                                fontWeight: 600,
                                fontSize: "0.75rem",
                            }}
                        >
                            Statut
                        </Typography>
                        <TextField
                            select
                            size="small"
                            fullWidth
                            {...register("status")}
                            value={statusValue || ""}
                            slotProps={{
                                select: {
                                    displayEmpty: true,
                                    renderValue: (selected) =>
                                        renderSelectValue(
                                            selected,
                                            "Tous les statuts"
                                        ),
                                },
                            }}
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    backgroundColor:
                                        theme.palette.background.paper,
                                },
                            }}
                        >
                            <MenuItem value="">
                                <Typography
                                    variant="body2"
                                    sx={{ color: "text.secondary" }}
                                >
                                    Tous les statuts
                                </Typography>
                            </MenuItem>
                            {status.map((option) => (
                                <MenuItem
                                    key={option.value}
                                    value={option.value}
                                >
                                    {option.label}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Box>

                    {/* Degree Filter */}
                    <Box sx={{ minWidth: 120, flex: 1 }}>
                        <Typography
                            variant="caption"
                            sx={{
                                display: "block",
                                mb: 0.5,
                                color: "text.secondary",
                                fontWeight: 600,
                                fontSize: "0.75rem",
                            }}
                        >
                            Niveau académique
                        </Typography>
                        <TextField
                            select
                            size="small"
                            fullWidth
                            {...register("degree")}
                            value={degreeValue || ""}
                            slotProps={{
                                select: {
                                    displayEmpty: true,
                                    renderValue: (selected) =>
                                        renderSelectValue(
                                            selected,
                                            "Tous les niveaux"
                                        ),
                                },
                            }}
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    backgroundColor:
                                        theme.palette.background.paper,
                                },
                            }}
                        >
                            <MenuItem value="">
                                <Typography
                                    variant="body2"
                                    sx={{ color: "text.secondary" }}
                                >
                                    Tous les niveaux
                                </Typography>
                            </MenuItem>
                            {degreeOptions.map((option) => (
                                <MenuItem
                                    key={option.value}
                                    value={option.value}
                                >
                                    {option.label}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Box>

                    {/* Baccalaureate Series Filter */}
                    <Box sx={{ minWidth: 120, flex: 1 }}>
                        <Typography
                            variant="caption"
                            sx={{
                                display: "block",
                                mb: 0.5,
                                color: "text.secondary",
                                fontWeight: 600,
                                fontSize: "0.75rem",
                            }}
                        >
                            Série du Bac
                        </Typography>
                        <TextField
                            select
                            size="small"
                            fullWidth
                            {...register("baccalaureate_series")}
                            value={baccalaureateSeriesValue || ""}
                            slotProps={{
                                select: {
                                    displayEmpty: true,
                                    renderValue: (selected) =>
                                        renderSelectValue(
                                            selected,
                                            "Toutes les séries"
                                        ),
                                },
                            }}
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    backgroundColor:
                                        theme.palette.background.paper,
                                },
                            }}
                        >
                            <MenuItem value="">
                                <Typography
                                    variant="body2"
                                    sx={{ color: "text.secondary" }}
                                >
                                    Toutes les séries
                                </Typography>
                            </MenuItem>
                            {baccalaureateSeries.map((option) => (
                                <MenuItem
                                    key={option.value}
                                    value={option.value}
                                >
                                    {option.label}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Box>
                </Stack>

                {/* Search Section */}
                <Box sx={{ minWidth: 280 }}>
                    <Typography
                        variant="caption"
                        sx={{
                            display: "block",
                            mb: 0.5,
                            color: "text.secondary",
                            fontWeight: 600,
                            fontSize: "0.75rem",
                        }}
                    >
                        Recherche
                    </Typography>
                    <Paper
                        component="form"
                        sx={{
                            p: "2px 4px",
                            display: "flex",
                            alignItems: "center",
                            height: "40px",
                            backgroundColor: theme.palette.background.paper,
                            border: `1px solid ${theme.palette.divider}`,
                            borderRadius: 1,
                            "&:hover": {
                                borderColor: theme.palette.primary.main,
                            },
                            "&:focus-within": {
                                borderColor: theme.palette.primary.main,
                                boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`,
                            },
                        }}
                    >
                        <InputBase
                            id="search"
                            placeholder="Rechercher..."
                            sx={{
                                ml: 1,
                                flex: 1,
                                fontSize: "0.875rem",
                            }}
                            startAdornment={
                                <InputAdornment position="start">
                                    <SearchIcon
                                        sx={{
                                            color: "text.secondary",
                                            fontSize: 20,
                                        }}
                                    />
                                </InputAdornment>
                            }
                        />
                        <Divider
                            orientation="vertical"
                            sx={{ height: 24, mx: 1 }}
                        />
                        <IconButton
                            size="small"
                            sx={{
                                color: "text.secondary",
                                "&:hover": {
                                    color: "primary.main",
                                },
                            }}
                        >
                            <ClearIcon fontSize="small" />
                        </IconButton>
                    </Paper>
                </Box>
            </Stack>
        </Paper>
    );
}
