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
 * @constant {Map.<string, Function>}
 */
export const rules = new Map();

/**
 * Extrait les informations nécessaire pour lire une vidéo sur Kodi.
 *
 * @function action
 * @param {URL}    url      L'URL d'une vidéo Full30.
 * @param {string} url.href Le lien de l'URL.
 * @returns {Promise} Une promesse contenant le lien du <em>fichier</em> ou
 *                    <code>null</code>.
 */
rules.set("*://www.full30.com/video/*", function ({ href }) {
    return fetch(href).then((r) => r.text())
                      .then((data) => {
        const result = URL_REGEXP.exec(data);
        return null === result ? null
                               : result[0];
    });
});
