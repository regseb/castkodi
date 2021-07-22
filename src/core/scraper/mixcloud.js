/**
 * @module
 */
/* eslint-disable require-await */

import { matchPattern } from "../../tools/matchpattern.js";
import * as plugin from "../plugin/mixcloud.js";

/**
 * Extrait les informations nécessaire pour lire une musique sur Kodi.
 *
 * @param {URL} url L'URL d'une musique Mixcloud.
 * @returns {Promise<?string>} Une promesse contenant le lien du
 *                             <em>fichier</em> ou <code>null</code>.
 */
const action = async function ({ pathname }) {
    return pathname.startsWith("/discover/") ? null
                                             : plugin.generateUrl(pathname);
};
export const extract = matchPattern(action, "*://www.mixcloud.com/*/*/");
