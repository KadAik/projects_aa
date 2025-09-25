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
import { useFilter } from "../../utils/hooks/useFilter";
import { useSort } from "../../utils/hooks/useSort";
import { sortableColumns } from "../../shared/psychoApi/applicationConfig";
import RenderHeader from "./Assets/RenderHeader";
import ActionsPagination from "./Assets/ActionsPagination";
import ApplicationSearchAndFilterBar from "./Assets/ApplicationSearchAndFilterBar";
import StripedDataGrid from "./Assets/StripedDataGrid";
import { usePagination } from "../../utils/hooks/usePagination";

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

    const [searchParams, setSearchParams] = useSearchParams();

    const apiRef = useGridApiRef();

    // Filtering
    const { filters, reset, setValue, register, control } = useFilter(
        initialFilterFormState,
        searchParams,
        setSearchParams
    );

    // Sorting
    const { sortModel, sortHistory, handleSortModelChange } = useSort(
        searchParams,
        setSearchParams
    );

    const { data, isLoading } = useApplications({
        queryParams: Object.fromEntries(searchParams.entries()),
    });

    // Pagination
    const { paginationModel, handlePaginationModelChange, rowCount } =
        usePagination({
            data,
            searchParams,
            setSearchParams,
        });

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
                field: "actions",
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
                key: item.field, // React will complain about unique key in list if not provided (DataGrid uses it)
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
                            paginationModel: paginationModel,
                        },
                    }}
                    sortingMode="server"
                    onSortModelChange={handleSortModelChange}
                    sortingOrder={["asc", "desc", "null"]}
                    showColumnVerticalBorder
                    showToolbar
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
