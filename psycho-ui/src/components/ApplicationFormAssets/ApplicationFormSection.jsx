import { useEffect, useRef } from "react";
import { useFormContext } from "react-hook-form";

const ApplicationFormSection = ({
    title,
    children,
    applicationFormState,
    dispatchApplicationFormStateAction,
}) => {
    const {
        trigger,
        getValues,
        unregister,
        formState: { isSubmitting },
    } = useFormContext();

    const handlePreviousClick = () => {
        dispatchApplicationFormStateAction({
            type: "SET_PREVIOUS_SECTION",
        });
    };

    const handleNextClick = async () => {
        const currentSectionName = applicationFormState.section.name;

        let toValidate = ["personalHistory"];

        if (currentSectionName === "educationalBackground") {
            toValidate = ["degree", "highSchool"];
            if (["bachelor", "master", "phd"].includes(getValues("degree"))) {
                toValidate.push("university");
            }
        }
        const isValid = await trigger(toValidate, {
            shouldFocus: true,
        });

        if (isValid) {
            dispatchApplicationFormStateAction({
                type: "SET_NEXT_SECTION",
            });
        }
    };

    const degree = getValues("degree");

    // If the degree is highSchool, we need to unregister university fields so handleSubmit
    // won't validate those fields again (the validation there will fail).
    useEffect(() => {
        if (degree === "highSchool" || degree === "") {
            unregister([
                "university.name",
                "university.fieldOfStudy",
                "university.average",
            ]);
        }
    }, [unregister, degree]);

    return (
        <section className="application-section">
            <h3>{title}</h3>
            {children}
            <hr />
            <div id="nextprev">
                <button
                    type="button"
                    onClick={handlePreviousClick}
                    disabled={applicationFormState.section.index === 1}
                >
                    ← Précédent
                </button>
                {applicationFormState.section.index <
                    applicationFormState.nbOfSections && (
                    <button type="button" onClick={handleNextClick}>
                        Suivant →
                    </button>
                )}
                {applicationFormState.section.index ===
                    applicationFormState.nbOfSections && (
                    <button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Submitting..." : "Soumettre"}
                    </button>
                )}
            </div>
        </section>
    );
};

export default ApplicationFormSection;
