/**
 * @module
 */

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
 * @param {URL}    url      L'URL d'un jeu Steam.
 * @param {string} url.href Le lien de l'URL.
 * @returns {Promise} Une promesse contenant le lien du <em>fichier</em> ou
 *                    <code>null</code>.
 */
rules.set("*://store.steampowered.com/app/*", function ({ href }) {
    return fetch(href).then((r) => r.text())
                      .then((data) => {
        const doc = new DOMParser().parseFromString(data, "text/html");

        const div = doc.querySelector(".highlight_movie[data-mp4-hd-source]");
        return null === div ? null
                            : div.dataset.mp4HdSource;
    });
});

/**
 * Extrait les informations nécessaire pour lire une vidéo sur Kodi.
 *
 * @function action
 * @param {URL}    url          L'URL d'une diffusion Steam.
 * @param {string} url.pathname Le chemin de l'URL.
 * @returns {Promise} Une promesse contenant le lien du <em>fichier</em> ou
 *                    <code>null</code>.
 */
rules.set("*://steamcommunity.com/broadcast/watch/*", function ({ pathname }) {
    const url = "https://steamcommunity.com/broadcast/getbroadcastmpd/" +
                                           "?steamid=" + pathname.substring(17);
    return fetch(url).then((r) => r.json())
                     .then((data) => {
        return "hls_url" in data ? data["hls_url"]
                                 : null;
    });
});
