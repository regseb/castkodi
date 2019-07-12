/**
 * @module core/scraper/facebook
 */

/**
 * L'URL pour récupérer la vidéo Facebook.
 *
 * @constant {string}
 */
const PREFIX_VIDEO_URL = "https://www.facebook.com/watch/?v=";

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
 * @param {string} url L'URL d'une vidéo Facebook.
 * @returns {Promise} L'URL du <em>fichier</em> ou <code>null</code>.
 */
rules.set([
    "*://*.facebook.com/*/videos/*/*", "*://*.facebook.com/watch*"
], function ({ pathname, searchParams }) {
    let id;
    if ("/watch" === pathname || "/watch/" === pathname) {
        if (searchParams.has("v")) {
            id = searchParams.get("v");
        } else {
            return Promise.resolve(null);
        }
    } else {
        id = pathname.substring(pathname.indexOf("/videos/") + 8)
                     .replace(/\/$/u, "");
    }

    const init = { "credentials": "omit" };
    return fetch(PREFIX_VIDEO_URL + id, init).then(function (response) {
        return response.text();
    }).then(function (data) {
        const doc = new DOMParser().parseFromString(data, "text/html");

        const meta = doc.querySelector(`head meta[property="og:video"]`);
        return null === meta ? null
                             : meta.content;
    });
});
