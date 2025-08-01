

import HighSchoolDetails from "./HighSchoolDetails";
import UniversityDegreeDetails from "./UniversityDegreeDetails";
import { useFormDataContext, useFormDataContextSetter } from "../Contexts/FormDataContext";

export default function RFEducationalBackgroundContent(){

    const { personalHistory } = useFormDataContext();
    const degree = personalHistory?.degree || "";
    const dispatch = useFormDataContextSetter();

    function handleDegreeChange(e){
        dispatch({
            type: "SET_FIELD",
            section: "personalHistory",
            field: "degree",
            value: e.target.value,
        });
    }

    return(
        <>
            <p className="notice">Required fields are followed by <span aria-label="required">*</span></p>
            <div className="form-group row">
                <label htmlFor="degree">Niveau académique<strong><span aria-label="required"><sup>*</sup></span></strong>:</label>
                <select name="degree" id="degree" value={degree} required onChange={handleDegreeChange}>
                    <option value="" disabled hidden>Choose</option>
                    <option value="highSchool">Bac</option>
                    <option value="bachelor">Bachelor</option>
                    <option value="master">Master</option>
                    <option value="phd">PhD</option>
                </select>
            </div>
            
           
            <HighSchoolDetails />

            {/* Show university-related degrees */}
            {(degree === "bachelor" || degree === "master" || degree === "phd") && (<UniversityDegreeDetails degree={degree} />)}


        </>
    );
}