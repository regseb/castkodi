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
 * Génère l'URL d'un <em>live</em> dans l'extension Twitch.
 *
 * @param {string} channelName L'identifiant du <em>live</em> Twitch.
 * @returns {string} Le lien du <em>fichier</em>.
 */
export const generateLiveUrl = function (channelName) {
    return `${PLUGIN_URL}&channel_name=${channelName}`;
};

/**
 * Génère l'URL d'une vidéo dans l'extension Twitch.
 *
 * @param {string} videoId L'identifiant de la vidéo Twitch.
 * @returns {string} Le lien du <em>fichier</em>.
 */
export const generateVideoUrl = function (videoId) {
    return `${PLUGIN_URL}&video_id=${videoId}`;
};

/**
 * Génère l'URL d'un clip dans l'extension Twitch.
 *
 * @param {string} clipId L'identifiant du clip Twitch.
 * @returns {string} Le lien du <em>fichier</em>.
 */
export const generateClipUrl = function (clipId) {
    return `${PLUGIN_URL}&slug=${clipId}`;
};
