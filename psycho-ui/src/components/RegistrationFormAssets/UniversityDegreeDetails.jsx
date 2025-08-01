export default function UniversityDegreeDetails({degree}){
    return(
        <div className="degree-details">
            <h4>Informations sur {degree === "bachelor" ? "la Licence" : (degree === "master" ? "le Master" : "le Doctorat")}</h4>

            <div className="form-group row">
                <label htmlFor="university">Université<strong><span aria-label="required"><sup>*</sup></span></strong>:</label>
                <input type="text" id="university" name="university" required />
            </div>

            <div className="form-group row">
                <label htmlFor="field">Spécialisation<strong><span aria-label="required"><sup>*</sup></span></strong>:</label>
                <input type="text" id="field" name="field" required />
            </div>

            <div className="form-group row">
                <label htmlFor="average">Moyenne obtenue<strong><span aria-label="required"><sup>*</sup></span></strong>:</label>
                <input type="phone" id="master_average" name="average" required />
            </div>

        </div>
    );
}