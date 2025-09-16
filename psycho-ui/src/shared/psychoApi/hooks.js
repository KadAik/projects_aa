import { get } from "../../utils/requests";
import { APPLICATIONS_API_ENDPOINT } from "./applicationConfig";

import { useQuery } from "@tanstack/react-query";

export function useApplications({ uri = "", queryParams = {}, options = {} }) {
    // Usage: useApplications("/endpoint", { status: "active", page: 1 })
    const queryString = new URLSearchParams(queryParams).toString();
    const fullUrl = `${APPLICATIONS_API_ENDPOINT}${uri}${
        queryString ? `?${queryString}` : ""
    }`;

    return useQuery({
        queryKey: ["applications", uri, queryParams],
        queryFn: () => get(fullUrl),
        ...options,
    });
}

// Usage: useApplications("/endpoint", { status: "active", page: 1 })
