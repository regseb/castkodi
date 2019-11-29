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
 * @param {URL}    url      L'URL d'un jeu Steam.
 * @param {string} url.href Le lien de l'URL.
 * @returns {Promise.<?string>} Une promesse contenant le lien du
 *                              <em>fichier</em> ou <code>null</code>.
 */
rules.set(["*://store.steampowered.com/app/*"], async function ({ href }) {
    const response = await fetch(href);
    const text = await response.text();
    const doc = new DOMParser().parseFromString(text, "text/html");

    const div = doc.querySelector(".highlight_movie[data-mp4-hd-source]");
    return null === div ? null
                        : div.dataset.mp4HdSource;
});

/**
 * Extrait les informations nécessaire pour lire une vidéo sur Kodi.
 *
 * @function action
 * @param {URL}    url          L'URL d'une diffusion Steam.
 * @param {string} url.pathname Le chemin de l'URL.
 * @returns {Promise.<?string>} Une promesse contenant le lien du
 *                              <em>fichier</em> ou <code>null</code>.
 */
rules.set([
    "*://steamcommunity.com/broadcast/watch/*"
], async function ({ pathname }) {
    const url = "https://steamcommunity.com/broadcast/getbroadcastmpd/" +
                                               "?steamid=" + pathname.slice(17);
    const response = await fetch(url);
    const json = await response.json();
    return "hls_url" in json ? json["hls_url"]
                             : null;
});
