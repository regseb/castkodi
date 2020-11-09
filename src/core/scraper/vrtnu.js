/**
 * @module
 */
/* eslint-disable require-await */

import { matchPattern } from "../../tools/matchpattern.js";

/**
 * L'URL de l'extension pour lire des vidéos issues de VRT NU.
 *
 * @constant {string}
 */
const PLUGIN_URL = "plugin://plugin.video.vrt.nu/play/url/";

/**
 * Extrait les informations nécessaire pour lire une vidéo sur Kodi.
 *
 * @param {URL} url L'URL d'une vidéo VRT NU.
 * @returns {Promise<string>} Une promesse contenant le lien du
 *                            <em>fichier</em>.
 */
const action = async function ({ href }) {
    return PLUGIN_URL + href;
};
export const extract = matchPattern(action,
    "*://www.vrt.be/vrtnu/a-z/*",
    "*://vrt.be/vrtnu/a-z/*",
    "*://vrtnu.page.link/*");
