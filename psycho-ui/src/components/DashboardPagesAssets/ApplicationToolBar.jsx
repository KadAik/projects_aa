import { Button, Stack, ButtonGroup, Chip } from "@mui/material";
import { Toolbar } from "@mui/x-data-grid";
import RestartAltSharpIcon from "@mui/icons-material/RestartAltSharp";
import ClearSharpIcon from "@mui/icons-material/ClearSharp";

const ApplicationToolBar = ({
    apiRef,
    sortHistory,
    resetFilters,
    setFilterValue,
    filters = [],
}) => {
    const onResetSorts = () => {
        // Setting Grid own sortModel on an empty array also resets the cycle
        // Take care of resseting custom sortModel state in handleSortModelChange
        apiRef.current?.setSortModel([]);
    };

    const onResetFilters = () => resetFilters();

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
                        onClick={onResetFilters}
                        disabled={!hasActiveFilters()}
                    >
                        Clear filters
                    </Button>
                </ButtonGroup>

                {/* Chips for filters */}
                {Object.keys(filters).length > 0 && (
                    <Stack
                        direction="row"
                        spacing={1}
                        flexWrap="wrap"
                        alignItems="center"
                    >
                        {Object.entries(filters)
                            .filter(([, value]) => !!value)
                            .map(([key, value]) => (
                                <Chip
                                    size="small"
                                    key={key}
                                    label={`${key === "baccalaureate_series" ? "Bac" : key}: ${value}`}
                                    onDelete={() => setFilterValue([key], "")}
                                />
                            ))}
                    </Stack>
                )}
            </Stack>
        </Toolbar>
    );
};

export default ApplicationToolBar;
