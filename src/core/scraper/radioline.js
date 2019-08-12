/**
 * @module
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
 * @constant {Map.<string, Function>}
 */
export const rules = new Map();

/**
 * Extrait les informations nécessaire pour lire une musique sur Kodi.
 *
 * @function action
 * @param {URL}    url      L'URL d'une musique Radioline.
 * @param {string} url.hash Le hash de l'URL.
 * @returns {?Promise} Une promesse contenant le lien du <em>fichier</em> ou
 *                     <code>null</code>.
 */
rules.set("*://*.radioline.co/*", function ({ hash }) {
    // Si l'URL n'a pas de hash.
    if ("" === hash)  {
        return null;
    }

    const key = hash.substring(1).replace(/-/gu, "_");
    return fetch(API_URL + key + "/play").then((r) => r.json())
                                         .then(({ body }) => {
        return "error" === body.type ? null
                                     : body.content.streams[0].url;
    });
});
