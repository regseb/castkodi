/**
 * @module
 * @license MIT
 * @see https://kodi.wiki/view/Add-on:Twitch
 * @author Sébastien Règne
 */

/**
 * L'URL de l'extension pour lire des vidéos issues de Twitch.
 *
 * @type {string}
 */
const PLUGIN_URL = "plugin://plugin.video.twitch/?mode=play";

/**
 * Génère l'URL d'un _live_ dans l'extension Twitch.
 *
 * @param {string} channelName L'identifiant du _live_ Twitch.
 * @returns {string} Le lien du _fichier_.
 */
export const generateLiveUrl = (channelName) => {
    return `${PLUGIN_URL}&channel_name=${channelName}`;
};

/**
 * Génère l'URL d'une vidéo dans l'extension Twitch.
 *
 * @param {string} videoId L'identifiant de la vidéo Twitch.
 * @returns {string} Le lien du _fichier_.
 */
export const generateVideoUrl = (videoId) => {
    return `${PLUGIN_URL}&video_id=${videoId}`;
};

/**
 * Génère l'URL d'un clip dans l'extension Twitch.
 *
 * @param {string} slug L'identifiant du clip Twitch.
 * @returns {string} Le lien du _fichier_.
 */
export const generateClipUrl = (slug) => {
    return `${PLUGIN_URL}&slug=${slug}`;
};
