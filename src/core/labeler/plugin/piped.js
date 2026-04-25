/**
 * @module
 * @license MIT
 * @see https://kodi.wiki/view/Add-on:Piped
 * @see https://github.com/syhlx/plugin.video.piped
 * @author Sébastien Règne
 */

import { matchURLPattern } from "../../tools/urlmatch.js";

/**
 * @import { URLMatch } from "../../tools/urlmatch.js"
 */

/**
 * Extrait le titre d'une vidéo ou d'une playlist YouTube.
 *
 * @param {URLMatch} url                 L'URL utilisant le plugin Piped.
 * @param {Object}   context             Le contexte du labellisateur.
 * @param {Function} context.metaExtract La fonction parente pour extraire un
 *                                       label.
 * @returns {Promise<string|undefined>} Une promesse contenant le titre ou
 *                                      `undefined`.
 */
const action = ({ videoId }, { metaExtract }) => {
    return metaExtract(new URL(`https://www.youtube.com/watch?v=${videoId}`));
};
export const extract = matchURLPattern(
    action,
    "plugin://plugin.video.piped/watch/:videoId",
);
