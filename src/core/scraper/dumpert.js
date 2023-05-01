/**
 * @module
 * @license MIT
 * @see https://www.dumpert.nl/
 * @author Sébastien Règne
 */
/* eslint-disable require-await */

import * as plugin from "../plugin/dumpert.js";
import { matchPattern } from "../tools/matchpattern.js";

/**
 * Extrait les informations nécessaire pour lire une vidéo sur Kodi.
 *
 * @param {URL} url L'URL d'une vidéo Dumpert.
 * @returns {Promise<string>} Une promesse contenant le lien du
 *                            <em>fichier</em>.
 */
const action = async function (url) {
    return plugin.generateUrl(url);
};
export const extract = matchPattern(
    action,
    "*://www.dumpert.nl/item/*",
    "*://www.dumpert.nl/mediabase/*",
);
