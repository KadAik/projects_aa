import { useRef } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

/**
 * Detect if the current navigation was caused by a browser's
 * back or forward button.
 *
 * @returns {boolean} `true` if the navigation type is 'POP' and the location key has changed,
 * `false` otherwise.
 */
export function useIsBrowserNavigation() {
    const location = useLocation();
    const navigationType = useNavigationType();
    const previousLocationRef = useRef(location);

    return (
        navigationType === "POP" &&
        previousLocationRef.current.key !== location.key
    );
}
