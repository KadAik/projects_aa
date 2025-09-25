import { alpha, styled } from "@mui/material";
import { gridClasses } from "@mui/x-data-grid";
import { DataGrid } from "@mui/x-data-grid";

const ODD_OPACITY = 0.05;
const EVEN_OPACITY = 0.02;

const StripedDataGrid = styled(DataGrid)(({ theme }) => ({
    border: "none",
    //borderRadius: "12px",
    overflow: "hidden",
    boxShadow: theme.shadows[2],

    "& .MuiDataGrid-columnHeaders": {
        backgroundColor: theme.palette.primary.main,

        minHeight: "56px !important",
        maxHeight: "56px !important",
    },

    "& .MuiDataGrid-columnHeader": {
        backgroundColor: "transparent",
        color: theme.palette.primary.contrastText,
        fontWeight: 600,
        fontSize: "0.875rem",
        padding: "0 16px",
    },

    "& .MuiDataGrid-columnHeaderTitle": {
        fontWeight: 600,
        fontSize: "0.875rem",
    },

    "& .MuiDataGrid-columnHeaderTitleContainerContent": {
        overflow: "visible",
    },

    "& .MuiDataGrid-columnSeparator": {
        //display: "none",
    },

    "& .MuiDataGrid-cell": {
        borderBottom: `1px solid ${theme.palette.divider}`,
        padding: "12px 16px",
        fontSize: "0.875rem",
    },

    "& .MuiDataGrid-row": {
        "&:last-child": {
            "& .MuiDataGrid-cell": {
                borderBottom: "none",
            },
        },
    },

    [`& .${gridClasses.row}.even`]: {
        backgroundColor: alpha(theme.palette.primary.main, EVEN_OPACITY),
        "&:hover": {
            backgroundColor: alpha(theme.palette.primary.main, ODD_OPACITY * 3),
        },
        "&.Mui-selected": {
            backgroundColor: alpha(
                theme.palette.primary.main,
                ODD_OPACITY + 0.1
            ),
            "&:hover": {
                backgroundColor: alpha(
                    theme.palette.primary.main,
                    ODD_OPACITY + 0.2
                ),
            },
        },
    },

    [`& .${gridClasses.row}.odd`]: {
        backgroundColor: theme.palette.background.paper,
        "&:hover": {
            backgroundColor: alpha(theme.palette.primary.main, ODD_OPACITY * 2),
        },
        "&.Mui-selected": {
            backgroundColor: alpha(theme.palette.primary.main, ODD_OPACITY),
            "&:hover": {
                backgroundColor: alpha(
                    theme.palette.primary.main,
                    ODD_OPACITY + 0.1
                ),
            },
        },
    },

    "& .MuiDataGrid-virtualScroller": {
        backgroundColor: theme.palette.background.default,
    },

    "& .MuiDataGrid-footerContainer": {
        borderTop: `1px solid ${theme.palette.divider}`,
        backgroundColor: theme.palette.background.paper,
        borderBottomLeftRadius: "8px",
        borderBottomRightRadius: "8px",
    },

    "& .MuiToolbar-root": {
        padding: "16px",
        backgroundColor: theme.palette.grey[50],
        borderBottom: `1px solid ${theme.palette.divider}`,
    },

    // "& .MuiDataGrid-menuIcon button": {
    //     color: theme.palette.primary.contrastText,
    // },

    "& .MuiDataGrid-sortIcon": {
        display: "none",
    },

    "& .MuiDataGrid-actionsCell": {
        gap: "4px",
    },

    "& .MuiDataGrid-iconButtonContainer": {
        marginLeft: "4px",
    },
}));

export default StripedDataGrid;
