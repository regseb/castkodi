/**
 * @module
 */
/* eslint-disable require-await */

/**
 * Extrait le titre d'une vidéo Dumpert.
 *
 * @param {URL} videoUrl L'URL de la vidéo Dumpert.
 * @returns {Promise<string>} Une promesse contenant le titre.
 */
export const extract = async function ({ href }) {
    const response = await fetch(href);
    const text = await response.text();
    const doc = new DOMParser().parseFromString(text, "text/html");
    return doc.querySelector(`meta[property="og:title"]`).content;
};
