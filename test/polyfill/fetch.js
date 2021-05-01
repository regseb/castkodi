import nodeFetch from "node-fetch";

/**
 * L'agent utilisateur par défaut.
 *
 * @type {string}
 */
const USER_AGENT = "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:88.0)" +
                                                 " Gecko/20100101 Firefox/88.0";

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
    headers["User-Agent"] = USER_AGENT;
    return nodeFetch(input, { ...init, headers });
};
