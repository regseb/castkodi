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
 * L'URL de l'extension pour lire des musiques issues de SoundCloud.
 *
 * @constant {string}
 */
const PLUGIN_URL = "plugin://plugin.audio.soundcloud/play/?track_id=";

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
 * @param {string} url L'URL d'une musique SoundCloud.
 * @returns {Promise} L'URL du <em>fichier</em> ou <code>null</code>.
 */
rules.set([
    "*://soundcloud.com/*/*", "*://mobi.soundcloud.com/*/*"
], function ({ pathname, href }) {
    // Si le chemin contient plusieurs barres obliques.
    if (pathname.indexOf("/", 1) !== pathname.lastIndexOf("/"))  {
        return Promise.resolve(null);
    }

    return fetch("https://soundcloud.com/oembed?url=" +
                 encodeURIComponent(href.replace("//mobi.", "//")))
                                                     .then(function (response) {
        return response.text();
    }).then(function (response) {
        const result = URL_REGEXP.exec(response);
        return null === result ? null
                               : PLUGIN_URL + result[1];
    });
});
