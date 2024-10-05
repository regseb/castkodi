/**
 * @module
 * @license MIT
 * @see https://kodi.wiki/view/Add-on:SoundCloud
 * @author Sébastien Règne
 */

import { matchPattern } from "../../tools/matchpattern.js";

/**
 * Extrait le titre d'un son SoundCloud.
 *
 * @param {URL}      url                 L'URL utilisant le plugin SoundCloud.
 * @param {Object}   context             Le contexte du labellisateur.
 * @param {Function} context.metaExtract La fonction parente pour extraire un
 *                                       label.
 * @returns {Promise<string|undefined>} Une promesse contenant le titre ou
 *                                      `undefined`.
 */
const action = function ({ searchParams }, { metaExtract }) {
    return searchParams.has("url")
        ? metaExtract(new URL(decodeURIComponent(searchParams.get("url"))))
        : Promise.resolve(undefined);
};
export const extract = matchPattern(
    action,
    "plugin://plugin.audio.soundcloud/play/*",
);
