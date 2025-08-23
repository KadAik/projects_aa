import React, { useEffect, useMemo, useState } from "react";

import { DataGrid, gridClasses, useGridApiRef } from "@mui/x-data-grid";
import {
    alpha,
    Badge,
    Box,
    IconButton,
    Stack,
    Typography,
} from "@mui/material";
import { useApplications } from "../../assets/PsychoAPI/requests";
import ApplicationSearchAndFilterBar from "../../components/DashboardPagesAssets/ApplicationSearchAndFilterBar";
import { useForm } from "react-hook-form";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { useGridApiContext } from "@mui/x-data-grid";
import styled from "@emotion/styled";
import { blue, blueGrey, lightBlue } from "@mui/material/colors";

function sortModelFromVerboseToCompactStyle(sortModelVerbose) {
    // Example transform [{ field: "fieldName", sort: "asc" }] to ["fieldName"] or
    // [{ field: "fieldName", sort: "desc" }] to ["-fieldName"]
    return sortModelVerbose
        .filter((item) => item.sort) // keep only items that have a sort defined
        .map((item) => (item.sort === "desc" ? `-${item.field}` : item.field));
}

function SortIcon({ field }) {
    const sortModel = useGridApiContext().current?.sortModel || {};
    const sortHistory = useGridApiContext().current?.sortHistory || [];
    const sort = sortModel[field]?.sort || "";
    let position = sortHistory.length > 1 ? sortHistory.indexOf(field) + 1 : 0;

    const active = Boolean(sort);

    return (
        <Badge badgeContent={position} color="secondary">
            <Box
                p={0.5}
                sx={{
                    display: "flex",
                    alignItems: "center",
                    borderRadius: "50%",
                    cursor: "pointer",
                    bgcolor: active ? "primary.light" : "transparent",
                    color: active ? "#fff" : "transparent",
                    transition: "all 0.2s ease",
                    ":hover": {
                        bgcolor: blueGrey[100],
                        color: "#fff",
                    },
                    "&:hover .hoverIcon": {
                        color: "#fff", // reveal icon on hover
                    },
                }}
            >
                {sort === "asc" ?
                    <ArrowUpwardIcon sx={{ width: 16, height: 16 }} />
                : sort === "desc" ?
                    <ArrowDownwardIcon sx={{ width: 16, height: 16 }} />
                    // show upward icon only on hover when inactive
                :   <ArrowUpwardIcon
                        className="hoverIcon"
                        sx={{ width: 16, height: 16, color: "transparent" }}
                    />
                }
            </Box>
        </Badge>
    );
}

function SortDescIcon({ active = true }) {
    return (
        <Box
            p={0.5}
            sx={{
                display: "flex",
                alignItems: "center",
                borderRadius: "50%",
                bgcolor: active ? "primary.light" : "transparent",
                color: active ? "#fff" : "inherit",
            }}
        >
            <ArrowDownwardIcon
                sx={{ width: 16, height: 16, fontWeight: "bold" }}
            />
        </Box>
    );
}

const columns_ = [
    {
        field: "rowNumber",
        headerName: "#",
        headerAlign: "center",
        align: "center",
        width: 60,
        sortable: false,
        filterable: false,
        hideable: false,
        valueGetter: (value, row, columns, apiRef) =>
            apiRef.current.getRowIndexRelativeToVisibleRows(
                row.application_id
            ) + 1,
    },
    {
        field: "first_name",
        headerName: "Prénoms",
        minWidth: 150,
        valueGetter: (value, row) => row.applicant?.first_name,
    },
    {
        field: "last_name",
        headerName: "Nom",
        minWidth: 130,
        valueGetter: (value, row) => row.applicant?.last_name,
    },
    {
        field: "date_submitted",
        headerName: "Soumis le",
        minWidth: 160,
        type: "date",
        valueGetter: (value) => value && new Date(value),
        valueFormatter: (value) => value && value.toDateString(),
    },
    {
        field: "status",
        headerName: "Statut",
        minWidth: 130,
        type: "singleSelect",
        valueOptions: ["Pending", "Incomplete", "Accepted", "Rejected"],
    },
    {
        field: "tracking_id",
        headerName: "N° de suivi",
        minWidth: 130,
        sortable: false,
    },
];

const sortableColumns = ["first_name", "last_name", "date_submitted", "status"];

const columns = columns_.map((item) => ({
    ...item,
    renderHeader: (params) => (
        <Stack direction="row">
            <Typography variant="body1" fontWeight="bold">
                {item.headerName} &nbsp;
            </Typography>
            {sortableColumns.includes(item.field) && (
                <SortIcon field={item.field} />
            )}
        </Stack>
    ),
}));

const filtersInitialState = {
    status: "",
    degree: "",
    baccalaureateSeries: "",
};

const ODD_OPACITY = 0.2;

