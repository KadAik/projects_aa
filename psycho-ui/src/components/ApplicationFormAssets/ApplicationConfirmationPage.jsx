import { useLocation, useNavigate } from "react-router-dom";
import "../styles/applicationConfirmationPage.css";

export default function ApplicationConfirmationPage({ email, trackingNumber }) {
    const navigate = useNavigate();
    const { state } = useLocation();

    return (
        <div className="confirmation-page">
            <div className="confirmation-card">
                <div className="confirmation-icon">✓</div>
                <h2>Votre candidature a été bien soumise</h2>

                <p className="confirmation-message">
                    Une confirmation vous a été envoyée à{" "}
                    <strong>{email}</strong>.
                </p>

                <div className="application-number">
                    <strong>Numéro de dossier : </strong>
                    <span>{trackingNumber}</span>
                </div>

                <div className="button-group">
                    <button
                        className="btn btn-primary"
                        onClick={() => navigate("/track", { state })}
                    >
                        Suivre ma candidature
                    </button>

                    <button
                        className="btn btn-secondary"
                        onClick={() => navigate("/submitted-data", { state })}
                    >
                        Consulter les informations soumises
                    </button>
                </div>
            </div>
        </div>
    );
}
