/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import { matchPattern } from "../tools/matchpattern.js";

/**
 * Extrait le titre d'une vidéo Dailymotion.
 *
 * @param {URL} url L'URL de la vidéo Dailymotion.
 * @returns {Promise<string>} Une promesse contenant le titre.
 */
const action = async function (url) {
    const response = await fetch(url);
    const text = await response.text();
    const doc = new DOMParser().parseFromString(text, "text/html");
    const label = doc.querySelector('meta[property="og:title"]').content;
    return label.slice(0, label.lastIndexOf(" - "));
};
export const extract = matchPattern(action, "*://www.dailymotion.com/video/*");
