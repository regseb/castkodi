/**
 * @module
 */

/**
 * L'expression rationnelle pour extraire l'URL de la vidéo.
 *
 * @constant {RegExp}
 */
const URL_REGEXP = /https?:\/\/videos\.full30\.com\/[^"]+\.(?:mp4|webm|ogv)/iu;

/**
 * Les règles avec les patrons et leur action.
 *
 * @constant {Map}
 */
export const rules = new Map();

/**
 * Extrait les informations nécessaire pour lire une vidéo sur Kodi.
 *
 * @function action
 * @param {string} url L'URL d'une vidéo Full30.
 * @returns {Promise} L'URL du <em>fichier</em> ou <code>null</code>.
 */
rules.set(["*://www.full30.com/video/*"], function ({ href }) {
    return fetch(href).then(function (response) {
        return response.text();
    }).then(function (data) {
        const result = URL_REGEXP.exec(data);
        return null === result ? null
                               : result[0];
    });
});
