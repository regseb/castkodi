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
 * @param {string} episodeUuid L'UUID de l'épisode VTM GO.
 * @returns {string} Le lien du _fichier_.
 */
export const generateEpisodeUrl = function (episodeUuid) {
    return `${PLUGIN_URL}/episodes/${episodeUuid}`;
};

/**
 * Génère l'URL d'un film dans l'extension VTM GO.
 *
 * @param {string} movieUuid L'UUID du film VTM GO.
 * @returns {string} Le lien du _fichier_.
 */
export const generateMovieUrl = function (movieUuid) {
    return `${PLUGIN_URL}/movies/${movieUuid}`;
};

/**
 * Génère l'URL d'une chaine dans l'extension VTM GO.
 *
 * @param {string} channelUuid L'identifiant de la chaine VTM GO.
 * @returns {string} Le lien du _fichier_.
 */
export const generateChannelUrl = function (channelUuid) {
    return `${PLUGIN_URL}/channels/${channelUuid}`;
};
