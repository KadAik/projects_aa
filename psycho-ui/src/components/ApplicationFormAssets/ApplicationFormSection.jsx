export default function ApplicationFormSection({
    title,
    children,
    applicationFormState,
    dispatchApplicationFormStateAction,
}) {
    const handlePreviousClick = () => {
        dispatchApplicationFormStateAction({
            type: "SET_PREVIOUS_SECTION",
        });
    };

    const handleNextClick = () => {
        dispatchApplicationFormStateAction({
            type: "SET_NEXT_SECTION",
        });
    };

    return (
        <section className="application-section">
            <h3>{title}</h3>
            {children}
            <hr />
            <div id="nextprev">
                <button
                    type="button"
                    onClick={handlePreviousClick}
                    disabled={applicationFormState.section === 1}
                >
                    ← Précédent
                </button>
                {applicationFormState.section <
                    applicationFormState.nbOfSections && (
                    <button type="button" onClick={handleNextClick}>
                        Suivant →
                    </button>
                )}
                {applicationFormState.section ===
                    applicationFormState.nbOfSections && (
                    <button type="submit">Soumettre</button>
                )}
            </div>
        </section>
    );
}
