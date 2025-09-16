import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

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

import ApplicationSearchAndFilterBar from "../../components/DashboardPagesAssets/ApplicationSearchAndFilterBar";
import { set, useForm, useWatch } from "react-hook-form";
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
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import GavelOutlinedIcon from "@mui/icons-material/GavelOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { useApplications } from "../../shared/psychoApi/hooks";
import { cloneDeep, debounce, isEqual } from "lodash";

const filtersInitialState = {
    status: "",
    degree: "",
    baccalaureate_series: "",
};

function sortModelFromVerboseToCompactStyle(sortModelVerbose) {
    // Example transform [{ field: "fieldName", sort: "asc" }] to ["fieldName"] or
    // [{ field: "fieldName", sort: "desc" }] to ["-fieldName"]
    return sortModelVerbose
        .filter((item) => item.sort) // keep only items that have a sort defined
        .map((item) => (item.sort === "desc" ? `-${item.field}` : item.field));
}

const SortIcon = React.memo(function SortIcon({ field }) {
    const { sortHistory = [], sortModel = {} } =
        useApplicationDataGridContext();
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
});

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

const RenderHeader = React.memo(({ headerName, field }) => (
    <Stack direction="row">
        <Typography variant="body1" fontWeight="bold">
            {headerName} &nbsp;
        </Typography>
        {sortableColumns.includes(field) && <SortIcon field={field} />}
    </Stack>
));

const sortableColumns = [
    "first_name",
    "last_name",
    "date_submitted",
    "status",
    "baccalaureate_series",
];

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

let renderCount = 0;

const ApplicationsList = () => {
    // Performance monitoring
    renderCount += 1;
    const renders = useRef(0);
    renders.current++;
    useEffect(() => {
        console.log("Render #", renders.current);
    });
    console.log("ApplicationList component render count is : ", renderCount);
    // For multiple fields sorting
    const [ctrlPressed, setCtrlPressed] = useState(false);

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

    const [searchParams, setSearchParams] = useSearchParams({});

    const debouncedSetSearchParams = useCallback(
        debounce((params) => {
            setSearchParams(params, { replace: false });
        }, 300),
        []
    );

    // Filtering

    // Runs once on mount
    const filtersInitialFromUrl = useMemo(
        () => Object.fromEntries(searchParams.entries()),
        []
    );

    const { register, watch, reset, setValue, getValues, control } = useForm({
        defaultValues: { ...filtersInitialState, ...filtersInitialFromUrl },
    });

    // Store the latest form state to detect if changes came from URL (back/forward nav) or form
    const previousFormStateRef = useRef({
        ...filtersInitialState,
        ...filtersInitialFromUrl,
    });

    // The purpose is actually to rerender the component on form changes as we are not submitting, just reading values
    // But we need some optimization to avoid rerender on object reference changes during render
    const { status, degree, baccalaureate_series } = useWatch({ control });

    // We stabilize filters
    const filters = useMemo(
        () => ({ status, degree, baccalaureate_series }),
        [status, degree, baccalaureate_series]
    );

    // Sync URL with filter form state and vice-versa
    useEffect(() => {
        console.log("Filters effect running ...");
        const currentFormValues = getValues(); // or filters
        const filtersFromUrl = Object.fromEntries(searchParams.entries());
        // Active form values (only truthy ones matter for query params)
        const activeFilters = Object.fromEntries(
            Object.entries(currentFormValues).filter(([, v]) => v)
        );

        // If URL differs from form state, need to sync both
        if (!isEqual(activeFilters, filtersFromUrl)) {
            // Only reset if the change didn't originate from the form itself (back/forward nav)
            // (prevents infinite loops if form changes trigger URL update which then triggers form reset)
            // 1. URL changes -> update form.
            if (isEqual(previousFormStateRef.current, currentFormValues)) {
                reset(filtersFromUrl);
                console.log("Form state updated from URL params.");
            }
            // And the change originates from the form itself (on filters click) : previousRef differs from current form state
            // 2. Form changes -> update URL.
            else {
                debouncedSetSearchParams(activeFilters); // Debouncing avoids excessive URL updates during typing
                console.log("URL params updated from form state.");
            }
        }
        // Update the ref *after* all checks and potential updates to keep it in sync with current situation
        previousFormStateRef.current = getValues();
    }, [searchParams, reset, getValues, debouncedSetSearchParams, filters]);

    /*// 1. Sync URL if form is changed by FORM interaction
    useEffect(() => {
        const filtersFromUrl = Object.fromEntries(searchParams.entries());
        console.log("a. Filters from url : ", filtersFromUrl);
        console.log("b. Active filters : ", activeFilters);

        if (!isEqual(activeFilters, filtersFromUrl)) {
            // url and form are not in sync
            console.log(
                "c. Active filters and url Filters are not equal, step 1 from setSearchParams"
            );
            console.log(
                "d. Previous state from ref is : ",
                previousFilterFormState.current
            );
            // Does the change originated from url navigation or form interaction
            if (!isEqual(previousFilterFormState.current, filters)) {
                console.log(
                    "e. Previous state differs from filters, setting searchParams..."
                );
                //previousFilterFormState.current = cloneDeep(filters);
                debouncedSetSearchParams(activeFilters);
            }
        }
    }, [activeFilters, searchParams, setSearchParams]);

    // 2. Sync form if url is changed by back/forth navigation
    useEffect(() => {
        const filtersFromUrl = Object.fromEntries(searchParams.entries());
        const newValues = { ...filtersInitialState, ...filtersFromUrl };

        console.log("1. Filters from url => : ", newValues);
        console.log("2. Actual form state : ", getValues());
        console.log(
            "3. Previous state with useRef : ",
            previousFilterFormState.current
        );

        if (!isEqual(getValues(), newValues)) {
            console.log(
                "4. Current form state differs from newValues, one step to reset"
            );
            if (isEqual(previousFilterFormState.current, filters))
                console.log(
                    "5. Previous state by ref is equal to filters => change from url, resetting..."
                );
            //previousFilterFormState.current = cloneDeep(newValues);
            reset(newValues);
        }
    }, [searchParams, reset, getValues, filters]);

    // 3. Update the ref AFTER either effect changes form state
    useEffect(() => {
        previousFilterFormState.current = getValues();
    }, [filters, searchParams, getValues]);
    */

    const { data, isLoading } = useApplications({
        queryParams: Object.fromEntries(searchParams.entries()),
    });

    console.log("The pagination model is : ", paginationModel);

    // const { data, isLoading } = useApplications({
    //     filters,
    //     sort_by: sortModelFromVerboseToCompactStyle(Object.values(sortModel)),
    //     pagination: {
    //         page: paginationModel.page + 1,
    //         pageSize: paginationModel.pageSize,
    //     },
    // });

    useEffect(() => {
        setRowCount((prev) =>
            data?.data?.count !== undefined ? data?.data?.count : prev
        );
    }, [data]);

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
                    <RenderHeader
                        headerName={item.headerName}
                        field={item.field}
                    />
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
                    rows={data?.data?.results ?? []}
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
                            setSortModel: apiRef.current?.setSortModel,
                            filters: filters,
                            clearFilters: reset,
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
