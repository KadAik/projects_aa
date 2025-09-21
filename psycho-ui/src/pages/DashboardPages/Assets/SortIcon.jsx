import React from "react";
import { alpha, Badge, Box, useTheme } from "@mui/material";
import { blueGrey } from "@mui/material/colors";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { useApplicationDataGridContext } from "../../../contexts/applicationDataGridContext";

const baseBoxStyles = {
    display: "flex",
    alignItems: "center",
    borderRadius: "50%",
    cursor: "pointer",
    transition: "all 0.2s ease",
    p: 0.5,
    ":hover": {
        bgcolor: blueGrey[100],
        color: "#fff",
    },
    "&:hover .hoverIcon": {
        color: "#fff",
    },
};

export const SortIcon = React.memo(function SortIcon({ field }) {
    const theme = useTheme();
    const { sortHistory = [], sortModel = {} } =
        useApplicationDataGridContext();
    const sort = sortModel[field]?.sort || "";
    const position =
        sortHistory.length > 1 ? sortHistory.indexOf(field) + 1 : null;
    const active = Boolean(sort);

    const getIconStyles = (active) => {
        if (active) {
            return {
                backgroundColor: alpha(theme.palette.primary.contrastText, 0.2),
                color: theme.palette.primary.contrastText,
                "&:hover": {
                    backgroundColor: alpha(
                        theme.palette.primary.contrastText,
                        0.3
                    ),
                },
            };
        }
        return {
            color: alpha(theme.palette.primary.contrastText, 0.6),
            "&:hover": {
                backgroundColor: alpha(theme.palette.primary.contrastText, 0.1),
                color: theme.palette.primary.contrastText,
            },
        };
    };

    const icon =
        sort === "asc" ? <ArrowUpwardIcon sx={{ width: 16, height: 16 }} />
        : sort === "desc" ? <ArrowDownwardIcon sx={{ width: 16, height: 16 }} />
        : <ArrowUpwardIcon
                className="hoverIcon"
                sx={{
                    width: 16,
                    height: 16,
                    color: theme.palette.primary.contrastText,
                    opacity: 0.6,
                }}
            />;

    const box = (
        <Box
            sx={{
                ...getIconStyles(active),
                ...baseBoxStyles,
            }}
        >
            {icon}
        </Box>
    );

    return position ?
            <Badge
                badgeContent={position}
                color="secondary"
                sx={{
                    "& .MuiBadge-badge": {
                        color:
                            active ?
                                theme.palette.primary.contrastText
                            :   "transparent",
                        fontWeight: 700,
                        fontSize: "0.7rem",
                        width: 16,
                        height: 16,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor:
                            active ?
                                theme.palette.secondary.main
                            :   "transparent",
                        borderRadius: "50%",
                        lineHeight: 1,
                    },
                }}
            >
                {box}
            </Badge>
        :   box;
});
