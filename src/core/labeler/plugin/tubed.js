/**
 * @module
 * @license MIT
 * @see https://kodi.wiki/view/Add-on:Tubed
 * @see https://github.com/anxdpanic/plugin.video.tubed
 * @author Sébastien Règne
 */

import { matchURLPattern } from "../../tools/urlmatch.js";

/**
 * @import { URLMatch } from "../../tools/urlmatch.js"
 */

/**
 * Extrait le titre d'une vidéo ou d'une playlist YouTube.
 *
 * @param {URLMatch} url                 L'URL utilisant le plugin Tubed.
 * @param {Object}   context             Le contexte du labellisateur.
 * @param {Function} context.metaExtract La fonction parente pour extraire un
 *                                       label.
 * @returns {Promise<string|undefined>} Une promesse contenant le titre ou
 *                                      `undefined`.
 */
const action = ({ searchParams }, { metaExtract }) => {
    if (searchParams.has("video_id")) {
        return metaExtract(
            new URL(
                "https://www.youtube.com/watch?v=" +
                    searchParams.get("video_id"),
            ),
        );
    }
    if (searchParams.has("playlist_id")) {
        return metaExtract(
            new URL(
                "https://www.youtube.com/playlist?list=" +
                    searchParams.get("playlist_id"),
            ),
        );
    }
    return Promise.resolve(undefined);
};
export const extract = matchURLPattern(action, "plugin://plugin.video.tubed/*");
