import { useFormContext } from "react-hook-form";

export default function PersonalHistoryContent() {
    const {
        register,
        formState: { errors },
    } = useFormContext();

    // Error handling utility
    const getError = (fieldName) => errors.personalHistory?.[fieldName];
    const hasError = (fieldName) => !!getError(fieldName);

    return (
        <>
            <p className="notice">
                Required fields are followed by{" "}
                <span aria-label="required">*</span>
            </p>

            <div className="form-group row">
                <label htmlFor="firstName">
                    Prénom{" "}
                    <strong>
                        <span aria-label="required">
                            <sup>*</sup>
                        </span>
                    </strong>
                </label>
                <div className="input-wrapper">
                    <input
                        type="text"
                        id="firstName"
                        className={hasError("firstName") ? "error" : ""}
                        {...register("personalHistory.firstName")}
                    />
                    <p className="error-message">
                        {getError("firstName")?.message}
                    </p>
                </div>
            </div>

            <div className="form-group row">
                <label htmlFor="lastName">
                    Nom{" "}
                    <strong>
                        <span aria-label="required">
                            <sup>*</sup>
                        </span>
                    </strong>
                </label>
                <div className="input-wrapper">
                    <input
                        type="text"
                        id="lastName"
                        className={hasError("lastName") ? "error" : ""}
                        {...register("personalHistory.lastName")}
                    />
                    <p className="error-message">
                        {getError("lastName")?.message}
                    </p>
                </div>
            </div>

            <div className="form-group row">
                <label htmlFor="date-of-birth">
                    Date de naissance{" "}
                    <strong>
                        <span aria-label="required">
                            <sup>*</sup>
                        </span>
                    </strong>
                </label>
                <div className="input-wrapper">
                    <input
                        type="date"
                        id="date-of-birth"
                        className={hasError("birthDate") ? "error" : ""}
                        {...register("personalHistory.dateOfBirth")}
                    />
                    <p className="error-message">
                        {getError("dateOfBirth")?.message}
                    </p>
                </div>
            </div>

            <div className="form-group row">
                <label htmlFor="gender">
                    Genre{" "}
                    <strong>
                        <span aria-label="required">
                            <sup>*</sup>
                        </span>
                    </strong>
                </label>
                <div className="input-wrapper">
                    <select
                        id="gender"
                        className={hasError("gender") ? "error" : ""}
                        {...register("personalHistory.gender")}
                    >
                        <option value="" disabled hidden>
                            Choose
                        </option>
                        <option value="M">M</option>
                        <option value="F">F</option>
                    </select>
                    <p className="error-message">
                        {getError("gender")?.message}
                    </p>
                </div>
            </div>

            <div className="form-group row">
                <label htmlFor="email">
                    Email{" "}
                    <strong>
                        <span aria-label="required">
                            <sup>*</sup>
                        </span>
                    </strong>
                </label>
                <div className="input-wrapper">
                    <input
                        type="email"
                        id="email"
                        className={hasError("email") ? "error" : ""}
                        {...register("personalHistory.email")}
                    />
                    <p className="error-message">
                        {getError("email")?.message}
                    </p>
                </div>
            </div>

            <div className="form-group row">
                <label htmlFor="phone">
                    Numéro de téléphone{" "}
                    <strong>
                        <span aria-label="required">
                            <sup>*</sup>
                        </span>
                    </strong>
                </label>
                <div className="input-wrapper">
                    <input
                        type="tel"
                        id="phone"
                        className={hasError("phone") ? "error" : ""}
                        {...register("personalHistory.phone")}
                        placeholder="e.g: +229 01 90 00 00 00"
                    />
                    <p className="error-message">
                        {getError("phone")?.message}
                    </p>
                </div>
            </div>
        </>
    );
}
