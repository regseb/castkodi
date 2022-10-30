/**
 * @module
 */

/**
 * Extrait le titre d'une vidéo YouTube.
 *
 * @param {string} videoId L'identifiant de la vidéo YouTube.
 * @returns {Promise<string>} Une promesse contenant le titre ou le texte pour
 *                            les vidéos non-disponibles.
 */
export const extractVideo = async function (videoId) {
    const response = await fetch(`https://www.youtube.com/watch?v=${videoId}`);
    const text = await response.text();
    const doc = new DOMParser().parseFromString(text, "text/html");
    return doc.querySelector(`meta[property="og:title"]`)?.content ??
           browser.i18n.getMessage("labeller_youtube_unavailable");
};

/**
 * Extrait le titre d'une playlist YouTube.
 *
 * @param {string} playlistId L'identifiant de la playlist YouTube.
 * @returns {Promise<string>} Une promesse contenant le titre ou le texte par
 *                            défaut pour les playlists sans titre.
 */
export const extractPlaylist = async function (playlistId) {
    const response = await fetch("https://www.youtube.com/playlist" +
                                                         `?list=${playlistId}`);
    const text = await response.text();
    const doc = new DOMParser().parseFromString(text, "text/html");
    const label = doc.querySelector(`meta[property="og:title"]`).content;
    return "null" === label ? browser.i18n.getMessage("labeller_youtube_mix")
                            : label;
};
