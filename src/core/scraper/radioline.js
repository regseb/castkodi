/**
 * @module core/scraper/radioline
 */

import { PebkacError } from "../pebkac.js";

/**
 * L'URL de l'API de Radioline pour obtenir l'URL de la musique.
 *
 * @constant {string} API_URL
 */
const API_URL = "https://www.radioline.co/Pillow/";

/**
 * Les règles avec les patrons et leur action.
 *
 * @constant {Map} rules
 */
export const rules = new Map();

/**
 * Extrait les informations nécessaire pour lire une musique sur Kodi.
 *
 * @param {string} url L'URL d'une musique Radioline.
 * @return {Promise} L'URL du <em>fichier</em>.
 */
rules.set(["*://*.radioline.co/*"], function (url) {
    // Si l'URL n'a pas de hash.
    if ("" === url.hash)  {
        return Promise.reject(new PebkacError("noAudio", "Radioline"));
    }

    const key = url.hash.substring(1).replace(/-/gu, "_");
    return fetch(API_URL + key + "/play").then(function (response) {
        return response.json();
    }).then(function (response) {
        if ("error" === response.body.type) {
            throw new PebkacError("noAudio", "Radioline");
        }

        return response.body.content.streams[0].url;
    });
});
