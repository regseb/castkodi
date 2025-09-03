/**
 * @module
 * @license MIT
 * @see https://github.com/Sandmann79/xbmc/tree/HEAD/plugin.video.amazon-test
 * @author Sébastien Règne
 */

import { matchURLPattern } from "../../tools/urlmatch.js";

/**
 * @import { URLMatch } from "../../tools/urlmatch.js"
 */

/**
 * Extrait le titre d'une vidéo Prime Video (Amazon).
 *
 * @param {URLMatch} url L'URL utilisant le plugin Amazon Prime Video.
 * @returns {Promise<string|undefined>} Une promesse contenant le titre ou
 *                                      `undefined`.
 */
const action = ({ searchParams }) => {
    return Promise.resolve(searchParams.get("name") ?? undefined);
};
export const extract = matchURLPattern(
    action,
    "plugin://plugin.video.amazon-test/*",
);
