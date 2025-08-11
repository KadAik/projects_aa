import { useFormContext } from "react-hook-form";

export default function HighSchoolDetails() {
    const {
        register,
        formState: { errors },
    } = useFormContext();

    const getError = (field) => errors.highSchool?.[field]?.message;

    return (
        <div className="degree-details">
            <h4>Informations sur le baccalauréat</h4>

            <div className="form-group row">
                <label htmlFor="baccalaureate-serie">
                    Série du Baccalauréat
                    <strong>
                        <span aria-label="required">
                            <sup>*</sup>
                        </span>
                    </strong>
                </label>
                <div className="input-wrapper">
                    <select
                        id="baccalaureate-serie"
                        className={
                            getError("baccalaureateSeries") ? "error" : ""
                        }
                        {...register("highSchool.baccalaureateSeries")}
                    >
                        <option value="" disabled hidden>
                            Choose
                        </option>
                        <option value="C">BAC C</option>
                        <option value="D">BAC D</option>
                        <option value="E">BAC E</option>
                        <option value="F">BAC F</option>
                    </select>
                    <p className="error-message">
                        {getError("baccalaureateSeries")}
                    </p>
                </div>
            </div>

            <div className="form-group row">
                <label htmlFor="baccalaureate-session">
                    Session de baccalauréat
                    <strong>
                        <span aria-label="required">
                            <sup>*</sup>
                        </span>
                    </strong>
                    :
                </label>
                <div className="input-wrapper">
                    <input
                        type="date"
                        id="baccalaureate-session"
                        className={
                            getError("baccalaureateSession") ? "error" : ""
                        }
                        {...register("highSchool.baccalaureateSession")}
                    />
                    <p className="error-message">
                        {getError("baccalaureateSession")}
                    </p>
                </div>
            </div>

            <div className="form-group row">
                <label htmlFor="baccalaureate-average">
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
                        id="baccalaureate-average"
                        className={
                            getError("baccalaureateAverage") ? "error" : ""
                        }
                        {...register("highSchool.baccalaureateAverage")}
                    />
                    <p className="error-message">
                        {getError("baccalaureateAverage")}
                    </p>
                </div>
            </div>
        </div>
    );
}
