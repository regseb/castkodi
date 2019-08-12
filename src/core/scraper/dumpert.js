/**
 * @module
 */

/**
 * L'URL de l'extension pour lire des vidéos issues de Dumpert.
 *
 * @constant {string}
 */
const PLUGIN_URL = "plugin://plugin.video.dumpert/?action=play&video_page_url=";

/**
 * Les règles avec les patrons et leur action.
 *
 * @constant {Map.<string, Function>}
 */
export const rules = new Map();

/**
 * Extrait les informations nécessaire pour lire la vidéo sur Kodi.
 *
 * @function action
 * @param {URL}    url      L'URL d'une vidéo Dumpert.
 * @param {string} url.href Le lien de l'URL.
 * @returns {string} Le lien du <em>fichier</em>.
 */
rules.set("*://www.dumpert.nl/mediabase/*", function ({ href }) {
    return PLUGIN_URL + encodeURIComponent(href);
});
