import { useEffect, useMemo, useRef, useState } from "react";

import { GridActionsCellItem, useGridApiRef } from "@mui/x-data-grid";
import { alpha, Box, useTheme } from "@mui/material";

import ApplicationToolBar from "./Assets/ApplicationToolBar";
import { ApplicationDataGridContext } from "../../contexts/applicationDataGridContext";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import { Link, useSearchParams } from "react-router-dom";
import GavelOutlinedIcon from "@mui/icons-material/GavelOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { useApplications } from "../../shared/psychoApi/hooks";

import { useFilterSync } from "../../utils/hooks/useFilterSync";
import { useSortSync } from "../../utils/hooks/useSortSync";
import { sortableColumns } from "../../shared/psychoApi/applicationConfig";
import RenderHeader from "./Assets/RenderHeader";
import ActionsPagination from "./Assets/ActionsPagination";
import ApplicationSearchAndFilterBar from "./Assets/ApplicationSearchAndFilterBar";
import StripedDataGrid from "./Assets/StripedDataGrid";
import { isEqual, replace } from "lodash";

const initialFilterFormState = {
    status: "",
    degree: "",
    baccalaureate_series: "",
};

let renderCount = 0;

const ApplicationsList = () => {
    // Performance monitoring
    renderCount += 1;
    const renders = useRef(0);
    renders.current++;
    console.log("ApplicationList component render count is : ", renderCount);
    useEffect(() => {
        console.log("Render #", renders.current);
    });

    const theme = useTheme();

    const [rowCount, setRowCount] = useState(0);

    const [searchParams, setSearchParams] = useSearchParams();

    const [paginationModel, setPaginationModel] = useState(() => {
        // DRF is 1-based whereas DataGrid is 0-based style pagination.
        const pageFromUrl = searchParams.get("page");
        const pageSizeFromUrl = searchParams.get("page_size");

        return {
            page: pageFromUrl ? Math.max(0, Number(pageFromUrl) - 1) : 0,
            pageSize: pageSizeFromUrl ? Number(pageSizeFromUrl) : 5,
        };
    });

    const paginationModelChangeOriginRef = useRef("server"); // server, browser or user. The server value is used for on initial mount only.

    const apiRef = useGridApiRef();

    const handlePaginationModelChange = (newModel) => {
        paginationModelChangeOriginRef.current = "user";
        setPaginationModel(newModel);
    };

    // Filtering
    const { filters, reset, setValue, register, control } = useFilterSync(
        initialFilterFormState,
        searchParams,
        setSearchParams
    );

    // Sorting
    const { sortModel, sortHistory, handleSortModelChange } = useSortSync(
        searchParams,
        setSearchParams
    );

    const { data, isLoading } = useApplications({
        queryParams: Object.fromEntries(searchParams.entries()),
    });

    const hasSyncedOncePaginationRef = useRef(false);

    // On mount, we need to perform a one-time sync for the pagination
    useEffect(() => {
        // Only run this during the initial mount sync
        if (paginationModelChangeOriginRef.current !== "server") return;

        // Already did one-time sync → exit (guard because deps array includes data)
        if (hasSyncedOncePaginationRef.current) return;

        // Wait until data is loaded
        if (!data) return;

        // Current values from URL
        const page = searchParams.get("page");
        const pageSize = searchParams.get("page_size");

        // If the server didn’t paginate or if all records fit in one page → skip
        if (
            !data?.data?.count ||
            data?.data?.count <= paginationModel.pageSize
        ) {
            // If the server didn't paginate the response, we should remove pagination infos from the url if any
            if (!page && !pageSize) return; // No need to further process if no pagination info

            // Remove pagination info from URL
            setSearchParams(
                (prev) => {
                    const next = new URLSearchParams(prev);
                    next.delete("page");
                    next.delete("page_size");
                    return next;
                },
                { replace: true }
            );

            // Reset the pagination model as it is initialized from the url
            setPaginationModel({
                page: 0,
                pageSize: 5,
            });

            // Mark the sync as done
            hasSyncedOncePaginationRef.current = true;
            paginationModelChangeOriginRef.current = "browser";
            return;
        }

        // If the URL has no pagination info, inject it based on our model
        if (!page || !pageSize) {
            setSearchParams(
                (prev) => {
                    const next = new URLSearchParams(prev);

                    // DataGrid is 0-based, DRF is 1-based → add +1 for URL
                    next.set("page", (paginationModel.page + 1).toString());

                    // Always trust the frontend model for pageSize
                    next.set("page_size", paginationModel.pageSize.toString());

                    return next;
                },
                { replace: true }
            );
        }

        // Mark the sync as done
        hasSyncedOncePaginationRef.current = true;

        // From now on, pagination changes are considered to come from browser nav / user
        paginationModelChangeOriginRef.current = "browser";
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);

    // Syncing pagination
    // Syncing pagination
    useEffect(() => {
        if (!hasSyncedOncePaginationRef.current) return; // skip until mount sync is done
        if (!data) return; // wait until data is loaded

        // If the server didn't paginate or all records fit in one page
        if (!data?.data?.count || data?.data?.count <= paginationModel.pageSize)
            return; // no syncing needed

        // Current pagination from url
        const page =
            searchParams.get("page") ?
                Math.max(0, Number(searchParams.get("page")) - 1)
            :   -1;
        const pageSize =
            searchParams.get("page_size") ?
                Number(searchParams.get("page_size"))
            :   paginationModel.pageSize;

        const currentUrlPagination = { page, pageSize };

        console.log({ currentUrlPagination, paginationModel });

        // Are url and pagination model out of sync ?
        if (currentUrlPagination.page !== paginationModel.page) {
            if (paginationModelChangeOriginRef.current === "user") {
                // User clicked DataGrid -> sync the URL
                setSearchParams((prev) => {
                    const next = new URLSearchParams(prev);
                    next.set("page", (paginationModel.page + 1).toString());
                    next.set("page_size", paginationModel.pageSize.toString());
                    return next;
                });
            } else if (paginationModelChangeOriginRef.current === "browser") {
                // Browser nav -> sync the model
                setPaginationModel(currentUrlPagination);
            }
            paginationModelChangeOriginRef.current = "browser";
        }
    }, [paginationModel, searchParams, setSearchParams, data]);

    useEffect(() => {
        setRowCount((prev) => (data?.data?.count ? data?.data?.count : prev));
    }, [data]);

    // const { data, isLoading } = useApplications({
    //     filters,
    //     sort_by: sortModelFromVerboseToCompactStyle(Object.values(sortModel)),
    //     pagination: {
    //         page: paginationModel.page + 1,
    //         pageSize: paginationModel.pageSize,
    //     },
    // });

    // Will be used to pass down some props to helpers or component that will be interacting with the data grid.
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
                minWidth: 165,
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
                minWidth: 165,
                type: "date",
                valueGetter: (value) => value && new Date(value),
                valueFormatter: (value) =>
                    value &&
                    value.toLocaleDateString("fr-FR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                    }),
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
                        sortable={sortableColumns.includes(item.field)}
                    />
                ),
            })),
        [columns_]
    );

    const toolbarProps = useMemo(
        () => ({
            sortHistory,
            setSortModel: apiRef.current?.setSortModel,
            filters,
            clearFilters: reset,
            setFilterValue: setValue,
            rowCount,
            setSearchParams,
        }),
        //eslint-disable-next-line react-hooks/exhaustive-deps
        [sortHistory, filters, reset, setValue, setSearchParams, rowCount]
    );

    return (
        <ApplicationDataGridContext.Provider value={providerValue}>
            <ApplicationSearchAndFilterBar
                register={register}
                control={control}
            />
            <Box
                sx={{
                    backgroundColor: "background.default",
                }}
            >
                <StripedDataGrid
                    apiRef={apiRef} // If custom props are attached to apiRef, need to set this in order to get them elsewhere; also
                    // this is required to be able to use apiRef passed elsewhere as prop from slotProps.
                    // Docs : When using the API object outside the Data Grid components, you need to initialize it
                    // using the useGridApiRef hook. You can then pass it to the Data Grid's apiRef prop:
                    sx={{
                        "& .MuiDataGrid-cell": {
                            py: 1.5,
                        },
                        "& .MuiDataGrid-row": {
                            transition: "background-color 0.2s ease-in-out",
                            "&:hover": {
                                backgroundColor: alpha(
                                    theme.palette.primary.main,
                                    0.04
                                ),
                            },
                        },
                        //height: "calc(100vh - 200px)",
                        //width: "100%",
                    }}
                    columns={columns}
                    rows={data?.data?.results ?? []}
                    getRowId={(row) => row.application_id}
                    loading={isLoading}
                    initialState={{
                        pagination: {
                            paginationModel: { page: 0, pageSize: 5 },
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
                        toolbar: toolbarProps,
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
                    onPaginationModelChange={handlePaginationModelChange}
                    rowCount={rowCount}
                    pageSizeOptions={[5, 10, 20, 30, 100]}
                    localeText={{
                        noRowsLabel: "Aucune candidature trouvée",
                        noResultsOverlayLabel: "Aucun résultat",
                        errorOverlayDefaultLabel: "Une erreur est survenue.",
                        toolbarColumns: "Colonnes",
                        toolbarColumnsLabel: "Sélectionner les colonnes",
                        toolbarFilters: "Filtres",
                        toolbarFiltersLabel: "Afficher les filtres",
                        toolbarFiltersTooltipHide: "Masquer les filtres",
                        toolbarFiltersTooltipShow: "Afficher les filtres",
                        toolbarQuickFilterPlaceholder: "Rechercher…",
                        toolbarExport: "Exporter",
                        toolbarExportLabel: "Exporter",
                        toolbarExportCSV: "Télécharger en CSV",
                    }}
                />
            </Box>
        </ApplicationDataGridContext.Provider>
    );
};
export default ApplicationsList;
