import { useNavigate } from "react-router-dom";
import "../styles/hero.css";

export default function Hero({ title, subtitle }) {
    const navigate = useNavigate();

    return (
        <section id="hero">
            <h1>{title}</h1>
            <h2>{subtitle}</h2>
            <div className="cta-group">
                <div className="cta-group">
                    <a
                        href="/applications/create"
                        className="cta-button register"
                        role="button"
                        tabIndex={0}
                        onClick={(e) => {
                            e.preventDefault();
                            navigate("/applications/create");
                        }}
                    >
                        S’inscrire maintenant
                    </a>
                    <span className="cta-separator">ou</span>
                    <a
                        href="/applications/create"
                        className="cta-button"
                        role="button"
                        tabIndex={0}
                        onClick={(e) => {
                            e.preventDefault();
                            navigate("/applications/track");
                        }}
                    >
                        Suivre ma candidature
                    </a>
                </div>
            </div>
        </section>
    );
}
