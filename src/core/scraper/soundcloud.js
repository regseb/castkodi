/**
 * @module
 */

/**
 * L'expression rationnelle pour extraire l'URL de la musique.
 *
 * @constant {RegExp}
 */
const URL_REGEXP = /api\.soundcloud\.com%2Ftracks%2F([^&]+)/iu;

/**
 * L'URL de l'extension pour lire des sons issus de SoundCloud.
 *
 * @constant {string}
 */
const PLUGIN_URL = "plugin://plugin.audio.soundcloud/play/?track_id=";

/**
 * Les règles avec les patrons et leur action.
 *
 * @constant {Map.<Array.<string>, Function>}
 */
export const rules = new Map();

/**
 * Extrait les informations nécessaire pour lire une musique sur Kodi.
 *
 * @function action
 * @param {URL}    url          L'URL d'un son SoundCloud.
 * @param {string} url.pathname Le chemin de l'URL.
 * @param {string} url.href     Le lien de l'URL.
 * @returns {?Promise} Une promesse contenant le lien du <em>fichier</em> ou
 *                     <code>null</code>.
 */
rules.set([
    "*://soundcloud.com/*/*", "*://mobi.soundcloud.com/*/*"
], function ({ pathname, href }) {
    // Si le chemin contient plusieurs barres obliques.
    if (pathname.indexOf("/", 1) !== pathname.lastIndexOf("/"))  {
        return null;
    }

    const url = "https://soundcloud.com/oembed?url=" +
                encodeURIComponent(href.replace("//mobi.", "//"));
    return fetch(url).then((r) => r.text())
                     .then((data) => {
        const result = URL_REGEXP.exec(data);
        return null === result ? null
                               : PLUGIN_URL + result[1];
    });
});
