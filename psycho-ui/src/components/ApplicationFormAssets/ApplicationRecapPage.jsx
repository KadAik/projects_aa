import { useFormContext } from "react-hook-form";

const degreeLabels = {
    HIGHSCHOOL: "le Baccalauréat",
    BACHELOR: "la Licence",
    MASTER: "le Master",
    PHD: "le Doctorat",
};

export default function AppplicationRecapPage() {
    const { getValues } = useFormContext();

    const { degree, personalHistory, highSchool, university } = getValues();

    return (
        <>
            <section className="recap-section">
                <h3>Informations personnelles</h3>
                <ul>
                    <li>
                        <strong>Prénom:</strong> {personalHistory.firstName}
                    </li>
                    <li>
                        <strong>Nom:</strong> {personalHistory.lastName}
                    </li>
                    <li>
                        <strong>Date de naissance:</strong>{" "}
                        {personalHistory.dateOfBirth}
                    </li>
                    <li>
                        <strong>Sexe:</strong>{" "}
                        {personalHistory.gender === "M"
                            ? "Masculin"
                            : "Féminin"}
                    </li>
                    <li>
                        <strong>Email:</strong> {personalHistory.email}
                    </li>
                    <li>
                        <strong>Téléphone:</strong> {personalHistory.phone}
                    </li>
                </ul>
            </section>

            <section className="recap-section">
                <h3>Parcours académique</h3>
                <ul>
                    <li>
                        <strong>Niveau académique:</strong>
                        {degreeLabels[degree]?.slice(2)}
                    </li>

                    {["BACHELOR", "MASTER", "PHD"].includes(degree) && (
                        <>
                            <h4>Informations sur {degreeLabels[degree]}</h4>
                            <li>
                                <strong>Université:</strong> {university.name}
                            </li>
                            <li>
                                <strong>Domaine d'études:</strong>{" "}
                                {university.fieldOfStudy}
                            </li>
                            <li>
                                <strong>Moyenne obtenue:</strong>{" "}
                                {university.average}
                            </li>
                        </>
                    )}

                    <>
                        <h4>Informations sur le baccalauréat</h4>
                        <li>
                            <strong>Série du Bac:</strong>{" "}
                            {highSchool.baccalaureateSerie}
                        </li>
                        <li>
                            <strong>Session:</strong>{" "}
                            {highSchool.baccalaureateSession}
                        </li>
                        <li>
                            <strong>Moyenne:</strong>{" "}
                            {highSchool.baccalaureateAverage}
                        </li>
                    </>
                </ul>
            </section>
        </>
    );
}
