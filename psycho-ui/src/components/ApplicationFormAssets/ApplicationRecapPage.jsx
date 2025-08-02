import { useFormContext } from "react-hook-form";

const degreeLabels = {
    highSchool: "le Baccalauréat",
    bachelor: "la Licence",
    master: "le Master",
    phd: "le Doctorat",
};

export default function AppplicationRecapPage() {
    const { getValues } = useFormContext();

    console.log(getValues());

    const { personalHistory, highSchool, university } = getValues();

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
                        {personalHistory.birthDate}
                    </li>
                    <li>
                        <strong>Sexe:</strong>{" "}
                        {personalHistory.gender === "male"
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
                        {degreeLabels[personalHistory.degree]?.slice(2)}
                    </li>

                    {["bachelor", "master", "phd"].includes(
                        personalHistory.degree
                    ) && (
                        <>
                            <h4>
                                Informations sur{" "}
                                {degreeLabels[personalHistory.degree]}
                            </h4>
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
                            <strong>Moyenne:</strong> {highSchool.average}
                        </li>
                    </>
                </ul>
            </section>
        </>
    );
}
