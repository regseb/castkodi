/**
 * @module
 * @license MIT
 * @author Sébastien Règne
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
            method: "HEAD",
            // Omettre les "credentials" pour que la popup de connexion ne
            // s'affiche pas. Si une authentification est nécessaire, le serveur
            // répondra qu'il manque les informations. Mais on saura qu'il y a
            // bien un serveur derrière le lien.
            credentials: "omit",
        });
        return true;
    } catch {
        // Ignorer l'erreur si la requête échoue. Et indiquer que le lien est
        // inaccessible.
        return false;
    }
};
