import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import ButtonGroup from "@mui/material/ButtonGroup";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import { alpha, useTheme } from "@mui/material/styles";
import FilterListIcon from "@mui/icons-material/FilterList";
import SortIcon from "@mui/icons-material/Sort";

const filtersInitialState = {
    status: "",
    degree: "",
    baccalaureate_series: "",
};

const ApplicationToolBar = ({
    setSortModel,
    sortHistory,
    clearFilters,
    setFilterValue,
    filters = {},
    children, // right-side toolbar items
}) => {
    const theme = useTheme();
    const activeFilters = Object.entries(filters).filter(([, value]) => value);

    const onResetSorts = () => setSortModel([]);
    const onClearFilters = () => clearFilters(filtersInitialState);

    const hasActiveFilters = activeFilters.length > 0;
    const hasActiveSorts = sortHistory.length > 0;

    const getFilterLabel = (key, value) => {
        const labels = {
            status: "Statut",
            degree: "Diplôme",
            baccalaureate_series: "Bac",
        };
        return `${labels[key] || key}: ${value}`;
    };

    return (
        <Toolbar
            sx={{
                p: 2,
                display: "flex",
                alignItems: "center",
                gap: 2,
                backgroundColor: theme.palette.grey[50],
                borderBottom: `1px solid ${theme.palette.divider}`,
                minHeight: "72px !important",
                flexWrap: "wrap",
            }}
        >
            {/* Left section - Actions */}
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    flexShrink: 0,
                }}
            >
                <ButtonGroup variant="outlined" size="small">
                    <Button
                        startIcon={<SortIcon />}
                        onClick={onResetSorts}
                        disabled={!hasActiveSorts}
                        sx={{
                            fontWeight: 600,
                            "&:not(:disabled)": {
                                borderColor: theme.palette.primary.main,
                                color: theme.palette.primary.main,
                                "&:hover": {
                                    backgroundColor: alpha(
                                        theme.palette.primary.main,
                                        0.08
                                    ),
                                },
                            },
                        }}
                    >
                        Réinitialiser tris
                    </Button>
                    <Button
                        startIcon={<FilterListIcon />}
                        onClick={onClearFilters}
                        disabled={!hasActiveFilters}
                        sx={{
                            fontWeight: 600,
                            "&:not(:disabled)": {
                                borderColor: theme.palette.secondary.main,
                                color: theme.palette.secondary.main,
                                "&:hover": {
                                    backgroundColor: alpha(
                                        theme.palette.secondary.main,
                                        0.08
                                    ),
                                },
                            },
                        }}
                    >
                        Effacer filtres
                    </Button>
                </ButtonGroup>

                {/* Sort/Filter counters */}
                {(hasActiveSorts || hasActiveFilters) && (
                    <Box sx={{ display: "flex", gap: 1, ml: 1 }}>
                        {hasActiveSorts && (
                            <Chip
                                size="small"
                                label={`${sortHistory.length} tri${sortHistory.length > 1 ? "s" : ""}`}
                                color="primary"
                                variant="outlined"
                                sx={{
                                    fontWeight: 600,
                                    fontSize: "0.75rem",
                                }}
                            />
                        )}
                        {hasActiveFilters && (
                            <Chip
                                size="small"
                                label={`${activeFilters.length} filtre${activeFilters.length > 1 ? "s" : ""}`}
                                color="secondary"
                                variant="outlined"
                                sx={{
                                    fontWeight: 600,
                                    fontSize: "0.75rem",
                                }}
                            />
                        )}
                    </Box>
                )}
            </Box>

            {/* Middle section - Active filters */}
            {hasActiveFilters && (
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        flexGrow: 1,
                        flexWrap: "wrap",
                        minWidth: 0,
                    }}
                >
                    <Typography
                        variant="caption"
                        sx={{
                            fontWeight: 600,
                            color: "text.secondary",
                            whiteSpace: "nowrap",
                        }}
                    >
                        Filtres actifs:
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap">
                        {activeFilters.map(([key, value]) => (
                            <Chip
                                size="small"
                                key={key}
                                label={getFilterLabel(key, value)}
                                onDelete={() => setFilterValue(key, "")}
                                color="primary"
                                variant="filled"
                                sx={{
                                    fontWeight: 500,
                                    backgroundColor: alpha(
                                        theme.palette.primary.main,
                                        0.12
                                    ),
                                    color: theme.palette.primary.dark,
                                    "& .MuiChip-deleteIcon": {
                                        color: theme.palette.primary.main,
                                        "&:hover": {
                                            color: theme.palette.primary.dark,
                                        },
                                    },
                                }}
                            />
                        ))}
                    </Stack>
                </Box>
            )}

            {/* Right section - Grid controls */}
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    flexShrink: 0,
                    ml: "auto",
                }}
            >
                {children}
            </Box>
        </Toolbar>
    );
};

export default ApplicationToolBar;
