/**
 * @module core/scraper/radioline
 */

/**
 * L'URL de l'API de Radioline pour obtenir l'URL de la musique.
 *
 * @constant {string}
 */
const API_URL = "https://www.radioline.co/Pillow/";

/**
 * Les règles avec les patrons et leur action.
 *
 * @constant {Map}
 */
export const rules = new Map();

/**
 * Extrait les informations nécessaire pour lire une musique sur Kodi.
 *
 * @function action
 * @param {string} url L'URL d'une musique Radioline.
 * @returns {Promise} L'URL du <em>fichier</em> ou <code>null</code>.
 */
rules.set(["*://*.radioline.co/*"], function ({ hash }) {
    // Si l'URL n'a pas de hash.
    if ("" === hash)  {
        return Promise.resolve(null);
    }

    const key = hash.substring(1).replace(/-/gu, "_");
    return fetch(API_URL + key + "/play").then(function (response) {
        return response.json();
    }).then(function ({ body }) {
        return "error" === body.type ? null
                                     : body.content.streams[0].url;
    });
});
