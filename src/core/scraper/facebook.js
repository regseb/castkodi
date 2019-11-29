/**
 * @module
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
 * @constant {Map.<Array.<string>, Function>}
 */
export const rules = new Map();

/**
 * Extrait les informations nécessaire pour lire une vidéo sur Kodi.
 *
 * @function action
 * @param {URL}             url              L'URL d'une vidéo Facebook.
 * @param {string}          url.pathname     Le chemin de l'URL.
 * @param {URLSearchParams} url.searchParams Les paramètres de l'URL.
 * @returns {Promise.<?string>} Une promesse contenant le lien du
 *                              <em>fichier</em> ou <code>null</code>.
 */
rules.set([
    "*://*.facebook.com/*/videos/*/*", "*://*.facebook.com/watch*"
], async function ({ pathname, searchParams }) {
    let id;
    if ("/watch" === pathname || "/watch/" === pathname) {
        if (searchParams.has("v")) {
            id = searchParams.get("v");
        } else {
            return null;
        }
    } else {
        id = pathname.slice(pathname.indexOf("/videos/") + 8)
                     .replace(/\/$/u, "");
    }

    const response = await fetch(PREFIX_VIDEO_URL + id, {
        "credentials": "omit"
    });
    const text = await response.text();
    const doc = new DOMParser().parseFromString(text, "text/html");

    const meta = doc.querySelector(`meta[property="og:video"]`);
    return null === meta ? null
                         : meta.content;
});
