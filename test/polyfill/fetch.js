/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import nodeFetch from "node-fetch";

/**
 * @typedef {import("node-fetch").Response} Response
 * @typedef {import("node-fetch").RequestInit} RequestInit
 */

/**
 * L'agent utilisateur de Chromium sous Ubuntu.
 *
 * @type {string}
 */
const USER_AGENT =
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko)" +
    " Chrome/109.0.0.0 Safari/537.36";

/**
 * Cherche une ressource.
 *
 * @param {string}      input  La ressource à collecter.
 * @param {RequestInit} [init] Les paramètres de la requête.
 * @returns {Promise<Response>} Une promesse contenant la réponse.
 * @see https://developer.mozilla.org/Web/API/fetch
 */
export const fetch = function (input, init) {
    const headers = {
        "Accept-Language": "*",
        // Définir "keep-alive" car node-fetch utilise par défaut "close".
        // https://github.com/node-fetch/node-fetch/pull/1473
        Connection: "keep-alive",
        // Remplacer l'agent utilisateur "node-fetch" par la valeur d'un vrai
        // navigateur ; pour ne pas être bloqué par des sites.
        "User-Agent": USER_AGENT,
        ...init?.headers,
    };
    // Utiliser node-fetch car la fonction native fetch() de Node.js ne supporte
    // pas HTTP/2. https://github.com/nodejs/undici/issues/1412
    return nodeFetch(input, { ...init, headers });
};
