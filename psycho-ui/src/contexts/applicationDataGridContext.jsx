import { createContext, useContext } from "react";

export const ApplicationDataGridContext = createContext(null);

export const useApplicationDataGridContext = () => {
    return useContext(ApplicationDataGridContext);
};
