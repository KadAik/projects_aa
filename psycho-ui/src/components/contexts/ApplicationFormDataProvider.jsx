import { useReducer } from "react";
import {
    ApplicationFormDataContext,
    ApplicationFormDataContextSetter,
} from "./ApplicationFormDataContext";
import applicationFormDataReducer from "../reducers/applicationFormDataReducer";

import { initialApplicationFormData } from "../ApplicationFormAssets/aplicationFormConfig";

const ApplicationFormDataProvider = ({ children }) => {
    const [applicationFormData, dispatchApplicationFormDataAction] = useReducer(
        applicationFormDataReducer,
        initialApplicationFormData
    );

    return (
        <ApplicationFormDataContext.Provider value={applicationFormData}>
            <ApplicationFormDataContextSetter.Provider
                value={dispatchApplicationFormDataAction}
            >
                {children}
            </ApplicationFormDataContextSetter.Provider>
        </ApplicationFormDataContext.Provider>
    );
};

export default ApplicationFormDataProvider;
