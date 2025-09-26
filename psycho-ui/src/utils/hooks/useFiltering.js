import { isEqual } from "lodash";
import { useEffect, useMemo, useRef } from "react";
import { useForm, useWatch } from "react-hook-form";

export function useFiltering(
    initialFilterFormState,
    searchParams,
    setSearchParams
) {
    const initialFilterFromUrl = useMemo(
        () =>
            Object.fromEntries(
                [...searchParams.entries()].filter(
                    ([key]) => key in initialFilterFormState
                )
            ),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    ); // snapshot once on mount, helps keep history on component remount with some active filters

    const formMethods = useForm({
        defaultValues: {
            ...initialFilterFormState,
            ...initialFilterFromUrl,
        },
    });

    const { reset, getValues, setValue, register, control } = formMethods;

    // Store the latest form state to detect if subsequent changes to filters came from URL (back/forward nav) or form
    const previousFormStateRef = useRef({
        ...initialFilterFormState,
        ...initialFilterFromUrl,
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
        // Get current values from form and URL
        const currentFormValues = getValues();

        // Url may contains unrelated query params to filters like sort_by, page... so we filter them out
        // by whitelisting only the ones we care about
        const filtersFromUrl = Object.fromEntries(
            [...searchParams.entries()].filter(
                ([key]) => key in initialFilterFormState
            )
        );

        // Active form values (only truthy ones matter for query params)
        const activeFilters = Object.fromEntries(
            Object.entries(currentFormValues).filter(([, v]) => v)
        );

        // Check if form and URL are out of sync in terms of filters (should exclude sorting, pagination ...)
        const areFormAndUrlOutOfSync = !isEqual(activeFilters, filtersFromUrl);

        if (areFormAndUrlOutOfSync) {
            // Determine the source of the change to prevent infinite loops

            // Case 1: Change came from URL (browser navigation - back/forward) => should update the form
            // If previous form state matches current form state, it means the user
            // didn't change the form - the URL changed via navigation
            const changeCameFromUrl = isEqual(
                previousFormStateRef.current,
                currentFormValues
            ); // Is form state changed ?

            // Case 2: Change came from form (user interaction) => should update the url
            // If previous form state differs from current form state, it means
            // the user changed a form field.

            const changeCameFromForm = !changeCameFromUrl;

            if (changeCameFromUrl) {
                // URL changed via navigation → update form to match URL
                reset({ ...initialFilterFormState, ...filtersFromUrl });
            } else if (changeCameFromForm) {
                // Form changed by user → update URL to match form
                setSearchParams((prev) => {
                    const prevObj = Object.fromEntries(prev.entries());

                    // Keep only unrelated query params (sort_by,  etc.)
                    const unrelated = Object.fromEntries(
                        Object.entries(prevObj).filter(
                            // keep unrelated but drop pagination when filters change
                            ([k]) =>
                                !(k in initialFilterFormState) &&
                                k !== "page" &&
                                k !== "page_size"
                        )
                    );

                    // Replace filter params completely with current active filters
                    return new URLSearchParams({
                        ...activeFilters,
                        ...unrelated,
                    });
                });
            }
        }

        // Update the reference to track the current state for next comparison
        previousFormStateRef.current = getValues();
    }, [
        searchParams,
        reset,
        getValues,
        filters,
        setSearchParams,
        initialFilterFormState,
    ]);

    return {
        filters,
        reset,
        setValue,
        register,
        control,
    };
}
