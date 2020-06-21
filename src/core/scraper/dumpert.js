/**
 * @module
 */
/* eslint-disable require-await */

import { matchPattern } from "../../tools/matchpattern.js";

/**
 * L'URL de l'extension pour lire des vidéos issues de Dumpert.
 *
 * @constant {string}
 */
const PLUGIN_URL = "plugin://plugin.video.dumpert/?action=play&video_page_url=";

/**
 * Extrait les informations nécessaire pour lire la vidéo sur Kodi.
 *
 * @param {URL} url L'URL d'une vidéo Dumpert.
 * @returns {Promise.<string>} Une promesse contenant le lien du
 *                             <em>fichier</em>.
 */
const action = async function ({ href }) {
    return PLUGIN_URL + encodeURIComponent(href);
};
export const extract = matchPattern(action,
    "*://www.dumpert.nl/item/*",
    "*://www.dumpert.nl/mediabase/*");
