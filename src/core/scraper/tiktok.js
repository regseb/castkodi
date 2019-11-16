/**
 * @module
 */

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
 * @param {URL}    url      L'URL d'une vidéo TikTok.
 * @param {string} url.href Le lien de l'URL.
 * @returns {Promise} Une promesse contenant le lien du <em>fichier</em> ou
 *                    <code>null</code>.
 */
rules.set(["*://www.tiktok.com/*/video/*"], async function ({ href }) {
    const response = await fetch(href);
    const text = await response.text();
    const doc = new DOMParser().parseFromString(text, "text/html");

    for (const script of doc.querySelectorAll("head script")) {
        if (script.text.startsWith("window.__INIT_PROPS__ = ")) {
            const props = JSON.parse(script.text.slice(24));
            if ("videoData" in props["/@:uniqueId/video/:id"]) {
                return props["/@:uniqueId/video/:id"].videoData.itemInfos.video
                                                     .urls[0];
            }
        }
    }
    return null;
});