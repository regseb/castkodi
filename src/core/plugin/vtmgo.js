/**
 * @module
 * @license MIT
 * @see https://kodi.wiki/view/Add-on:VTM_GO
 * @author Sébastien Règne
 */

/**
 * L'URL de l'extension pour lire des vidéos issues de VTM GO.
 *
 * @type {string}
 */
const PLUGIN_URL = "plugin://plugin.video.vtm.go/play/catalog";

/**
 * Génère l'URL d'un épisode dans l'extension VTM GO.
 *
 * @param {string} episodeId L'identifiant de l'épisode VTM GO.
 * @returns {string} Le lien du <em>fichier</em>.
 */
export const generateEpisodeUrl = function (episodeId) {
    return `${PLUGIN_URL}/episodes/${episodeId}`;
};

/**
 * Génère l'URL d'un film dans l'extension VTM GO.
 *
 * @param {string} movieId L'identifiant du film VTM GO.
 * @returns {string} Le lien du <em>fichier</em>.
 */
export const generateMovieUrl = function (movieId) {
    return `${PLUGIN_URL}/movies/${movieId}`;
};

/**
 * Génère l'URL d'une chaine dans l'extension VTM GO.
 *
 * @param {string} channelId L'identifiant de la chaine VTM GO.
 * @returns {string} Le lien du <em>fichier</em>.
 */
export const generateChannelUrl = function (channelId) {
    return `${PLUGIN_URL}/channels/${channelId}`;
};
