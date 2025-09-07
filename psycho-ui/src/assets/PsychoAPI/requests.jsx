import {
    QueryClient,
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";
import { fetchData, postData } from "../../utils/crud";

const ENDPOINT = "http://127.0.0.1:8000/psycho/api/applications";

export function useApplications(queryParams = {}, options = {}) {
    const applicationQuery = useQuery({
        queryKey: ["applications", JSON.stringify(queryParams)],
        queryFn: () => fetchData(ENDPOINT, queryParams),
        ...options,
    });
    return applicationQuery;
}

export function useCreateApplication({ applicationDetails }) {
    const queryClient = useQueryClient();
    const applicationMutation = useMutation({
        mutationFn: () => postData(applicationDetails, ENDPOINT),
        onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: ["applications"] });
        },
    });
    return applicationMutation;
}
