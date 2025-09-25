import { useEffect, useRef, useState } from "react";

/**
 * Hook to manage pagination sync between:
 *   - MUI DataGrid and paginationModel
 *   - URL query params (?page, ?page_size)
 *   - Server data (count)
 */
export function usePagination({
    data,
    searchParams,
    setSearchParams,
    defaultPageSize = 5,
}) {
    // Local state for DataGrid pagination
    const [paginationModel, setPaginationModel] = useState(() => {
        const pageFromUrl = searchParams.get("page");
        const pageSizeFromUrl = searchParams.get("page_size");

        return {
            // DataGrid is 0-based pagination whereas the url is 1-based.
            page: pageFromUrl ? Math.max(0, Number(pageFromUrl) - 1) : 0,
            pageSize:
                pageSizeFromUrl ? Number(pageSizeFromUrl) : defaultPageSize,
        };
    });

    const [rowCount, setRowCount] = useState(0);

    // Tracks the source of the pagination change
    // - "server"   → default on mount, should wait for server data : syncs once
    // - "user"     → DataGrid pagination UI interaction
    // - "browser"  → back/forward navigation or effect-driven sync
    const paginationModelChangeOriginRef = useRef("server");
    const hasSyncedOnceRef = useRef(false);

    const handlePaginationModelChange = (newModel) => {
        paginationModelChangeOriginRef.current = "user";
        setPaginationModel(newModel);
    };

    /**
     * One-time sync on mount but should wait until data is available (hence data deps)
     * - If server didn’t paginate → clear URL + reset paginationModel
     * - If URL missing pagination params      → inject defaults -> data would refetch
     * - Mark synced once → further syncs handled by continuous syncing effect
     */
    useEffect(() => {
        if (paginationModelChangeOriginRef.current !== "server") return;
        // Already did one-time sync → exit (guard because deps array includes data)
        if (hasSyncedOnceRef.current) return;
        if (!data) return; // wait until data is loaded

        const totalCount = data?.data?.count ?? 0;
        // Current pagination from url
        const page = searchParams.get("page");
        const pageSize = searchParams.get("page_size");

        // Case 1: Server didn't paginate or records fit on one page (not so mpuch records) → clear pagination infos if any
        if (!totalCount || totalCount <= paginationModel.pageSize) {
            if (!page && !pageSize) return; // Nothing to clean

            setSearchParams(
                (prev) => {
                    const next = new URLSearchParams(prev);
                    next.delete("page");
                    next.delete("page_size");
                    return next;
                },
                { replace: true }
            );

            // Reset the pagination model
            setPaginationModel({
                page: 0,
                pageSize: defaultPageSize,
            });

            // Mark the sync as done
            hasSyncedOnceRef.current = true;
            paginationModelChangeOriginRef.current = "browser";
            return;
        }

        // Case 2: Server paginating but URL incomplete → inject defaults
        if (!page || !pageSize) {
            setSearchParams(
                (prev) => {
                    const next = new URLSearchParams(prev);
                    next.set("page", (paginationModel.page + 1).toString());
                    next.set("page_size", paginationModel.pageSize.toString());
                    return next;
                },
                { replace: true }
            );
        }

        hasSyncedOnceRef.current = true;
        paginationModelChangeOriginRef.current = "browser";
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);

    /**
     * Continuous sync
     * Keeps paginationModel and URL in sync
     * depending on change origin:
     *  - "user"     → update URL from paginationModel
     *  - "browser"  → update paginationModel from URL
     */
    useEffect(() => {
        if (!hasSyncedOnceRef.current) return; // skip until mount sync (the first effect) is done
        if (!data) return;

        const totalCount = data?.data?.count ?? 0;
        if (!totalCount || totalCount <= paginationModel.pageSize) return;

        // current pagination from Url
        const page =
            searchParams.get("page") ?
                Math.max(0, Number(searchParams.get("page")) - 1)
            :   -1;

        const pageSize =
            searchParams.get("page_size") ?
                Number(searchParams.get("page_size"))
            :   paginationModel.pageSize;

        const currentUrlPagination = { page, pageSize };

        // If pagination differs (url and pagination model are out of sync) → resolve conflict based on origin
        if (currentUrlPagination.page !== paginationModel.page) {
            if (paginationModelChangeOriginRef.current === "user") {
                // User interaction with DataGrid → update the URL
                setSearchParams((prev) => {
                    const next = new URLSearchParams(prev);
                    next.set("page", (paginationModel.page + 1).toString());
                    next.set("page_size", paginationModel.pageSize.toString());
                    return next;
                });
            } else if (paginationModelChangeOriginRef.current === "browser") {
                // Browser navigation → update the pagination model
                setPaginationModel(currentUrlPagination);
            }

            paginationModelChangeOriginRef.current = "browser";
        }
    }, [paginationModel, searchParams, setSearchParams, data]);

    // Update rowCount from server response
    useEffect(() => {
        setRowCount((prev) => data?.data?.count ?? prev);
    }, [data]);

    return {
        paginationModel,
        handlePaginationModelChange,
        rowCount,
    };
}
