/**
 * @module
 * @license MIT
 * @see https://kodi.wiki/view/Add-on:VTM_GO
 * @author Sébastien Règne
 */

import { matchPattern } from "../../tools/matchpattern.js";

/**
 * Extrait le titre d'un épisode VTM GO.
 *
 * @param {URL}      url                 L'URL utilisant le plugin VTM GO.
 * @param {Object}   context             Le contexte du labellisateur.
 * @param {Function} context.metaExtract La fonction parente pour extraire un
 *                                       label.
 * @returns {Promise<string|undefined>} Une promesse contenant le titre ou
 *                                      `undefined`.
 */
const actionEpisode = function ({ pathname }, { metaExtract }) {
    const episodeId = pathname.slice(23);
    return metaExtract(
        new URL(`https://www.vtmgo.be/vtmgo/afspelen/${episodeId}`),
    );
};
export const extractEpisode = matchPattern(
    actionEpisode,
    "plugin://plugin.video.vtm.go/play/catalog/episodes/*",
);

/**
 * Extrait le titre d'un film VTM GO.
 *
 * @param {URL}      url                 L'URL utilisant le plugin VTM GO.
 * @param {Object}   context             Le contexte du labellisateur.
 * @param {Function} context.metaExtract La fonction parente pour extraire un
 *                                       label.
 * @returns {Promise<string|undefined>} Une promesse contenant le titre ou
 *                                      `undefined`.
 */
const actionMovie = function ({ pathname }, { metaExtract }) {
    const movieId = pathname.slice(21);
    return metaExtract(
        new URL(`https://www.vtmgo.be/vtmgo/afspelen/${movieId}`),
    );
};
export const extractMovie = matchPattern(
    actionMovie,
    "plugin://plugin.video.vtm.go/play/catalog/movies/*",
);
