import Card from "../Card.jsx";

export default function Infos(){
    return(
        <>
            <Card title="Pourquoi devenir aviateur ?">
                <ul>
                    <li>Servez votre pays avec fierté</li>
                    <li>Développez des compétences techniques avancées</li>
                    <li>Relevez des défis et dépassez-vous</li>
                </ul>
            </Card>

            <Card title="À propos des tests psychotechniques AIR">
                <p>
                    Les test psychotechniques AIR sont conçus pour évaluer votre logique,
                    vos réflexes, votre concentration et votre aptitude.
                    Il est la première étape vers une carrière dans l’Armée de l’air.
                </p>
            </Card>

            <Card title="Ils l’ont fait !">
                <blockquote>“Le test m’a mis au défi, mais il m’a aussi révélé à moi-même.” – Julien, pilote</blockquote>
                <blockquote>“Une expérience intense et valorisante.” – Aïcha, technicienne aéronautique</blockquote>
            </Card>

            <Card title="🗓 Prochaine session : 20 septembre 2025">
                <p>Places limitées – inscrivez-vous dès maintenant !</p>
            </Card>

        </>
    );
}