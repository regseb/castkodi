/**
 * @module
 */

/**
 * Teste si un lien est accessible.
 *
 * @param {string} url Le lien testé.
 * @returns {Promise<boolean>} Une promesse indiquant si le lien est accessible.
 */
export const ping = async function (url) {
    try {
        await fetch(url, {
            method:  "HEAD",
            // Fournir des "identifiants" vides dans les entêtes pour que si la
            // page demande une authentification : celle-ci échoue directement
            // sans demander à l'utilisateur de saisir son identifiant et son
            // mot de passe.
            headers: { Authorization: "" },
        });
        return true;
    } catch {
        // Ignorer l'erreur si la requête échoue. Et indiquer que le lien est
        // inaccessible.
        return false;
    }
};
