import { useFormContext } from "react-hook-form";
import HighSchoolDetails from "./HighSchoolDetails";
import UniversityDegreeDetails from "./UniversityDegreeDetails";
import { useEffect } from "react";

export default function EducationalBackgroundContent() {
    const {
        register,
        watch,
        unregister,
        clearErrors,
        formState: { errors },
    } = useFormContext();

    const degree = watch("degree") || "";

    // If the degree is highSchool, we need to unregister university fields so handleSubmit
    // won't validate those fields again (the validation there will fail).
    useEffect(() => {
        if (degree === "highSchool" || degree === "") {
            unregister([
                "university.name",
                "university.fieldOfStudy",
                "university.average",
            ]);
            // Clear errors manually
            clearErrors([
                "university.name",
                "university.fieldOfStudy",
                "university.average",
            ]);
        }
    }, [unregister, degree, clearErrors]); // Add clearErrors to dependencies

    return (
        <>
            <p className="notice">
                Required fields are followed by{" "}
                <span aria-label="required">*</span>
            </p>
            <div className="form-group row">
                <label htmlFor="degree">
                    Niveau académique
                    <strong>
                        <span aria-label="required">
                            <sup>*</sup>
                        </span>
                    </strong>
                    :
                </label>
                <div className="input-wrapper">
                    <select
                        id="degree"
                        {...register("degree")}
                        className={errors.degree ? "error" : ""}
                    >
                        <option value="" disabled hidden>
                            Choose
                        </option>
                        <option value="highSchool">Bac</option>
                        <option value="bachelor">Bachelor</option>
                        <option value="master">Master</option>
                        <option value="phd">PhD</option>
                    </select>
                    <p className="error-message">{errors.degree?.message}</p>
                </div>
            </div>

            <HighSchoolDetails />

            {/* Show university-related degrees */}
            {(degree === "bachelor" ||
                degree === "master" ||
                degree === "phd") && (
                <UniversityDegreeDetails degree={degree} />
            )}
        </>
    );
}
