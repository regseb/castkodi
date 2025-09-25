/**
 * @module
 * @license MIT
 * @see https://kodi.wiki/view/Add-on:Tubed
 * @author Sébastien Règne
 */

/**
 * L'URL de l'extension pour lire des vidéos issues de YouTube.
 *
 * @type {string}
 */
const PLUGIN_URL = "plugin://plugin.video.tubed";

/**
 * Génère l'URL d'une vidéo dans l'extension Tubed.
 *
 * @param {string} videoId L'identifiant de la vidéo YouTube.
 * @returns {string} Le lien du _fichier_.
 */
export const generateVideoUrl = (videoId) => {
    return `${PLUGIN_URL}/?mode=play&video_id=${videoId}`;
};

/**
 * Génère l'URL d'une playlist dans l'extension Tubed.
 *
 * @param {string} playlistId L'identifiant de la playlist YouTube.
 * @returns {string} Le lien du _fichier_.
 */
export const generatePlaylistUrl = (playlistId) => {
    return `${PLUGIN_URL}/?mode=play&playlist_id=${playlistId}`;
};
