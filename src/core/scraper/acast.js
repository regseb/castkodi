/**
 * @module
 */

import { matchPattern } from "../tools/matchpattern.js";

/**
 * Extrait les informations nécessaire pour lire un son sur Kodi.
 *
 * @param {URL} url L'URL d'un son intégré de Acast.
 * @returns {Promise<string>} Une promesse contenant le lien du
 *                            <em>fichier</em>.
 */
const action = function ({ pathname }) {
    const [, s, e] = pathname.split("/");
    return Promise.resolve(`https://sphinx.acast.com/p/open/s/${s}/e/${e}` +
                                                                  "/media.mp3");
};
export const extract = matchPattern(action, "*://embed.acast.com/*/*");
