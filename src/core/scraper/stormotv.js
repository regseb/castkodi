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
 * @param {URL}    url      L'URL d'une vidéo StormoTV.
 * @param {string} url.href Le lien de l'URL.
 * @returns {Promise.<?string>} Une promesse contenant le lien du
 *                              <em>fichier</em> ou <code>null</code>.
 */
rules.set(["https://www.stormo.tv/videos/*"], async function ({ href }) {
    const response = await fetch(href);
    const text = await response.text();
    const doc = new DOMParser().parseFromString(text, "text/html");

    const meta = doc.querySelector(`meta[property="ya:ovs:content_url"]`);
    return null === meta ? null
                         : meta.content;
});
