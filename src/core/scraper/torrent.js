/**
 * @module
 * @license MIT
 * @see https://en.wikipedia.org/wiki/BitTorrent
 * @see https://en.wikipedia.org/wiki/Magnet_URI_scheme
 * @author Sébastien Règne
 */

import * as plugin from "../plugin/elementum.js";
import { matchPattern } from "../tools/matchpattern.js";

/**
 * Extrait les informations nécessaires pour lire une vidéo sur Kodi.
 *
 * @param {URL} url L'URL d'un torrent ou d'un magnet.
 * @returns {Promise<string>} Une promesse contenant le lien du
 *                            <em>fichier</em>.
 */
const action = function (url) {
    return Promise.resolve(plugin.generateUrl(url));
};
export const extract = matchPattern(action, "*://*/*.torrent", "magnet:*");
