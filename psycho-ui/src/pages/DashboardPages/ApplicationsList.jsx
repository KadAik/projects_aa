import React, { useEffect, useMemo, useState } from "react";

import {
    DataGrid,
    GridActionsCellItem,
    gridClasses,
    gridPageCountSelector,
    useGridApiRef,
    useGridSelector,
} from "@mui/x-data-grid";
import {
    alpha,
    Badge,
    Box,
    IconButton,
    Pagination,
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
import { blueGrey, lightBlue } from "@mui/material/colors";
import ApplicationToolBar from "../../components/DashboardPagesAssets/ApplicationToolBar";
import {
    ApplicationDataGridContext,
    useApplicationDataGridContext,
} from "../../contexts/applicationDataGridContext";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import { Link, useNavigate } from "react-router-dom";
import GavelOutlinedIcon from "@mui/icons-material/GavelOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";

function sortModelFromVerboseToCompactStyle(sortModelVerbose) {
    // Example transform [{ field: "fieldName", sort: "asc" }] to ["fieldName"] or
    // [{ field: "fieldName", sort: "desc" }] to ["-fieldName"]
    return sortModelVerbose
        .filter((item) => item.sort) // keep only items that have a sort defined
        .map((item) => (item.sort === "desc" ? `-${item.field}` : item.field));
}

function SortIcon({ field }) {
    const { sortHistory = [], sortModel = {} } =
        useApplicationDataGridContext();
    // const sortModel = apiRef.current?.sortModelObj || {};
    // const sortHistory = apiRef.current?.sortHistory || [];
    const sort = sortModel[field]?.sort || "";
    let position = sortHistory.length > 1 ? sortHistory.indexOf(field) + 1 : 0;
    const active = Boolean(sort);

    return (
        <>
            {active && sortHistory.length > 1 ?
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
                                color: "#fff",
                            },
                        }}
                    >
                        {sort === "asc" ?
                            <ArrowUpwardIcon sx={{ width: 16, height: 16 }} />
                        : sort === "desc" ?
                            <ArrowDownwardIcon sx={{ width: 16, height: 16 }} />
                        :   <ArrowUpwardIcon
                                className="hoverIcon"
                                sx={{
                                    width: 16,
                                    height: 16,
                                    color: "transparent",
                                }}
                            />
                        }
                    </Box>
                </Badge>
            :   <Box
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
                            color: "#fff",
                        },
                    }}
                >
                    {sort === "asc" ?
                        <ArrowUpwardIcon sx={{ width: 16, height: 16 }} />
                    : sort === "desc" ?
                        <ArrowDownwardIcon sx={{ width: 16, height: 16 }} />
                    :   <ArrowUpwardIcon
                            className="hoverIcon"
                            sx={{
                                width: 16,
                                height: 16,
                                color: "transparent",
                            }}
                        />
                    }
                </Box>
            }
        </>
    );
}

function ActionsPagination({ page, onPageChange, className }) {
    const apiRef = useGridApiContext();
    const pageCount = useGridSelector(apiRef, gridPageCountSelector);
    // DataGrid is 0-based page, but Pagination is 1-based
    const handleChange = (event, newPageNumber) => {
        onPageChange(event, newPageNumber - 1);
    };
    return (
        <Pagination
            count={pageCount}
            className={className}
            page={page + 1}
            onChange={handleChange}
            boundaryCount={2}
            shape="rounded"
            variant="outlined"
            color="primary"
            showFirstButton
            showLastButton
        />
    );
}

const sortableColumns = [
    "first_name",
    "last_name",
    "date_submitted",
    "status",
    "baccalaureate_series",
];

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
}));

