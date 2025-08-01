import { createContext, useContext } from "react";

export const CurrentPageContext = createContext("home");

export function useCurrentPage(){
    return useContext(CurrentPageContext);
}

export const CurrentPageSetterContext = createContext(null);

export function useCurrentPageSetter(){
    return useContext(CurrentPageSetterContext);
}