/**
 * @module
 */
/* eslint-disable require-await */

import { matchPattern } from "../../tools/matchpattern.js";

/**
 * L'URL de l'extension Plexus pour lire des liens Ace Stream.
 *
 * @constant {string}
 */
const PLUGIN_URL = "plugin://program.plexus/?mode=1&name=&url=";

/**
 * Extrait les informations nécessaire pour lire une vidéo sur Kodi.
 *
 * @param {URL} url L'URL d'une vidéo Ace Stream.
 * @returns {Promise.<string>} Une promesse contenant le lien du
 *                             <em>fichier</em>.
 */
const action = async function ({ href }) {
    return PLUGIN_URL + encodeURIComponent(href);
};
export const extract = matchPattern(action, "acestream://*");
