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
const action = async function ({ pathname }) {
    const response = await fetch(
        `https://www.dailymotion.com/player/metadata${pathname}`,
    );
    const json = await response.json();
    return json.title;
};
export const extract = matchPattern(action, "*://www.dailymotion.com/video/*");
