

export default function RegistrationFormSection({title, children, formState, dispatchFormState}){

    const handlePreviousClick = () => {
        dispatchFormState({
            type: "SET_PREVIOUS"
        })
    };

    const handleNextClick = () => {
        dispatchFormState({
            type: "SET_NEXT"
        })
    };

    return(
        <section className="registration-section">
            <h3>{title}</h3>
            {children}
            <hr />
            <div id="nextprev">
                <button type="button" onClick={handlePreviousClick} disabled={formState.stage === 1}>← Précédent</button>
                {formState.stage < 3 && <button type="button" onClick={handleNextClick}>Suivant →</button>}
                {formState.stage === 3 && <button type="submit">Soumettre</button>}
            </div>

        </section>
    );
}