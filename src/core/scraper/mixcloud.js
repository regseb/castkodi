/**
 * @module
 * @license MIT
 * @see https://www.mixcloud.com/
 * @author Sébastien Règne
 */
/* eslint-disable require-await */

import * as plugin from "../plugin/mixcloud.js";
import { matchPattern } from "../tools/matchpattern.js";

/**
 * Extrait les informations nécessaire pour lire une musique sur Kodi.
 *
 * @param {URL} url L'URL d'une musique Mixcloud.
 * @returns {Promise<string|undefined>} Une promesse contenant le lien du
 *                                      <em>fichier</em> ou
 *                                      <code>undefined</code>.
 */
const action = async function ({ pathname }) {
    return pathname.startsWith("/discover/")
        ? undefined
        : plugin.generateUrl(pathname);
};
export const extract = matchPattern(action, "*://www.mixcloud.com/*/*/");
