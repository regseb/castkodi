/**
 * @module
 */
/* eslint-disable require-await */

/**
 * Extrait le titre d'une vidéo Vimeo.
 *
 * @param {string} videoId L'identifiant de la vidéo Vimeo.
 * @returns {Promise<string>} Une promesse contenant le titre.
 */
export const extract = async function (videoId) {
    const response = await fetch(`https://vimeo.com/${videoId}`);
    const text = await response.text();
    const doc = new DOMParser().parseFromString(text, "text/html");
    return doc.querySelector(`meta[property="og:title"]`).content;
};
