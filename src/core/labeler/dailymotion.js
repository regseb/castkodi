/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import { matchURLPattern } from "../tools/urlmatch.js";

/**
 * @import { URLMatch } from "../tools/urlmatch.js"
 */

/**
 * Extrait le titre d'une vidéo Dailymotion.
 *
 * @param {URLMatch} url L'URL de la vidéo Dailymotion.
 * @returns {Promise<string>} Une promesse contenant le titre.
 */
const action = async ({ pathname }) => {
    const response = await fetch(
        `https://www.dailymotion.com/player/metadata${pathname}`,
    );
    const json = await response.json();
    return json.title;
};
export const extract = matchURLPattern(
    action,
    "https://www.dailymotion.com/video/*",
);
