import { Button, Stack, ButtonGroup, Chip } from "@mui/material";
import { Toolbar } from "@mui/x-data-grid";
import RestartAltSharpIcon from "@mui/icons-material/RestartAltSharp";
import ClearSharpIcon from "@mui/icons-material/ClearSharp";

const ApplicationToolBar = ({
    setSortModel,
    sortHistory,
    clearFilters,
    setFilterValue,
    filters = [],
}) => {
    const activeFilters = Object.entries(filters).filter(([, value]) => value);
    console.log(activeFilters);

    const onResetSorts = () => {
        // Setting Grid own sortModel on an empty array also resets the cycle
        // Take care of resseting custom sortModel state in handleSortModelChange
        setSortModel([]);
    };

    const onClearFilters = () => clearFilters();

    const hasActiveFilters = () => {
        return Object.values(filters).some(
            (value) => value != null && value !== "" && value !== false
        );
    };

    return (
        <Toolbar>
            <Stack width="100%" spacing={1} direction="row">
                <ButtonGroup variant="outlined">
                    <Button
                        startIcon={<RestartAltSharpIcon />}
                        onClick={onResetSorts}
                        disabled={sortHistory.length === 0}
                    >
                        Reset sorts
                    </Button>
                    <Button
                        startIcon={<ClearSharpIcon />}
                        onClick={onClearFilters}
                        disabled={!hasActiveFilters()}
                    >
                        Clear filters
                    </Button>
                </ButtonGroup>

                {/* Chips for filters */}
                {Object.keys(activeFilters).length > 0 && (
                    <Stack
                        direction="row"
                        spacing={1}
                        flexWrap="wrap"
                        alignItems="center"
                    >
                        {activeFilters.map(([key, value]) => (
                            <Chip
                                size="small"
                                key={key}
                                label={`${key === "baccalaureate_series" ? "Bac" : key}: ${value}`}
                                onDelete={() => setFilterValue(key, "")}
                            />
                        ))}
                    </Stack>
                )}
            </Stack>
        </Toolbar>
    );
};

export default ApplicationToolBar;
