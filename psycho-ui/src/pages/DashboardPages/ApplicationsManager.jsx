import React, { useEffect, useMemo, useState } from "react";

import { DataGrid } from "@mui/x-data-grid";
import { Box } from "@mui/material";
import { useApplications } from "../../assets/PsychoAPI/requests";
import ApplicationSearchAndFilterBar from "../../components/DashboardPagesAssets/ApplicationSearchAndFilterBar";
import { useForm } from "react-hook-form";

function sortModelFromVerboseToCompactStyle(sortModelVerbose) {
    // Example transform [{ field: "fieldName", sort: "asc" }] to ["fieldName"] or
    // [{ field: "fieldName", sort: "desc" }] to ["-fieldName"]
    return sortModelVerbose
        .filter((item) => item.sort) // keep only items that have a sort defined
        .map((item) => (item.sort === "desc" ? `-${item.field}` : item.field));
}

const columns = [
    {
        field: "rowNumber",
        headerName: "#",
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
        headerName: "First Name",
        valueGetter: (value, row) => row.applicant?.first_name,
    },
    {
        field: "last_name",
        headerName: "Last Name",
        valueGetter: (value, row) => row.applicant?.last_name,
    },
    {
        field: "date_submitted",
        headerName: "Date Submitted",
        type: "date",
        valueGetter: (value) => value && new Date(value),
        valueFormatter: (value) => value && value.toDateString(),
    },
    {
        field: "status",
        headerName: "Status",
        type: "singleSelect",
        valueOptions: ["Pending", "Incomplete", "Accepted", "Rejected"],
    },
    { field: "tracking_id", headerName: "Tracking Number" },
];

const filtersInitialState = {
    status: "",
    degree: "",
    baccalaureateSeries: "",
};

const ApplicationsManager = () => {
    // For multiple fields sorting
    const [ctrlPressed, setCtrlPressed] = useState(false);
    const { register, watch } = useForm({
        defaultValues: filtersInitialState,
    });

    const [sortModel, setSortModel] = useState({}); // sortModel should be an array of objects, but using {}
    // is just a workaround as useApplication is already getting an array

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
        // We will first transform the sort model from [{field: fieldName, sort: asc|desc|null}}, {...}] to
        //  [{field: {field: fieldName, sort: asc|desc|null}}, {...}] in order to facilitate handling (to avoid duplicates fields)
        const newSortModel_ = {};
        newSortModel.forEach((model) => {
            newSortModel_[model.field] = model;
        }); // Hence when encountering the same field the second time for reverse order, we can easily overwritte the previous.

        console.log("Sort model changed:", newSortModel_);
        // If Ctrl key is pressed when the event occurs, append to existing sort
        if (ctrlPressed) {
            console.log("Old sort model is : ", sortModel);
            console.log("Ctrl key down should set : ", {
                ...sortModel,
                ...newSortModel_,
            });
            setSortModel({ ...sortModel, ...newSortModel_ });
        }
        // Otherwise, replace the sort
        else {
            setSortModel(newSortModel_);
        }
    };

    return (
        <>
            <ApplicationSearchAndFilterBar register={register} watch={watch} />
            <Box sx={{ width: "100%", height: "100%" }}>
                <DataGrid
                    columns={columns}
                    rows={data ?? []}
                    getRowId={(row) => row.application_id}
                    loading={isLoading}
                    sortingMode="server"
                    onSortModelChange={handleSortModelChange}
                    showColumnVerticalBorder
                    showToolbar
                    autoPageSize
                    //initialState={{ sorting: { sortModel: sortModel_ } }}

                    //checkboxSelection
                />
            </Box>
        </>
    );
};
export default ApplicationsManager;
