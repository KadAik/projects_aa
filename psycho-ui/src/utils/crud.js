import axios from "axios";

export async function postData(recordDetails, destination) {
    try {
        const response = await axios.post(destination, recordDetails);
        const contentType = response.headers["content-type"];
        return contentType === "application/json" ?
                response.data
            :   response.statusText;
    } catch (e) {
        const errorData =
            e.response?.status === 400 ? e.response.data : e.toJSON();
        const err = new Error("Data submission unsuccessful");
        err.cause = errorData;
        throw err;
    }
}

export async function fetchData(source, queryParams = {}) {
    // Expected queryParams structure: { filters: { key: value }, sort_by: [fields] }
    // Example: { filters: { status: "Pending" }, sort_by: ["date_submitted"] }
    // For descending order, use: { sortBy: ["-date_submitted"] }
    const {
        filters = {},
        sort_by = [],
        pagination = {},
        tracking_id = "",
    } = queryParams;

    // Filters
    let queryString = new URLSearchParams();
    for (const [key, value] of Object.entries(filters)) {
        if (value !== "") {
            queryString.append(key, value);
        }
    }
    // Sorting
    if (sort_by.length > 0) {
        queryString.set("sort_by", sort_by);
    }

    // Pagination
    const { page = null, pageSize = null } = pagination;
    if (page) {
        queryString.append("page", page);
    }
    if (pageSize) {
        queryString.append("page_size", pageSize);
    }

    // Tracking
    if (tracking_id) {
        queryString.append("tracking_id", tracking_id);
    }

    queryString = queryString.toString();

    console.log("Fetching data from:", source, "with query:", queryString);

    try {
        const from = queryString ? `${source}?${queryString}` : source;
        const response = await axios.get(from);
        const contentType = response.headers["content-type"];
        return contentType === "application/json" ?
                response.data
            :   response.statusText;
    } catch (e) {
        console.error("Error fetching data:", e);
        const contentType = e.response?.headers["content-type"];
        const errorData =
            contentType === "application/json" ? e.response?.data : e.toJSON();
        const err = new Error("Data fetching unsuccessful");
        err.cause = errorData;
        throw err;
    }
}
