/**
 * @module
 * @license MIT
 * @see https://kodi.wiki/view/Add-on:VTM_GO
 * @see https://github.com/add-ons/plugin.video.vtm.go
 * @author Sébastien Règne
 */

import { matchURLPattern } from "../../tools/urlmatch.js";

/**
 * @import { URLMatch } from "../../tools/urlmatch.js"
 */

/**
 * Extrait le titre d'un épisode ou d'un film VTM GO.
 *
 * @param {URLMatch} urlMatch            L'URL utilisant le plugin VTM GO avec
 *                                       l'identifiant de la vidéo.
 * @param {Object}   context             Le contexte du labellisateur.
 * @param {Function} context.metaExtract La fonction parente pour extraire un
 *                                       label.
 * @returns {Promise<string|undefined>} Une promesse contenant le titre ou
 *                                      `undefined`.
 */
const action = ({ videoId }, { metaExtract }) => {
    return metaExtract(
        new URL(`https://www.vtmgo.be/vtmgo/afspelen/${videoId}`),
    );
};
export const extract = matchURLPattern(
    action,
    "plugin://plugin.video.vtm.go/play/catalog/episodes/:videoId",
    "plugin://plugin.video.vtm.go/play/catalog/movies/:videoId",
);
