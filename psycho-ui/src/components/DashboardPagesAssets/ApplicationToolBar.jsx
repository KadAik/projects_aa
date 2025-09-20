import {
    Button,
    Stack,
    ButtonGroup,
    Chip,
    Typography,
    Toolbar,
} from "@mui/material";
import RestartAltSharpIcon from "@mui/icons-material/RestartAltSharp";
import ClearSharpIcon from "@mui/icons-material/ClearSharp";

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
    const activeFilters = Object.entries(filters).filter(([, value]) => value);

    console.log("Active filters from Toolbar : ", activeFilters);

    const onResetSorts = () => setSortModel([]);
    const onClearFilters = () => clearFilters(filtersInitialState);

    const hasActiveFilters = () => activeFilters.length > 0;

    return (
        <Toolbar
            sx={{
                p: 1,
                display: "flex",
                alignItems: "flex-start", // align buttons & chips nicely
                gap: 1,
            }}
        >
            {/* Left buttons */}
            <ButtonGroup variant="outlined" sx={{ flexShrink: 0 }}>
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

            {/* Middle chips - wraps if too many */}
            <Stack
                direction="row"
                spacing={1}
                flexWrap="wrap"
                sx={{ flexGrow: 1 }} // take remaining space
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

            {/* Right zone for grid toolbar items */}
            <Stack direction="row" spacing={1} sx={{ flexShrink: 0 }}>
                {children}
            </Stack>
        </Toolbar>
    );
};

export default ApplicationToolBar;
