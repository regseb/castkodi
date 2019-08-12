/**
 * @module
 */

/**
 * L'URL de l'extension pour lire des musiques issues de SoundCloud.
 *
 * @constant {string}
 */
const PLUGIN_URL = "plugin://plugin.audio.soundcloud/play/?audio_id=";

/**
 * Les règles avec les patrons et leur action.
 *
 * @constant {Map.<string, Function>}
 */
export const rules = new Map();

/**
 * Extrait les informations nécessaire pour lire une musique sur Kodi.
 *
 * @function action
 * @param {URL}             url              L'URL d'une musique My Cloud
 *                                           Player.
 * @param {URLSearchParams} url.searchParams Les paramètres de l'URL.
 * @returns {?string} Le lien du <em>fichier</em> ou <code>null</code>.
 */
rules.set("*://mycloudplayers.com/*", function ({ searchParams }) {
    return searchParams.has("play") ? PLUGIN_URL + searchParams.get("play")
                                    : null;
});
