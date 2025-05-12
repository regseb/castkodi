/**
 * @module
 * @license MIT
 * @see https://www.acestream.org/
 * @author Sébastien Règne
 */

import * as plugin from "../plugin/plexus.js";
import { matchPattern } from "../tools/matchpattern.js";

/**
 * Extrait les informations nécessaires pour lire une vidéo sur Kodi.
 *
 * @param {URL} url L'URL d'une vidéo Ace Stream.
 * @returns {Promise<string>} Une promesse contenant le lien du _fichier_.
 */
const action = (url) => {
    return Promise.resolve(plugin.generateUrl(url));
};
export const extract = matchPattern(action, "acestream://*");
