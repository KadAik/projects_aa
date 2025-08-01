import ButtonLink from "../ButtonLink.jsx";

export default function Hero({title, subtitle}){
    return (
        <section id="hero">
            <h1>{title}</h1>
            <h2>{subtitle}</h2>
            <ButtonLink href="#" classList="cta-button register">S’inscrire maintenant</ButtonLink>
            <span>ou</span>
            <ButtonLink href="#" classList="cta-button">Suivre ma candidature</ButtonLink>
        </section>
    );
}