/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

/**
 * Extrait le titre d'une vidéo Dailymotion.
 *
 * @param {string} videoId L'identifiant de la vidéo Dailymotion.
 * @returns {Promise<string>} Une promesse contenant le titre.
 */
export const extract = async function (videoId) {
    const response = await fetch(
        `https://www.dailymotion.com/video/${videoId}`,
    );
    const text = await response.text();
    const doc = new DOMParser().parseFromString(text, "text/html");
    const label = doc.querySelector('meta[property="og:title"]').content;
    return label.slice(0, label.lastIndexOf(" - "));
};
