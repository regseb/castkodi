/**
 * @module
 * @license MIT
 * @see https://github.com/firsttris/plugin.video.sendtokodi
 * @author Sébastien Règne
 */

import { matchPattern } from "../../tools/matchpattern.js";

/**
 * Extrait le titre d'une vidéo lue par SendToKodi.
 *
 * @param {URL}      url                 L'URL utilisant le plugin SendToKodi.
 * @param {Object}   context             Le contexte du labellisateur.
 * @param {Function} context.metaExtract La fonction parente pour extraire un
 *                                       label.
 * @returns {Promise<string>} Une promesse contenant le titre.
 */
const action = async ({ search }, { metaExtract }) => {
    const label = await metaExtract(new URL(search.slice(1)));
    return label ?? search.slice(1);
};
export const extract = matchPattern(
    action,
    "plugin://plugin.video.sendtokodi/?*",
);
