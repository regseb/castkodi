/**
 * @module
 * @license MIT
 * @see https://kodi.wiki/view/Add-on:YouTube
 * @author Sébastien Règne
 */
/* eslint-disable require-await */

import { matchPattern } from "../../tools/matchpattern.js";

/**
 * Extrait le titre d'une vidéo ou d'une playlist YouTube.
 *
 * @param {URL}      url                 L'URL utilisant le plugin YouTube.
 * @param {Object}   context             Le contexte du labellisateur.
 * @param {Function} context.metaExtract La fonction parente pour extraire un
 *                                       label.
 * @returns {Promise<string|undefined>} Une promesse contenant le titre ou
 *                                      <code>undefined</code>.
 */
const action = async function ({ searchParams }, { metaExtract }) {
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
    return undefined;
};
export const extract = matchPattern(
    action,
    "plugin://plugin.video.youtube/play/*",
);