const ApplicationsList = () => {
    // For multiple fields sorting
    const [ctrlPressed, setCtrlPressed] = useState(false);
    const { register, watch, reset, setValue } = useForm({
        defaultValues: filtersInitialState,
    });

    const navigate = useNavigate();

    const apiRef = useGridApiRef();

    const [sortModel, setSortModel] = useState({}); // sortModel should be an array of objects, but using {}
    // is just a workaround as useApplication is already getting an array
    // sortModel struct eg. : {first_name: {field: "first_name", sort: "asc"}, date_submitted: {field: "date_submitted", sort: "desc"}}
    const [sortHistory, setSortHistory] = useState([]);

    // Let's attach a custom field (sortModel) to apiRef, for custom use (handle multiple sort in column def)
    // as we cannot directly set this field on the community DataGrid

    const [paginationModel, setPaginationModel] = useState({
        //Django drf pagination is 1-based index whereas Grid is 0-based
        page: 0,
        pageSize: 5,
    });

    const [rowCount, setRowCount] = useState(0);

    // if (apiRef.current) {
    //     apiRef.current.sortModelObj = sortModel;
    //     apiRef.current.sortHistory = sortHistory;
    // }

    const filters = watch();

    console.log("The pagination model is : ", paginationModel);

    const { data, isLoading } = useApplications({
        filters,
        sort_by: sortModelFromVerboseToCompactStyle(Object.values(sortModel)),
        pagination: {
            page: paginationModel.page + 1,
            pageSize: paginationModel.pageSize,
        },
    });

    useEffect(() => {
        setRowCount((prev) => (data?.count !== undefined ? data.count : prev));
    }, [data?.count]);

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
            // reset the sort
            setSortModel({});
            setSortHistory([]);
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

    const onApplicantProfileEdit = (e, applicantProfile) => {
        console.log("Edit application", applicantProfile);
        navigate(`/applicants/${applicantProfile?.applicant_id}`, {
            state: { applicantData: applicantProfile },
        });
    };

    const onApplicationRead = (e, application) => {
        console.log("Read application", application);
        navigate(`/applications/${application?.application_id}`, {
            state: { applicationData: application },
        });
    };

    const providerValue = useMemo(
        () => ({ apiRef, sortHistory, sortModel }),
        [apiRef, sortHistory, sortModel]
    );

    const columns_ = useMemo(
        () => [
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
                type: "actions",
                width: 70,
                getActions: (params) => [
                    <GridActionsCellItem
                        icon={<VisibilityOutlinedIcon />}
                        label="Visualiser"
                        component={Link}
                        to={`/manage/applications/${params?.row?.application_id}`}
                        state={{ applicationData: params?.row }}
                    />,
                    <GridActionsCellItem
                        icon={<GavelOutlinedIcon />}
                        label="Traiter le dossier"
                        showInMenu
                    />,
                    <GridActionsCellItem
                        icon={<EditOutlinedIcon />}
                        label="Modifier le profile"
                        component={Link}
                        to={`/manage/applicants/${params?.row?.applicant?.applicant_id}`}
                        state={{ applicantData: params?.row?.applicant }}
                        showInMenu
                    />,
                    <GridActionsCellItem
                        icon={<DeleteOutlinedIcon />}
                        label="Delete"
                        showInMenu
                    />,
                ],
            },
            {
                field: "first_name",
                headerName: "Prénoms",
                minWidth: 155,
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
                valueGetter: (value, row) => row.status,
                minWidth: 130,
                type: "singleSelect",
                valueOptions: ["Pending", "Incomplete", "Accepted", "Rejected"],
            },
            {
                field: "baccalaureate_series",
                headerName: "Bac",
                minWidth: 130,
                valueGetter: (value, row) =>
                    row.applicant?.baccalaureate_series,
            },
            {
                field: "tracking_id",
                headerName: "N° de suivi",
                valueGetter: (value, row) => row.tracking_id,
                minWidth: 130,
                sortable: false,
            },
        ],
        []
    );

    const columns = useMemo(
        () =>
            columns_.map((item) => ({
                ...item,
                renderHeader: () => (
                    <Stack direction="row">
                        <Typography variant="body1" fontWeight="bold">
                            {item.headerName} &nbsp;
                        </Typography>
                        {sortableColumns.includes(item.field) && (
                            <SortIcon field={item.field} />
                        )}
                    </Stack>
                ),
            })),
        [columns_]
    );

    return (
        <ApplicationDataGridContext.Provider value={providerValue}>
            <ApplicationSearchAndFilterBar register={register} watch={watch} />
            <Box
                sx={{
                    width: "100%",
                    height: "100%",
                }}
            >
                <StripedDataGrid
                    apiRef={apiRef} // If custom props are attached to apiRef, need to set this in order to get them elsewhere; also
                    // this is required to be able to use apiRef passed elsewhere as prop from slotProps.
                    // Docs : When using the API object outside the Data Grid components, you need to initialize it
                    // using the useGridApiRef hook. You can then pass it to the Data Grid's apiRef prop:
                    sx={{
                        "& .MuiDataGrid-columnHeader": {
                            backgroundColor: lightBlue[50],
                        },
                        "& .MuiDataGrid-columnHeader .MuiDataGrid-sortButton": {
                            display: "none",
                        },
                        "& .MuiDataGrid-columnHeaderTitleContainerContent": {
                            // To show the badge entirely
                            overflow: "visible",
                        },
                    }}
                    columns={columns}
                    rows={data?.results ?? []}
                    getRowId={(row) => row.application_id}
                    loading={isLoading}
                    initialState={{
                        pagination: {
                            paginationModel: { page: 0, pageSize: 100 },
                        },
                    }}
                    sortingMode="server"
                    onSortModelChange={handleSortModelChange}
                    sortingOrder={["asc", "desc", "null"]}
                    showColumnVerticalBorder
                    showToolbar
                    //autoPageSize
                    slots={{
                        columnSortedAscendingIcon: null,
                        columnSortedDescendingIcon: null,
                        toolbar: ApplicationToolBar,
                    }}
                    slotProps={{
                        toolbar: {
                            sortHistory: sortHistory,
                            apiRef: apiRef,
                            filters: filters,
                            resetFilters: reset,
                            setFilterValue: setValue,
                        },
                        basePagination: {
                            material: { ActionsComponent: ActionsPagination },
                        },
                    }}
                    // Strip rows
                    getRowClassName={(params) =>
                        params.indexRelativeToCurrentPage % 2 === 0 ?
                            "odd"
                        :   "even"
                    }
                    paginationMode="server"
                    paginationModel={paginationModel}
                    onPaginationModelChange={setPaginationModel}
                    rowCount={rowCount}
                    pageSizeOptions={[5, 10, 20, 30, 100]}
                />
            </Box>
        </ApplicationDataGridContext.Provider>
    );
};
export default ApplicationsList;
