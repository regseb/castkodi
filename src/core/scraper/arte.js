/**
 * @module
 */

/**
 * L'URL du répertoire où sont les sons de Arte Radio.
 *
 * @constant {string}
 */
const API_URL = "https://api.arte.tv/api/player/v1/config";

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
 * @param {string} url L'URL d'une vidéo de Arte.
 * @returns {Promise} L'URL du <em>fichier</em>.
 */
rules.set(["*://www.arte.tv/*/videos/*/*"], function ({ pathname }) {
    const [, lang,, id] = pathname.split("/");
    return fetch(`${API_URL}/${lang}/${id}`).then(function (response) {
        return response.json();
    }).then(function ({ "videoJsonPlayer": { "VSR": data } }) {
        return Object.values(data).filter((f) => f.id.endsWith("_1"))
                     .reduce((b, f) => (b.height < f.height ? f : b))
                     .url;
    });
});
