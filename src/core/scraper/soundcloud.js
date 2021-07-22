/**
 * @module
 */
/* eslint-disable require-await */

import { matchPattern } from "../../tools/matchpattern.js";
import * as plugin from "../plugin/soundcloud.js";

/**
 * Extrait les informations nécessaire pour lire une musique sur Kodi.
 *
 * @param {URL} url L'URL d'une musique SoundCloud.
 * @returns {Promise<string>} Une promesse contenant le lien du
 *                            <em>fichier</em>.
 */
const action = async function (url) {
    return plugin.generateUrl(url);
};
export const extract = matchPattern(action,
    "*://soundcloud.com/*",
    "*://mobi.soundcloud.com/*");
