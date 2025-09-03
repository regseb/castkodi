/**
 * @module
 * @license MIT
 * @see https://kodi.wiki/view/Add-on:DailyMotion.com
 * @author Sébastien Règne
 */

import { matchURLPattern } from "../../tools/urlmatch.js";

/**
 * @import { URLMatch } from "../../tools/urlmatch.js"
 */

/**
 * Extrait le titre d'une vidéo Dailymotion.
 *
 * @param {URLMatch} url                 L'URL utilisant le plugin Dailymotion.
 * @param {Object}   context             Le contexte du labellisateur.
 * @param {Function} context.metaExtract La fonction parente pour extraire un
 *                                       label.
 * @returns {Promise<string|undefined>} Une promesse contenant le titre ou
 *                                      `undefined`.
 */
const action = ({ searchParams }, { metaExtract }) => {
    return searchParams.has("url")
        ? metaExtract(
              new URL(
                  "https://www.dailymotion.com/video/" +
                      searchParams.get("url"),
              ),
          )
        : Promise.resolve(undefined);
};
export const extract = matchURLPattern(
    action,
    "plugin://plugin.video.dailymotion_com/*",
);
