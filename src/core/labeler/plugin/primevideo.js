/**
 * @module
 * @license MIT
 * @see https://github.com/Sandmann79/xbmc/tree/HEAD/plugin.video.amazon-test
 * @author Sébastien Règne
 */

import { matchPattern } from "../../tools/matchpattern.js";

/**
 * Extrait le titre d'une vidéo Prime Video (Amazon).
 *
 * @param {URL} url L'URL utilisant le plugin Amazon Prime Video.
 * @returns {Promise<string|undefined>} Une promesse contenant le titre ou
 *                                      <code>undefined</code>.
 */
const action = function ({ searchParams }) {
    return Promise.resolve(searchParams.get("name") ?? undefined);
};
export const extract = matchPattern(
    action,
    "plugin://plugin.video.amazon-test/*",
);
