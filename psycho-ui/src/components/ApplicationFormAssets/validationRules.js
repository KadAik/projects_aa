import * as yup from "yup";

export const schema = yup.object().shape({
    degree: yup.string().required("Choisissez votre niveau académique"),
    personalHistory: yup.object().shape({
        firstName: yup
            .string()
            .required("Le prénom est obligatoire")
            .min(2, "Le prénom doit contenir au moins 2 caractères"),
        lastName: yup
            .string()
            .required("Le nom est obligatoire")
            .min(2, "Le nom doit contenir au moins 2 caractères"),
        birthDate: yup
            .date()
            .transform((value, originalValue) =>
                originalValue === "" ? null : value
            )
            .nullable()
            .required("La date de naissance est obligatoire"),
        gender: yup
            .string()
            .required("Le genre est obligatoire")
            .oneOf(["male", "female"], "Genre invalide"),
        email: yup
            .string()
            .email("L'adresse mail doit être valide")
            .required("Une adresse mail est requise"),
        phone: yup
            .string()
            .required("Le numéro de téléphone est obligatoire")
            .matches(
                /^\+?[0-9\s-]{10,}$/,
                "Numéro de téléphone invalide (format: +229 01 90 00 00 00)"
            ),
    }),
    highSchool: yup.object().shape({
        baccalaureateSerie: yup
            .string()
            .required("La série du bac est obligatoire"),
        baccalaureateSession: yup
            .date()
            .transform((value, originalValue) =>
                originalValue === "" ? null : value
            )
            .nullable()
            .required("La session est obligatoire"),
        average: yup
            .number()
            .typeError("La moyenne doit être un nombre")
            .required("La moyenne du bac est obligatoire")
            .min(0, "La moyenne ne peut pas être inférieure à 0")
            .max(20, "La moyenne ne peut pas dépasser 20"),
    }),
    university: yup.object().when("degree", {
        is: (degree) => ["bachelor", "master", "phd"].includes(degree),
        then: (schema) =>
            schema.shape({
                name: yup
                    .string()
                    .required("Vous devez renseigner l'université"),
                fieldOfStudy: yup
                    .string()
                    .required("Renseignez votre spécialité"),
                average: yup
                    .number()
                    .typeError("La moyenne doit être un nombre")
                    .required("La moyenne est obligatoire")
                    .min(0, "La moyenne ne peut pas être inférieure à 0")
                    .max(20, "La moyenne ne peut pas dépasser 20"),
            }),
        otherwise: (schema) => schema.strip(),
    }),
});
