/**
 * @module
 * @license MIT
 * @see https://kodi.wiki/view/Add-on:YouTube
 * @author Sébastien Règne
 */

/**
 * L'URL de l'extension pour lire des vidéos issues de YouTube.
 *
 * @type {string}
 */
const PLUGIN_URL = "plugin://plugin.video.youtube";

/**
 * Génère l'URL d'une vidéo dans l'extension YouTube.
 *
 * @param {string}  videoId   L'identifiant de la vidéo YouTube.
 * @param {boolean} incognito La marque indiquant s'il faut lire la vidéo en
 *                            navigation privée.
 * @returns {string} Le lien du <em>fichier</em>.
 */
export const generateVideoUrl = function (videoId, incognito) {
    return (
        `${PLUGIN_URL}/play/?video_id=${videoId}` +
        `&incognito=${incognito.toString()}`
    );
};

/**
 * Génère l'URL d'une playlist dans l'extension YouTube.
 *
 * @param {string}  playlistId L'identifiant de la playlist YouTube.
 * @param {boolean} incognito  La marque indiquant s'il faut lire la playlist en
 *                             navigation privée.
 * @returns {Promise<string>} Une promesse contenant le lien du
 *                            <em>fichier</em>.
 */
export const generatePlaylistUrl = async function (playlistId, incognito) {
    const config = await browser.storage.local.get(["youtube-order"]);
    return (
        `${PLUGIN_URL}/play/?playlist_id=${playlistId}` +
        `&order=${config["youtube-order"]}&play=1` +
        `&incognito=${incognito.toString()}`
    );
};

/**
 * Génère l'URL d'un clip dans l'extension YouTube.
 *
 * @param {string}  clipId    L'identifiant du clip YouTube.
 * @param {boolean} incognito La marque indiquant s'il faut lire le clip en
 *                            navigation privée.
 * @returns {string} Le lien du <em>fichier</em>.
 */
export const generateClipUrl = function (clipId, incognito) {
    return (
        `${PLUGIN_URL}/uri2addon/?uri=` +
        encodeURIComponent(`https://www.youtube.com/clip/${clipId}`) +
        `&incognito=${incognito.toString()}`
    );
};
