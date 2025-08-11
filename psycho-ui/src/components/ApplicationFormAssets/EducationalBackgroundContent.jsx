import { useFormContext } from "react-hook-form";
import HighSchoolDetails from "./HighSchoolDetails";
import UniversityDegreeDetails from "./UniversityDegreeDetails";

export default function EducationalBackgroundContent() {
    const {
        register,
        watch,
        formState: { errors },
    } = useFormContext();

    const degree = watch("degree") || "";

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
                        <option value="HIGHSCHOOL">Bac</option>
                        <option value="BACHELOR">Bachelor</option>
                        <option value="MASTER">Master</option>
                        <option value="PHD">PhD</option>
                    </select>
                    <p className="error-message">{errors.degree?.message}</p>
                </div>
            </div>

            <HighSchoolDetails />

            {/* Show university-related degrees */}
            {(degree === "BACHELOR" ||
                degree === "MASTER" ||
                degree === "PHD") && (
                <UniversityDegreeDetails degree={degree} />
            )}
        </>
    );
}
