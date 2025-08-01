import { createContext, useContext } from "react";


export const FormDataContext = createContext(null);

export function useFormDataContext(){
    return useContext(FormDataContext);
}

export const FormDataContextSetter = createContext(null);

export function useFormDataContextSetter(){
    return useContext(FormDataContextSetter);
}