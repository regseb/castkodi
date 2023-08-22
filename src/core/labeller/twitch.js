/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import { matchPattern } from "../tools/matchpattern.js";

/**
 * Extrait le titre d'un <em>live</em> ou d'une vidéo Twitch.
 *
 * @param {URL} url L'URL du <em>live</em> ou de la vidéo Twitch.
 * @returns {Promise<string>} Une promesse contenant le titre.
 */
const action = async function ({ href }) {
    // Consulter la page en passant par la version mobile, car la version
    // classique charge le contenu de la page en asynchrone avec des APIs.
    const response = await fetch(href.replace("://www.", "://m."));
    const text = await response.text();
    const doc = new DOMParser().parseFromString(text, "text/html");
    const title = doc.querySelector("title").textContent;
    return title.slice(0, title.lastIndexOf(" - "));
};
export const extract = matchPattern(action, "*://www.twitch.tv/*");
