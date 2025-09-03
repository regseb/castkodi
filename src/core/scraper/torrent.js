/**
 * @module
 * @license MIT
 * @see https://en.wikipedia.org/wiki/BitTorrent
 * @see https://en.wikipedia.org/wiki/Magnet_URI_scheme
 * @author Sébastien Règne
 */

import * as plugin from "../plugin/elementum.js";
import { matchURLPattern } from "../tools/urlmatch.js";

/**
 * @import { URLMatch } from "../tools/urlmatch.js"
 */

/**
 * Extrait les informations nécessaires pour lire une vidéo sur Kodi.
 *
 * @param {URLMatch} url L'URL d'un torrent ou d'un magnet.
 * @returns {Promise<string>} Une promesse contenant le lien du _fichier_.
 */
const action = (url) => {
    return Promise.resolve(plugin.generateUrl(url));
};
export const extract = matchURLPattern(action, "*://*/*.torrent", "magnet:*");
