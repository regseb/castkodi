/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

/**
 * L'agent utilisateur de Chromium sous Ubuntu.
 *
 * @type {string}
 */
const USER_AGENT =
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko)" +
    " Chrome/126.0.0.0 Safari/537.36";

/**
 * La méthode <code>fetch()</code> native dans Node.js.
 *
 * @type {fetch}
 */
const nativeFetch = fetch;

/**
 * Cherche une ressource.
 *
 * @param {string}      input  La ressource à collecter.
 * @param {RequestInit} [init] Les paramètres de la requête.
 * @returns {Promise<Response>} Une promesse contenant la réponse.
 * @see https://developer.mozilla.org/Web/API/fetch
 */
export const stealthFetch = function (input, init) {
    const headers = {
        // Remplacer des entêtes pour se rapprocher du comportement des valeurs
        // des navigateurs.
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Site": "same-origin",
        "User-Agent": USER_AGENT,
        ...init?.headers,
    };
    return nativeFetch(input, { ...init, headers });
};