const StripedDataGrid = styled(DataGrid)(({ theme }) => ({
    [`& .${gridClasses.row}.even`]: {
        backgroundColor: theme.palette.grey[100],
        "&:hover": {
            backgroundColor: alpha(theme.palette.primary.main, ODD_OPACITY),
            "@media (hover: none)": {
                backgroundColor: "transparent",
            },
        },
        "&.Mui-selected": {
            backgroundColor: alpha(
                theme.palette.primary.main,
                ODD_OPACITY + theme.palette.action.selectedOpacity
            ),
            "&:hover": {
                backgroundColor: alpha(
                    theme.palette.primary.main,
                    ODD_OPACITY +
                        theme.palette.action.selectedOpacity +
                        theme.palette.action.hoverOpacity
                ),
                // Reset on touch devices, it doesn't add specificity
                "@media (hover: none)": {
                    backgroundColor: alpha(
                        theme.palette.primary.main,
                        ODD_OPACITY + theme.palette.action.selectedOpacity
                    ),
                },
            },
        },
        ...theme.applyStyles("dark", {
            backgroundColor: theme.palette.grey[800],
        }),
    },
    // Styling the header
    [`& .${gridClasses.columnHeader}`]: {
        backgroundColor: blue[50],
    },
}));

const ApplicationsManager = () => {
    // For multiple fields sorting
    const [ctrlPressed, setCtrlPressed] = useState(false);
    const { register, watch } = useForm({
        defaultValues: filtersInitialState,
    });

    const apiRef = useGridApiRef();

    const [sortModel, setSortModel] = useState({}); // sortModel should be an array of objects, but using {}
    // is just a workaround as useApplication is already getting an array
    // sortModel struct eg. : {first_name: {field: "first_name", sort: "asc"}, date_submitted: {field: "date_submitted", sort: "desc"}}
    const [sortHistory, setSortHistory] = useState([]);

    // Let's attach a custom field (sortModel) to apiRef, for custom use (handle multiple sort in column def)
    // as we cannot directly set this field on the community DataGrid

    if (apiRef.current) {
        apiRef.current.sortModel = sortModel;
        apiRef.current.sortHistory = sortHistory;
    }

    const filters = watch();

    const { data, isLoading } = useApplications({
        filters,
        sort_by: sortModelFromVerboseToCompactStyle(Object.values(sortModel)),
    });

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === "Control") {
                setCtrlPressed(true);
            }
        };

        const handleKeyUp = (event) => {
            if (event.key === "Control") {
                setCtrlPressed(false);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
        };
    }, []);

    const handleSortModelChange = (newSortModel) => {
        // We will be keeping sortModel as : {field: {field: fieldName, sort: asc|desc|null}, {...}}
        // in order to facilitate handling (to avoid duplicates fields)
        // Hence when encountering the same field the second time for reverse order, we can easily overwrite the previous.

        if (!newSortModel.length) {
            // Unlikely situation though due to sortingOrder
            setSortModel({});
            return;
        }

        // If Ctrl key is pressed when the event occurs, append to existing sort (multiple sorting)
        if (ctrlPressed) {
            const { field, sort } = newSortModel[0];

            // DataGrid community is stateless per field, thus when Ctrl+click back on first_name for example, the grid
            // doesn’t remember it previously is asc/desc/null
            // — it just starts its cycle again (asc → desc → null) as if it was a fresh column.
            // Thus don't rely on DataGrid to get the correct next sort => manually cycle sort state based on previous value
            const prevSort = sortModel[field]?.sort;
            let nextSort = sort;

            if (prevSort === "asc") nextSort = "desc";
            if (prevSort === "desc") nextSort = "null";
            // We leave the case of previous == "null" as anyhow the cycle will restarts on asc.

            setSortModel((prev) => {
                // If the sort is "null", we reset the field (exclude it from sorts)
                if (nextSort === "null") {
                    const { [field]: _, ...rest } = prev;
                    // Remove the field from the sortHistory table
                    setSortHistory((prev) => {
                        return prev.filter((f) => f !== field);
                    });
                    return rest;
                }
                // Remove the old occurences and add a new one in the sortHistory table
                setSortHistory((prev) => {
                    const withouField = prev.filter((f) => f !== field);
                    return [...withouField, field];
                });
                // add or update the field
                return {
                    ...prev,
                    [field]: { field, sort: nextSort },
                };
            });
        } else {
            // no Ctrl -> reset everything
            const { field, sort } = newSortModel[0];
            if (sort === "null") {
                setSortModel({});
                setSortHistory([]);
            } else {
                setSortModel({ [field]: { field, sort } });
                setSortHistory([field]);
            }
        }
    };

    return (
        <>
            <ApplicationSearchAndFilterBar register={register} watch={watch} />
            <Box sx={{ width: "100%", height: "100%" }}>
                <StripedDataGrid
                    apiRef={apiRef}
                    columns={columns}
                    rows={data ?? []}
                    getRowId={(row) => row.application_id}
                    loading={isLoading}
                    sortingMode="server"
                    onSortModelChange={handleSortModelChange}
                    sortingOrder={["asc", "desc", "null"]}
                    showColumnVerticalBorder
                    showToolbar
                    autoPageSize
                    //checkboxSelection
                    slots={{
                        columnSortedAscendingIcon: null,
                        columnSortedDescendingIcon: null,
                    }}
                    // Strip rows
                    getRowClassName={(params) =>
                        params.indexRelativeToCurrentPage % 2 === 0 ?
                            "odd"
                        :   "even"
                    }
                    sx={{
                        "& .MuiDataGrid-columnHeader .MuiDataGrid-sortButton": {
                            display: "none",
                        },
                        "& .MuiDataGrid-columnHeaderTitleContainerContent": {
                            // To show the badge entirely
                            overflow: "visible",
                        },
                    }}
                />
            </Box>
        </>
    );
};
export default ApplicationsManager;
