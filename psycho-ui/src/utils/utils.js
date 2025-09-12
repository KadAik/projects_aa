export function isLowerCase(char) {
    // Test whether the given character is in lower case
    return (
        char === char.toLowerCase() && char.toUpperCase() !== char.toLowerCase()
    );
}

export function camelToSnakeCase(str) {
    // Transform a given string from camel case to kebab case useful
    // to interface between python api which would use kebab case for
    // attribute names.

    let result = "";

    if (str === str.toLowerCase()) {
        // We optimize computation time if the variable name is in lower case.
        return str;
    }
    for (let char of str) {
        result =
            isLowerCase(char) ?
                result.concat(char)
            :   result.concat(`_${char.toLowerCase()}`);
    }
    return result;
}

export function objectFromCamelToSnakeCase(obj) {
    if (Array.isArray(obj)) {
        // If it's an array, transform each element recursively (in fact an array is an object too)
        return obj.map((item) => objectFromCamelToSnakeCase(item));
    } else if (obj && typeof obj === "object") {
        // If it's an object, transform its keys
        const result = {};
        for (let key in obj) {
            result[camelToSnakeCase(key)] = objectFromCamelToSnakeCase(
                obj[key]
            );
        }
        return result;
    }
    // If it's neither an object nor an array, return it as is
    return obj;
}

export function snakeToCamelCase(str) {
    // Giving a variable name in kebab case, transform it to camel case.
    return str.replace(/_([a-z])/g, (_, char) => char.toUpperCase());
}

export function objectFromSnakeToCamelCase(obj) {
    if (Array.isArray(obj)) {
        return obj.map((item) => objectFromSnakeToCamelCase(item));
    } else if (obj && typeof obj === "object") {
        const result = {};
        for (let key in obj) {
            result[snakeToCamelCase(key)] = objectFromSnakeToCamelCase(
                obj[key]
            );
        }
        return result;
    }
    return obj;
}

export const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("fr-FR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};
