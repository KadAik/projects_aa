import { useFormDataContext, useFormDataContextSetter } from "../Contexts/FormDataContext";

export default function RFPersonalHistoryContent() {
    const formData = useFormDataContext();
    const dispatch = useFormDataContextSetter();

    function handleInputChange(event) {
        dispatch({
            type: "SET_FIELD",
            section: "personalHistory",
            field: event.target.name,
            value: event.target.value
        });
    }

    const data = formData.personalHistory || {};

    return (
        <>
            <p className="notice">
                Required fields are followed by <span aria-label="required">*</span>
            </p>

            <div className="form-group row">
                <label htmlFor="firstName">
                    First name <strong><span aria-label="required"><sup>*</sup></span></strong>
                </label>
                <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={data.firstName || ""}
                    required
                    onChange={handleInputChange}
                />
            </div>

            <div className="form-group row">
                <label htmlFor="lastName">
                    Last name <strong><span aria-label="required"><sup>*</sup></span></strong>
                </label>
                <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={data.lastName || ""}
                    required
                    onChange={handleInputChange}
                />
            </div>

            <div className="form-group row">
                <label htmlFor="birthDate">
                    Date of birth <strong><span aria-label="required"><sup>*</sup></span></strong>
                </label>
                <input
                    type="date"
                    id="birthDate"
                    name="birthDate"
                    value={data.birthDate || ""}
                    required
                    onChange={handleInputChange}
                />
            </div>

            <div className="form-group row">
                <label htmlFor="gender">
                    Gender <strong><span aria-label="required"><sup>*</sup></span></strong>
                </label>
                <select
                    name="gender"
                    id="gender"
                    value={data.gender || ""}
                    required
                    onChange={handleInputChange}
                >
                    <option value="" disabled hidden>Choose</option>
                    <option value="male">M</option>
                    <option value="female">F</option>
                </select>
            </div>

            <div className="form-group row">
                <label htmlFor="email">
                    Email <strong><span aria-label="required"><sup>*</sup></span></strong>
                </label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={data.email || ""}
                    required
                    onChange={handleInputChange}
                />
            </div>

            <div className="form-group row">
                <label htmlFor="phone">
                    Phone number <strong><span aria-label="required"><sup>*</sup></span></strong>
                </label>
                <input
                    type="tel"
                    id="phone"
                    name="phone"
                    placeholder="e.g: +229 01 90 00 00 00"
                    value={data.phone || ""}
                    required
                    onChange={handleInputChange}
                />
            </div>
        </>
    );
}
