/**
 * @module
 */
/* eslint-disable require-await */

/**
 * Extrait le titre d'un <em>live</em> Twitch.
 *
 * @param {string} channelName L'identifiant du <em>live</em> Twitch.
 * @returns {Promise<string>} Une promesse contenant le titre.
 */
export const extractLive = async function (channelName) {
    // Consulter la page du live en passant par la version mobile car la version
    // classique charge le contenu de la page en asynchrone avec des APIs.
    const response = await fetch(`https://m.twitch.tv/${channelName}`);
    const text = await response.text();
    const doc = new DOMParser().parseFromString(text, "text/html");
    const title = doc.querySelector("title").textContent;
    return title.slice(0, title.lastIndexOf(" - "));
};

/**
 * Extrait le titre d'une vidéo Twitch.
 *
 * @param {string} videoId L'identifiant de la vidéo Twitch.
 * @returns {Promise<string>} Une promesse contenant le titre.
 */
export const extractVideo = async function (videoId) {
    // Consulter la page de la vidéo en passant par la version mobile car la
    // version classique charge le contenu de la page en asynchrone avec des
    // APIs.
    const response = await fetch(`https://m.twitch.tv/videos/${videoId}`);
    const text = await response.text();
    const doc = new DOMParser().parseFromString(text, "text/html");
    const title = doc.querySelector("title").textContent;
    return title.slice(0, title.lastIndexOf(" - "));
};

/**
 * Extrait le titre d'un clip Twitch.
 *
 * @param {string} clipId L'identifiant du clip Twitch.
 * @returns {Promise<string>} Une promesse contenant le titre.
 */
export const extractClip = async function (clipId) {
    return clipId;
};
