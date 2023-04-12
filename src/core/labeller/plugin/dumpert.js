/**
 * @module
 * @license MIT
 * @see https://kodi.wiki/view/Add-on:Dumpert
 * @author Sébastien Règne
 */
/* eslint-disable require-await */

import { matchPattern } from "../../tools/matchpattern.js";

/**
 * Extrait le titre d'une vidéo Dumpert.
 *
 * @param {URL}      url                 L'URL utilisant le plugin Dumpert.
 * @param {Object}   context             Le contexte du labellisateur.
 * @param {Function} context.metaExtract La fonction parente pour extraire un
 *                                       label.
 * @returns {Promise<string|undefined>} Une promesse contenant le titre ou
 *                                      <code>undefined</code>.
 */
const action = async function ({ searchParams }, { metaExtract }) {
    return searchParams.has("video_page_url")
        ? metaExtract(
              new URL(decodeURIComponent(searchParams.get("video_page_url"))),
          )
        : undefined;
};
export const extract = matchPattern(action, "plugin://plugin.video.dumpert/*");
