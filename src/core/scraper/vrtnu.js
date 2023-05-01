/**
 * @module
 * @license MIT
 * @see https://www.vrt.be/
 * @author Sébastien Règne
 */
/* eslint-disable require-await */

import * as plugin from "../plugin/vrtnu.js";
import { matchPattern } from "../tools/matchpattern.js";

/**
 * Extrait les informations nécessaire pour lire une vidéo sur Kodi.
 *
 * @param {URL} url L'URL d'une vidéo VRT NU.
 * @returns {Promise<string>} Une promesse contenant le lien du
 *                            <em>fichier</em>.
 */
const action = async function (url) {
    return plugin.generateUrl(url);
};
export const extract = matchPattern(
    action,
    "*://www.vrt.be/vrtnu/a-z/*",
    "*://vrt.be/vrtnu/a-z/*",
    "*://vrtnu.page.link/*",
);
