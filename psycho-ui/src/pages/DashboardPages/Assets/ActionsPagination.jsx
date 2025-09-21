import styled from "@emotion/styled";
import { Pagination, useTheme } from "@mui/material";
import { gridPageCountSelector, useGridSelector } from "@mui/x-data-grid";
import { useGridApiContext } from "@mui/x-data-grid";

const StyledPagination = styled(Pagination)(({ theme }) => ({
    "& .MuiPaginationItem-root": {
        color: theme.palette.text.secondary,
        "&.Mui-selected": {
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            "&:hover": {
                backgroundColor: theme.palette.primary.dark,
            },
        },
        "&:hover": {
            backgroundColor: theme.palette.action.hover,
        },
    },
}));

export default function ActionsPagination({ page, onPageChange, className }) {
    const apiRef = useGridApiContext();
    const pageCount = useGridSelector(apiRef, gridPageCountSelector);
    const theme = useTheme();

    const handleChange = (event, newPageNumber) => {
        onPageChange(event, newPageNumber - 1);
    };

    return (
        <StyledPagination
            count={pageCount}
            className={className}
            page={page + 1}
            onChange={handleChange}
            boundaryCount={1}
            siblingCount={1}
            shape="rounded"
            variant="outlined"
            color="primary"
            showFirstButton
            showLastButton
            sx={{
                padding: "8px",
                backgroundColor: theme.palette.background.paper,
                borderRadius: "4px",
                boxShadow: theme.shadows[1],
            }}
        />
    );
}
