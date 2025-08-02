import { useFormContext } from "react-hook-form";

export default function UniversityDegreeDetails({ degree }) {
    const {
        register,
        formState: { errors },
    } = useFormContext();

    const getError = (fieldName) => errors.university?.[fieldName];
    const hasError = (fieldName) => !!getError(fieldName);

    return (
        <div className="degree-details">
            <h4>
                Informations sur{" "}
                {degree === "bachelor"
                    ? "la Licence"
                    : degree === "master"
                    ? "le Master"
                    : "le Doctorat"}
            </h4>

            <div className="form-group row">
                <label htmlFor="university">
                    Université
                    <strong>
                        <span aria-label="required">
                            <sup>*</sup>
                        </span>
                    </strong>
                    :
                </label>
                <div className="input-wrapper">
                    <input
                        type="text"
                        id="university"
                        {...register("university.name")}
                        className={hasError("name") ? "error" : ""}
                    />
                    <p className="error-message">{getError("name")?.message}</p>
                </div>
            </div>

            <div className="form-group row">
                <label htmlFor="field-of-study">
                    Spécialisation
                    <strong>
                        <span aria-label="required">
                            <sup>*</sup>
                        </span>
                    </strong>
                    :
                </label>
                <div className="input-wrapper">
                    <input
                        type="text"
                        id="field-of-study"
                        {...register("university.fieldOfStudy")}
                        className={hasError("fieldOfStudy") ? "error" : ""}
                    />
                    <p className="error-message">
                        {getError("fieldOfStudy")?.message}
                    </p>
                </div>
            </div>

            <div className="form-group row">
                <label htmlFor="average">
                    Moyenne obtenue
                    <strong>
                        <span aria-label="required">
                            <sup>*</sup>
                        </span>
                    </strong>
                    :
                </label>
                <div className="input-wrapper">
                    <input
                        type="phone"
                        id="average"
                        {...register("university.average")}
                        className={hasError("average") ? "error" : ""}
                    />
                    <p className="error-message">
                        {getError("average")?.message}
                    </p>
                </div>
            </div>
        </div>
    );
}
