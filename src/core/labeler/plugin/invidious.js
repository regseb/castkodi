/**
 * @module
 * @license MIT
 * @see https://github.com/lekma/plugin.video.invidious
 * @author David Magnus Henriques
 */

import { matchURLPattern } from "../../tools/urlmatch.js";

/**
 * @import { URLMatch } from "../../tools/urlmatch.js"
 */

/**
 * Extrait le titre d'une vidéo ou d'une playlist Invidious.
 *
 * @param {URLMatch} url                 L'URL utilisant le plugin Invidious.
 * @param {Object}   context             Le contexte du labellisateur.
 * @param {Function} context.metaExtract La fonction parente pour extraire un
 *                                       label.
 * @returns {Promise<string|undefined>} Une promesse contenant le titre ou
 *                                      `undefined`.
 */
const action = ({ searchParams }, { metaExtract }) => {
    if (searchParams.has("videoId")) {
        return metaExtract(
            new URL(
                "https://www.youtube.com/watch?v=" +
                    searchParams.get("videoId"),
            ),
        );
    }
    return Promise.resolve(undefined);
};
export const extract = matchURLPattern(
    action,
    "plugin://plugin.video.invidious/*",
);
