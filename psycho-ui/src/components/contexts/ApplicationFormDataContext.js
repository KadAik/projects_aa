import { createContext, useContext } from "react";

export const ApplicationFormDataContext = createContext(null);

export function useApplicationFormDataContext() {
    return useContext(ApplicationFormDataContext);
}

export const ApplicationFormDataContextSetter = createContext(null);

export function useApplicationFormDataContextSetter() {
    return useContext(ApplicationFormDataContextSetter);
}
