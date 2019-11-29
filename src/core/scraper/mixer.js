/**
 * @module
 */

/**
 * L'URL du l'API de Mixer pour obtenir des informations sur une chaine.
 *
 * @constant {string}
 */
const API_URL = "https://mixer.com/api/v1/channels/";

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
 * @param {URL}    url          L'URL d'une chaine Mixer.
 * @param {string} url.pathname Le chemin de l'URL.
 * @returns {Promise.<?string>} Une promesse contenant le lien du
 *                              <em>fichier</em> ou <code>null</code>.
 */
rules.set(["*://mixer.com/*"], async function ({ pathname }) {
    let name;
    if (-1 === pathname.indexOf("/", 1)) {
        name = pathname.slice(1);
    } else if (pathname.startsWith("/embed/player/")) {
        name = pathname.slice(14);
    } else {
        return null;
    }

    const response = await fetch(API_URL + name);
    if (response.ok) {
        const json = await response.json();
        return API_URL + json.id + "/manifest.m3u8";
    }
    return null;
});
