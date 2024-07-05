/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

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
        // Remettre l'agent utilisateur, car la valeur dans le navigator a été
        // écrasée.
        "User-Agent": navigator.userAgent,
        ...init?.headers,
    };
    return nativeFetch(input, { ...init, headers });
};
