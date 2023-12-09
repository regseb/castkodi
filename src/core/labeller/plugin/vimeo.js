/**
 * @module
 * @license MIT
 * @see https://kodi.wiki/view/Add-on:Vimeo
 * @author Sébastien Règne
 */

import { matchPattern } from "../../tools/matchpattern.js";

/**
 * Extrait le titre d'une vidéo Vimeo.
 *
 * @param {URL}      url                 L'URL utilisant le plugin Vimeo.
 * @param {Object}   context             Le contexte du labellisateur.
 * @param {Function} context.metaExtract La fonction parente pour extraire un
 *                                       label.
 * @returns {Promise<string|undefined>} Une promesse contenant le titre ou
 *                                      <code>undefined</code>.
 */
const action = function ({ searchParams }, { metaExtract }) {
    if (!searchParams.has("video_id")) {
        return Promise.resolve(undefined);
    }

    const [videoId, hash] = searchParams.get("video_id").split(":");
    return metaExtract(
        new URL(
            `https://vimeo.com/${videoId}` +
                (undefined === hash ? "" : `/${hash}`),
        ),
    );
};
export const extract = matchPattern(
    action,
    "plugin://plugin.video.vimeo/play/*",
);
