import nodeFetch from "node-fetch";

/**
 * @typedef {import("node-fetch").Response} Response
 */

/**
 * L'agent utilisateur de Chromium sous Ubuntu.
 *
 * @type {string}
 */
const USER_AGENT = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36" +
                        "(KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36";

/**
 * Cherche une ressource.
 *
 * @param {string}           input  La ressource à collecter.
 * @param {Object|undefined} [init] Les paramètres de la requête.
 * @returns {Promise<Response>} Une promesse contenant la réponse.
 */
export const fetch = function (input, init = {}) {
    const headers = init.headers ?? {};
    headers["Accept-Language"] = "*";
    // Remplacer l'agent utilisateur "node-fetch" par la valeur d'un vrai
    // navigateur ; pour ne pas être bloqué par des sites.
    headers["User-Agent"] = USER_AGENT;
    return nodeFetch(input, { ...init, headers });
};
