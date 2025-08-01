import { useFormDataContext, useFormDataContextSetter } from "../Contexts/FormDataContext";


export default function HighSchoolDetails(){

    const dispatch = useFormDataContextSetter();
    const formData = useFormDataContext();
    const { highSchool } = formData;

    function handleInputChange(e) {
        const { name, value } = e.target;

        dispatch({
            type: "SET_FIELD",
            section: "highSchool",
            field: name,
            value: value,
        });
    }

    return(
        <div className="degree-details">
            <h4>Informations sur le baccalauréat</h4>

            <div className="form-group row">
                <label htmlFor="baccalaureate-serie">Série de Baccalauréat<strong><span aria-label="required"><sup>*</sup></span></strong>:</label>
                <select name="baccalaureateSerie" id="baccalaureate-serie" required value={highSchool.baccalaureateSerie} onChange={handleInputChange}>
                    <option value="" disabled hidden>Choose</option>
                    <option value="Bac_C">BAC C</option>
                    <option value="Bac_D">BAC D</option>
                    <option value="BAc_E">BAC E</option>
                    <option value="Bac_F">BAC F</option>
                </select>
            </div>

            <div className="form-group row">
                <label htmlFor="baccalaureate-session">Session de baccalauréat<strong><span aria-label="required"><sup>*</sup></span></strong>:</label>
                <input type="month" id="baccalaureate-session" name="baccalaureateSession" value={highSchool.baccalaureateSession} onChange={handleInputChange} required />
            </div>

            <div className="form-group row">
                <label htmlFor="baccalaureate-average">Moyenne obtenue<strong><span aria-label="required"><sup>*</sup></span></strong>:</label>
                <input type="phone" id="baccalaureate-average" name="average" min={5} max={20} value={highSchool.average} onChange={handleInputChange} required />
            </div>
                
        </div>
    );
}