import { useEffect, useRef, useState } from "react";
import {
    sortModelFromCompactToVerboseStyle,
    sortModelFromVerboseToCompactStyle,
} from "../utils";
import { isEqual } from "lodash";

// Sort cycle order
const sortCycle = ["asc", "desc", "null"];

const syncSortModelFromUrl = ({
    urlSortParamArray,
    setSortModel,
    setSortHistory,
}) => {
    if (urlSortParamArray.length === 0) {
        //reset the sort
        setSortModel({});
        setSortHistory([]);
        return;
    }
    const verboseSortModel =
        sortModelFromCompactToVerboseStyle(urlSortParamArray);

    const newSortModel = {};
    const newSortHistory = verboseSortModel.map((sortItem) => {
        newSortModel[sortItem.field] = sortItem;
        return sortItem.field;
    });

    setSortModel(newSortModel);
    setSortHistory(newSortHistory);
};

const syncUrlFromSortModel = ({ compactSortModel, setSearchParams }) => {
    setSearchParams(
        (prevSearchParams) => {
            if (compactSortModel.length === 0) {
                prevSearchParams.delete("sort_by");
            } else {
                prevSearchParams.set("sort_by", compactSortModel);
            }
            return prevSearchParams;
        },
        { replace: false }
    );
};

export function useSorting(searchParams, setSearchParams) {
    // For multiple fields sorting
    const [ctrlPressed, setCtrlPressed] = useState(false);
    // sortModel struct eg. : {first_name: {field: "first_name", sort: "asc"}, date_submitted: {field: "date_submitted", sort: "desc"}}
    const [sortModel, setSortModel] = useState({});

    const [sortHistory, setSortHistory] = useState([]); // Keep track of field subject to sort in LIFO order

    const sortModelChangeOriginRef = useRef("browser"); // user or browser

    // Attach listener for Ctrl key press
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

    // Sync sortModel and Url.
    useEffect(() => {
        const currentSortFromUrl = searchParams.getAll("sort_by") || []; // beware, if ?sort_by=last_name%2Cdate_submitted
        // => getAll returns ['last_name,date_submitted'], an array of one element ; in such a case need to split by ','
        // in order to match the compactSortModel array.
        const currentSortFromUrlArray =
            (
                currentSortFromUrl.length > 0 &&
                currentSortFromUrl[0]?.includes(",")
            ) ?
                currentSortFromUrl[0].split(",")
            :   currentSortFromUrl;

        const compactSortModel = sortModelFromVerboseToCompactStyle(
            Object.values(sortModel)
        ); // array like e.g ['first_name', '-date_submitted']
        console.log("Current sort model in compact style : ", compactSortModel);

        const areSortModelAndUrlOutOfSync = !isEqual(
            currentSortFromUrlArray,
            compactSortModel
        );

        if (areSortModelAndUrlOutOfSync) {
            // If the change came from the user (applying a sort : sortModel changes) => update the url
            const shouldUpdateUrl = sortModelChangeOriginRef.current === "user";
            // If the change originated from the browser (back/forward navigation : searchParams changes) => update the sortModel
            const shouldUpdateSortModel =
                sortModelChangeOriginRef.current === "browser";

            if (shouldUpdateSortModel) {
                syncSortModelFromUrl({
                    urlSortParamArray: currentSortFromUrlArray,
                    setSortModel,
                    setSortHistory,
                });
            } else if (shouldUpdateUrl) {
                syncUrlFromSortModel({ compactSortModel, setSearchParams });
            }

            sortModelChangeOriginRef.current = "browser";
        }
    }, [sortModel, setSearchParams, searchParams]);

    // Handling sortModel change event
    const handleSortModelChange = (newSortModel) => {
        sortModelChangeOriginRef.current = "user";
        // We will be keeping sortModel as : {field: {field: fieldName, sort: asc|desc|null}, {...}}
        // in order to facilitate handling (to avoid duplicates fields)
        // Hence when encountering the same field the second time for reverse order, we can easily overwrite the previous.
        if (!newSortModel.length) {
            // empty array
            // reset the sort
            setSortModel({});
            setSortHistory([]);
            return;
        }

        const { field } = newSortModel[0]; // Mui DataGrid sends one item array;

        // DataGrid community is stateless per field, thus when Ctrl+click back on first_name for example, the grid
        // doesn’t remember it previously is asc/desc/null
        // — it just starts its cycle again (asc → desc → null) as if it was a fresh column.
        // Thus don't rely on DataGrid to get the correct next sort => manually cycle sort state based on previous value

        // We are using custom logic to track sort cycle.

        const prevSort = sortModel[field]?.sort ?? "null";
        const nextSort =
            sortCycle[(sortCycle.indexOf(prevSort) + 1) % sortCycle.length];

        // If Ctrl key is pressed when the event occurs, append to existing sort (multiple sorting)
        if (ctrlPressed) {
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
            if (nextSort === "null") {
                setSortModel({});
                setSortHistory([]);
            } else {
                setSortModel({ [field]: { field, sort: nextSort } });
                setSortHistory([field]);
            }
        }
    };

    return {
        sortModel,
        sortHistory,
        handleSortModelChange,
    };
}
