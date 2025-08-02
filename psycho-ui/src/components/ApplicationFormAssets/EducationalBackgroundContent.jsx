import { useFormContext } from "react-hook-form";
import HighSchoolDetails from "./HighSchoolDetails";
import UniversityDegreeDetails from "./UniversityDegreeDetails";

export default function EducationalBackgroundContent() {
    const {
        register,
        watch,
        formState: { errors },
    } = useFormContext();

    const degree = watch("personalHistory.degree") || "";

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
                    <select id="degree" {...register("personalHistory.degree")}>
                        <option value="" disabled hidden>
                            Choose
                        </option>
                        <option value="highSchool">Bac</option>
                        <option value="bachelor">Bachelor</option>
                        <option value="master">Master</option>
                        <option value="phd">PhD</option>
                    </select>
                    <p className="error-message">
                        {errors.personalHistory?.degree?.message}
                    </p>
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
